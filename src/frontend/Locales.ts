export const locales = [
	{code: "en-US", name: "English"},
	{code: "cs-CZ", name: "Čeština"},
	{code: "sk-SK", name: "Slovenčina"},
	{code: "de-DE", name: "Deutsch"},
	{code: "es-ES", name: "Español"},
];

export function generateLocales() {
	return locales.map(e => {
		return {code: e.code, file: `${e.code}.json`}
	});
}