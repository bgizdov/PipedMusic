import { customRule } from "./src/frontend/Locales";

export default defineI18nConfig(() => {
	return {
		locale: "en-US",
		fallbackLocale: 'en-US',
		legacy: false,
		pluralRules: {
			"cs-CZ": customRule,
			"sk-SK": customRule
		}
	};
});