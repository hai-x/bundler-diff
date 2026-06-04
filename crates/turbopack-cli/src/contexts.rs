use std::fmt;

use anyhow::{Result, bail};
use turbo_rcstr::{RcStr, rcstr};
use turbo_tasks::{ResolvedVc, Vc};
use turbo_tasks_fs::FileSystemPath;
use turbopack::{
    ModuleAssetContext,
    module_options::{
        EcmascriptOptionsContext, JsxTransformOptions, LoaderRuleItem, ModuleOptionsContext,
        TypescriptTransformOptions, WebpackLoaderBuiltinConditionSet,
        WebpackLoaderBuiltinConditionSetMatch, WebpackLoadersOptions,
    },
};
use turbopack_browser::react_refresh::assert_can_resolve_react_refresh;
use turbopack_core::{
    chunk::SourceMapsType,
    compile_time_defines,
    compile_time_info::{CompileTimeDefines, CompileTimeInfo},
    condition::ContextCondition,
    context::AssetContext,
    environment::{BrowserEnvironment, Environment, ExecutionEnvironment},
    free_var_references,
    ident::Layer,
    resolve::{
        ExternalTraced, ExternalType,
        options::{ImportMap, ImportMapping},
    },
};
use turbopack_ecmascript::TreeShakingMode;
use turbopack_node::{
    execution_context::ExecutionContext,
    transforms::{
        postcss::PostCssTransformOptions,
        webpack::{WebpackLoaderItem, WebpackLoaderItems},
    },
};
use turbopack_resolve::resolve_options_context::ResolveOptionsContext;

#[turbo_tasks::value(shared)]
pub enum NodeEnv {
    Development,
    Production,
}

impl fmt::Display for NodeEnv {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            NodeEnv::Development => f.write_str("development"),
            NodeEnv::Production => f.write_str("production"),
        }
    }
}

#[turbo_tasks::value]
struct CliWebpackLoaderBuiltinConditionSet;

#[turbo_tasks::value_impl]
impl CliWebpackLoaderBuiltinConditionSet {
    #[turbo_tasks::function]
    fn new() -> Vc<Box<dyn WebpackLoaderBuiltinConditionSet>> {
        Vc::upcast::<Box<dyn WebpackLoaderBuiltinConditionSet>>(
            CliWebpackLoaderBuiltinConditionSet.cell(),
        )
    }
}

#[turbo_tasks::value_impl]
impl WebpackLoaderBuiltinConditionSet for CliWebpackLoaderBuiltinConditionSet {
    fn match_condition(&self, _condition: &str) -> WebpackLoaderBuiltinConditionSetMatch {
        WebpackLoaderBuiltinConditionSetMatch::Invalid
    }
}

fn foreign_code_context_condition() -> ContextCondition {
    ContextCondition::InNodeModules
}

async fn get_webpack_loaders_options(
    webpack_loader_rules: &[RcStr],
) -> Result<Option<ResolvedVc<WebpackLoadersOptions>>> {
    if webpack_loader_rules.is_empty() {
        return Ok(None);
    }

    let mut rules = Vec::with_capacity(webpack_loader_rules.len());
    for rule in webpack_loader_rules {
        let Some((glob, loader)) = rule.split_once('=') else {
            bail!("webpack loader rule must be formatted as `<glob>=<loader>`: {rule}");
        };

        rules.push((
            RcStr::from(glob),
            LoaderRuleItem {
                loaders: ResolvedVc::<WebpackLoaderItems>::cell(vec![WebpackLoaderItem {
                    loader: RcStr::from(loader),
                    options: Default::default(),
                }]),
                rename_as: None,
                condition: None,
                module_type: None,
            },
        ));
    }

    Ok(Some(
        WebpackLoadersOptions {
            rules: ResolvedVc::cell(rules),
            builtin_conditions: CliWebpackLoaderBuiltinConditionSet::new()
                .to_resolved()
                .await?,
            loader_runner_package: Some(
                ImportMapping::External(
                    Some(rcstr!("loader-runner")),
                    ExternalType::CommonJs,
                    ExternalTraced::Untraced,
                )
                .resolved_cell(),
            ),
        }
        .resolved_cell(),
    ))
}

#[turbo_tasks::function]
pub async fn get_client_import_map(project_path: FileSystemPath) -> Result<Vc<ImportMap>> {
    let mut import_map = ImportMap::empty();

    import_map.insert_singleton_alias(rcstr!("@swc/helpers"), project_path.clone());
    import_map.insert_singleton_alias(rcstr!("styled-jsx"), project_path.clone());
    import_map.insert_singleton_alias(rcstr!("react"), project_path.clone());
    import_map.insert_singleton_alias(rcstr!("react-dom"), project_path.clone());

    Ok(import_map.cell())
}

