import { API_URL } from "~/config";

class Settings {

	prefs: SettingsPrefs = Settings.getPrefs();

	public static getDefaultPrefs(): SettingsPrefs {
		return {
			backend_url: API_URL,
			search_clear_button: false,
			save_queue: false
		}
	}

	public static getPrefs() {
		return this.getSavedPrefs() ?? this.getDefaultPrefs();
	}

	public static getSavedPrefs(): null | SettingsPrefs {
		if (process.server) return null;
		try {
			let prefs = localStorage.getItem("prefs");
			if (prefs) return JSON.parse(prefs);
		} catch(e) {
			console.log("Error: Invalid config!");
		}
		return null;
	}

	public save() {
		localStorage.setItem("prefs", JSON.stringify(this.prefs));
	}

}

export let settings = reactive(new Settings);

interface SettingsPrefs {
	backend_url: string,
	search_clear_button: boolean,
	save_queue: boolean
}
