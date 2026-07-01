# bundler-diff

## Setup

```sh
pnpm install
mkdir -p node_modules

if [ -L node_modules/webpack ]; then
  rm node_modules/webpack
elif [ -e node_modules/webpack ]; then
  echo "node_modules/webpack exists and is not a symlink" >&2
  exit 1
fi

ln -s <LOCAL_WEBPACK_REPO> node_modules/webpack
```

Replace `<LOCAL_WEBPACK_REPO>` with the local webpack repository path.
