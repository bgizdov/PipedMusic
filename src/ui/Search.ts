import { api } from "../frontend/API";

class Search {

	data: Data = reactive({
		query: "",
		results: [],
		suggestions: []
	});

	tout: NodeJS.Timeout | null = null;

	constructor() {
		watch(() => this.data.query, () => {
			this.debounce();
		});
	}

	async search(query: string) {
		this.data.results = await api.getSearch(query);
	}

	async debounce() {
		if (this.tout) clearTimeout(this.tout);
		this.tout = setTimeout(async () => {
			this.tout = null;
			await this.search(this.data.query);
		}, 250);
		this.data.results = [];
		this.data.suggestions = await api.getSearchSuggestions(this.data.query);
	}

}

interface Data {
	query: string,
	results: string[] | null,
	suggestions: string[] | null
}

export let search = new Search();
