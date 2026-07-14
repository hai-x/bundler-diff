// Browser build: requires DOM. Marker: DOM_BUILD
const element = document.createElement("i");

export function decode(value) {
	element.innerHTML = `&${value};`;
	return `DOM_BUILD:${element.textContent}`;
}
