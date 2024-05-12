import { generateLocales } from "./src/frontend/Locales";

let meta = {
	name: "PipedMusic",
	title: "PipedMusic - Free Music",
	desc: "YouTube Music privacy-friendly alternative client"
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	devtools: {
		enabled: false
	},
	css: [
		"~/src/css/style.css"
	],
	modules: ["nuxt-icon", "@nuxtjs/i18n"],
	components: ["./components", "./components/buttons"],
	i18n: {
		locales: generateLocales(),
		lazy: true,
		langDir: 'lang',
		defaultLocale: 'en-US',
		strategy: 'no_prefix'
	},
	app: {
		head: {
			title: meta.title,
			meta: [
				{name: "theme-color", content: "#870027"},
				{name: "description", content: meta.desc},
				{property: "og:site_name", content: meta.name},
				{property: "og:title", content: meta.title},
				{property: "og:description", content: meta.desc},
				{property: "og:image", content: "/icon.png"},
				{property: "twitter:site_name", content: meta.name},
				{property: "twitter:title", content: meta.title},
				{property: "twitter:description", content: meta.desc},
				{property: "twitter:image", content: "/icon.png"},
				{property: "twitter:card", content: "summary"},
				{name: "author", content: "CodeSpace.cz"},
				{name: "apple-mobile-web-app-title", content: meta.name},
				{name: "application-name", content: meta.name}
			],
			link: [
				{rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
				{rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico"},
				{rel: "manifest", href: "/site.webmanifest"}
			]
		}
	}
});