#[turbo_tasks::function]
pub async fn get_client_resolve_options_context(
    project_path: FileSystemPath,
    node_env: Vc<NodeEnv>,
) -> Result<Vc<ResolveOptionsContext>> {
    let next_client_import_map = get_client_import_map(project_path.clone())
        .to_resolved()
        .await?;
    let module_options_context = ResolveOptionsContext {
        enable_node_modules: Some(project_path.root().owned().await?),
        custom_conditions: vec![node_env.await?.to_string().into(), rcstr!("browser")],
        import_map: Some(next_client_import_map),
        browser: true,
        module: true,
        ..Default::default()
    };
    Ok(ResolveOptionsContext {
        enable_typescript: true,
        enable_react: true,
        rules: vec![(
            foreign_code_context_condition(),
            module_options_context.clone().resolved_cell(),
        )],
        ..module_options_context
    }
    .cell())
}

#[turbo_tasks::function]
async fn get_client_module_options_context(
    project_path: FileSystemPath,
    execution_context: ResolvedVc<ExecutionContext>,
    env: ResolvedVc<Environment>,
    node_env: Vc<NodeEnv>,
    source_maps_type: SourceMapsType,
    webpack_loader_rules: Vec<RcStr>,
) -> Result<Vc<ModuleOptionsContext>> {
    let is_dev = matches!(*node_env.await?, NodeEnv::Development);
    let module_options_context = ModuleOptionsContext {
        environment: Some(env),
        execution_context: Some(execution_context),
        tree_shaking_mode: Some(TreeShakingMode::ReexportsOnly),
        keep_last_successful_parse: is_dev,
        ..Default::default()
    };

    let resolve_options_context =
        get_client_resolve_options_context(project_path.clone(), node_env);

    let enable_react_refresh = is_dev
        && assert_can_resolve_react_refresh(project_path.clone(), resolve_options_context)
            .await?
            .is_found();

    let enable_jsx = Some(
        JsxTransformOptions {
            react_refresh: enable_react_refresh,
            ..Default::default()
        }
        .resolved_cell(),
    );

    let enable_webpack_loaders = get_webpack_loaders_options(&webpack_loader_rules).await?;

    let module_options_context = ModuleOptionsContext {
        ecmascript: EcmascriptOptionsContext {
            enable_jsx,
            enable_import_as_bytes: true,
            enable_typescript_transform: Some(
                TypescriptTransformOptions::default().resolved_cell(),
            ),
            source_maps: source_maps_type,
            ..module_options_context.ecmascript.clone()
        },
        enable_postcss_transform: Some(PostCssTransformOptions::default().resolved_cell()),
        enable_webpack_loaders,
        rules: vec![(
            foreign_code_context_condition(),
            module_options_context.clone().resolved_cell(),
        )],
        ..module_options_context
    }
    .cell();

    Ok(module_options_context)
}

#[turbo_tasks::function]
pub fn get_client_asset_context(
    project_path: FileSystemPath,
    execution_context: Vc<ExecutionContext>,
    compile_time_info: Vc<CompileTimeInfo>,
    node_env: Vc<NodeEnv>,
    source_maps_type: SourceMapsType,
    webpack_loader_rules: Vec<RcStr>,
) -> Vc<Box<dyn AssetContext>> {
    let resolve_options_context =
        get_client_resolve_options_context(project_path.clone(), node_env);
    let module_options_context = get_client_module_options_context(
        project_path,
        execution_context,
        compile_time_info.environment(),
        node_env,
        source_maps_type,
        webpack_loader_rules,
    );

    let asset_context: Vc<Box<dyn AssetContext>> = Vc::upcast(ModuleAssetContext::new(
        Default::default(),
        compile_time_info,
        module_options_context,
        resolve_options_context,
        Layer::new_with_user_friendly_name(rcstr!("client"), rcstr!("Pages Router Client")),
    ));

    asset_context
}

fn client_defines(node_env: &NodeEnv) -> CompileTimeDefines {
    compile_time_defines!(
        process.turbopack = true,
        process.env.TURBOPACK = "1",
        process.env.NODE_ENV = node_env.to_string()
    )
}

#[turbo_tasks::function]
pub async fn get_client_compile_time_info(
    browserslist_query: RcStr,
    node_env: Vc<NodeEnv>,
    hot_module_replacement_enabled: bool,
) -> Result<Vc<CompileTimeInfo>> {
    let node_env = node_env.await?;
    CompileTimeInfo::builder(
        Environment::new(ExecutionEnvironment::Browser(
            BrowserEnvironment {
                dom: true,
                web_worker: false,
                service_worker: false,
                browserslist_query,
            }
            .resolved_cell(),
        ))
        .to_resolved()
        .await?,
    )
    .defines(client_defines(&node_env).resolved_cell())
    .free_var_references(
        free_var_references!(..client_defines(&node_env).into_iter()).resolved_cell(),
    )
    .hot_module_replacement_enabled(hot_module_replacement_enabled)
    .cell()
    .await
}
