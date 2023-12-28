import type { Search } from "youtubei.js/dist/src/parser/ytmusic";
import type { ComboObject } from "../types";
import type { ObservedArray } from "youtubei.js/dist/src/parser/helpers";
import type { SearchSuggestionsSection } from "youtubei.js/dist/src/parser/nodes";

export class Parser {

	public static parseSearch(search: Search): string[] {
		let results: string[] = [];
		if (search.contents) search.contents.forEach(e => {
			if (e.type == "MusicShelf" && e.contents) {
				e.contents.forEach((i: ComboObject) => {
					if (i.item_type == "song" && i.id) {
						results.push(i.id);
					}
				});
			}
		});
		return results;
	}

	public static parseSearchSuggestions(result: ObservedArray<SearchSuggestionsSection>) {
		let suggestions: string[] = [];
		result.forEach(s => {
			if (s.type == "SearchSuggestionsSection" && s.contents && Array.isArray(s.contents)) {
				s.contents.forEach((i: ComboObject) => {
					if (i.suggestion && i.suggestion.text) suggestions.push(i.suggestion.text);
				});
			}
		});
		return suggestions;
	}

}