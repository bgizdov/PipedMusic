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

export function customRule(choice: number, choicesLength: number) {
	if (choice == 1) return 0;
	if (choice >= 2 && choice <= 4) return 1;
	return choicesLength - 1;
}
