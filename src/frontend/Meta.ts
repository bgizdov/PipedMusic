export let config = {
	site_name: "Piped Music",
	title: "Piped Music",
	desc: "YouTube Music privacy-friendly alternative client",
	author: "CodeSpace.cz",
	title_suffix: " · Piped Music",
	use_title_suffix: true,
	lang: "cs",
	image: "/icon.png",
	image_type: "icon",
	favicon: "/favicon.ico"
};

export function genMeta(meta: Partial<SimplifiedMeta>) {
	let m: SimplifiedMeta = Object.assign({}, config, meta);
	return {
		title: m.title + (m.use_title_suffix ? m.title_suffix : ""),
		meta: [
			{name: "theme-color", content: "#D9234A"},
			{name: "description", content: m.desc},
			{property: "og:site_name", content: m.site_name},
			{property: "og:title", content: m.title},
			{property: "og:description", content: m.desc},
			{property: "og:image", content: m.image},
			{property: "twitter:site_name", content: m.site_name},
			{property: "twitter:title", content: m.title},
			{property: "twitter:description", content: m.desc},
			{property: "twitter:image", content: m.image},
			{property: "twitter:card", content: m.image_type == "banner" ? "summary_large_image" : "summary"},
			{name: "author", content: m.author}
		],
		link: [
			{rel: "icon", href: m.favicon}
		],
		htmlAttrs: {
			lang: m.lang
		}
	};
}

interface SimplifiedMeta {
	site_name: string,
	author: string,
	title: string,
	desc: string,
	title_suffix: string,
	use_title_suffix: boolean,
	lang: string,
	image: string,
	image_type?: "banner" | "icon",
	favicon: string
}
