import Innertube, { Constants, UniversalCache } from "youtubei.js";
import { BackendCache } from "./cache";
import type { Video } from "../types";
import { Parser } from "./parser";
import type { FormatOptions } from "youtubei.js/dist/src/types";
import type { TrackInfo } from "youtubei.js/dist/src/parser/ytmusic";
import type { Range } from "youtubei.js/dist/src/utils/StreamingInfo";
import type { Format } from "youtubei.js/dist/src/parser/misc";

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

	public async stream(id: string, rangeHeader?: string) {
		let info = await this.fetchTrackInfo(id);
		let format = info.chooseFormat(this.format);
		let range = this.parseRangeHeader(rangeHeader);
		return this.fetchFileChunk(info, format, range);
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

	private async fetchFileChunk(info: TrackInfo, format: Format, range?: Range): Promise<Response | null> {
		let len = format.content_length;
		if (!len) return null;
		if (range && (Number.isNaN(range.end) || !range.end)) range.end = len - 1;
		let file = await info.download({
			...this.format, range
		});
		let headers = new Headers;
		headers.set("accept-ranges", "bytes");
		headers.set("content-length", `${len}`);
		headers.set("content-type", format.mime_type);
		if (range) {
			headers.set("content-range", `bytes ${range.start}-${range.end}/${len}`);
		}
		return new Response(file, {headers, status: range ? 206 : 200});
	}

	private parseRangeHeader(rangeHeader?: string): Range | undefined {
		if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
			return undefined;
		}
		try {
			const [start, end] = rangeHeader.slice(6).split('-').map(Number);
			return {start, end};
		} catch (error) {
			return undefined;
		}
	}

	private convertFilename(filename: string) {
		return filename.replace(/[^\w\d\-._~\s]/g, "");
	}

}

export let backend = new Backend("cs", "CZ");