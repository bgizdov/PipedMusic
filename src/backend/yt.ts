import Innertube, { Constants, UniversalCache } from "youtubei.js";
import { BackendCache } from "./cache";
import type { Video } from "../types";
import { Parser } from "./parser";
import type { FormatOptions } from "youtubei.js/dist/src/types";

class Backend {

	private yt: Innertube | null = null;

	readonly lang: string;
	readonly location: string;

	readonly format: FormatOptions = {
		type: 'audio', // audio, video or video+audio
		quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
		format: 'mp4' // media container format 
	};

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

	public async stream(id: string, range?: string) {
		let info = await this.fetchTrackInfo(id);
		let f = info.chooseFormat(this.format);
		let yt = await this.get();
		let url = f.decipher(yt.session.player);
		return this.fetchFileChunk(`${url}&cpn=${info.cpn}`, range);
	}

	public async download(id: string) {
		let info = await this.fetchTrackInfo(id);
		let stream = await info.download(this.format);
		let filename = this.convertFilename(`${info.basic_info.author} - ${info.basic_info.title}.m4a`);
		return {stream, filename};
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

	private async fetchFileChunk(url: string, range?: string) {
		let yt = await this.get();
		if (range) url += `&range=${range.replace("bytes=", "")}`;
		let res = await yt.session.http.fetch_function(url, {method: "GET", headers: Constants.STREAM_HEADERS, redirect: "follow"});
		let headers = new Headers;
		const copiedHeaders = ["accept-ranges", "content-length", "content-range", "content-type"];
		for (let key of res.headers.keys()) {
			if (copiedHeaders.indexOf(key) != -1) headers.set(key, res.headers.get(key)!);
		}
		return new Response(res.body, {headers, status: res.status});
	}

	public convertFilename(filename: string) {
		return filename.replace(/[^\w\d\-._~\s]/g, "");
	}

}

export let backend = new Backend("cs", "CZ");