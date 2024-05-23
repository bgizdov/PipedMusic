import { generateLocales } from "./src/frontend/Locales";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: true,
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
	routeRules: {
		'/song/**': {ssr: true},
		'/playlist/**': {ssr: false},
		'/settings': {ssr: false}
	},
	app: {
		head: {
			meta: [
				{name: "apple-mobile-web-app-title", content: "Piped Music"},
				{name: "application-name", content: "Piped Music"}
			],
			link: [
				{rel: "manifest", href: "/site.webmanifest"}
			]
		}
	}
});