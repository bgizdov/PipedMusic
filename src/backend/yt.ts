import Innertube, { UniversalCache } from "youtubei.js";
import { BackendCache } from "./cache";
import type { Video } from "../types";
import { Parser } from "./parser";
import type { FormatOptions } from "youtubei.js/dist/src/types";

class Backend {

	private yt: Innertube | null = null;

	readonly lang: string;
	readonly location: string;

	private cache = new BackendCache();

	public constructor(lang: string, location: string) {
		this.lang = lang;
		this.location = location;
	}

	public async get(): Promise<Innertube> {
		this.yt = await Innertube.create({
			cache: new UniversalCache(true, "cache/"),
			lang: this.lang,
			location: this.location
		});
		return this.yt;
	}

	/* Public API */

	public async getInfo(id: string): Promise<Video> {
		let info = await this.fetchTrackInfo(id);
		return {
			id,
			title: info.basic_info.title ?? "Unknown",
			author: info.basic_info.author ?? "Unknown",
			duration: info.basic_info.duration ?? 0
		};
	}

	public async getThumbnail(id: string) {
		let info = await this.fetchTrackInfo(id);
		let thumbnail = (info.basic_info.thumbnail ?? []).map(t => t.url)[0] ?? null;
		return thumbnail ? $fetch(thumbnail) : null;
	}

	public async download(id: string) {
		let info = await this.fetchTrackInfo(id);
		let options: FormatOptions = {
			type: 'audio', // audio, video or video+audio
			quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
			format: 'mp4' // media container format 
		};
		let f = info.chooseFormat(options);
		return {
			stream: await info.download(options),
			length: f.content_length,
			mime: f.mime_type
		};
	}

	public async getSearch(q: string) {
		return Parser.parseSearch(await this.fetchSearch(q));
	}

	public async getSearchSuggestions(q: string) {
		return Parser.parseSearchSuggestions(await this.fetchSearchSuggestions(q));
	}

	/* Data fetching */

	private async fetchTrackInfo(id: string) {
		let yt = await this.get();
		return this.cache.get(
			`trackinfo(${id})`,
			async () => await yt.music.getInfo(id)
		);
	}

	private async fetchSearch(q: string) {
		let yt = await this.get();
		return this.cache.get(
			`search(${q})`,
			async () => await yt.music.search(q, {type: "song"})
		);
	}

	private async fetchSearchSuggestions(q: string) {
		let yt = await this.get();
		return this.cache.get(
			`search_suggestions(${q})`,
			async () => await yt.music.getSearchSuggestions(q)
		);
	}

}

export let backend = new Backend("cs", "CZ");