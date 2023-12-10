import { Backend, type Stream, type Video, type VideoWithStreams } from "./backend";
import type { ComboObject } from "./app";

export class Piped extends Backend {

	private endpoint = "https://piped-api.codespace.cz";

	/* Getters */
	
	public async getVideo(id: string): Promise<Video | null> {
		return this.cached(`video_${id}`) ?? (await this.fetchVideo(id)).video;
	}

	public async getStreams(id: string): Promise<Stream[] | null> {
		return this.cached(`streams_${id}`) ?? (await this.fetchVideo(id)).streams;
	}

	public async getSearchSuggestions(q: string): Promise<string[] | null> {
		return this.cached(`suggestions_${q}`) ?? await this.fetchSearchSuggestions(q);
	}

	public async getSearch(q: string): Promise<string[] | null> {
		return this.cached(`search_${q}`) ?? await this.fetchSearch(q);
	}

	/* Fetching */

	private async fetchVideo(id: string): Promise<VideoWithStreams> {
		let resp = await $fetch<ComboObject | null>(`${this.endpoint}/streams/${id}`);
		let {video, streams} = this.convertVideoWithStreams(id, resp);
		if (this.cache) {
			if (video) this.cache.cacheVideo(video);
			if (streams) this.cache.cacheStreams(id, streams);
		}
		return {video, streams};
	}

	private async fetchSearchSuggestions(q: string): Promise<string[] | null> {
		let resp = await $fetch<string[] | null>(`${this.endpoint}/suggestions`, {query: {query: q}});
		let suggestions = resp ?? null;
		if (this.cache && suggestions) this.cache.cacheSearchSuggestions(q, suggestions);
		return suggestions;
	}

	private async fetchSearch(q: string): Promise<string[] | null> {
		let resp = await $fetch<ComboObject | null>(`${this.endpoint}/search`, {query: {q, filter: "music_songs"}});
		let results = this.convertSearch(resp);
		return results;
	}

	/* Converting */

	private convertVideoWithStreams(id: string, resp: ComboObject | null): VideoWithStreams {
		if (!resp) return {video: null, streams: null};
		let streams = resp.audioStreams.map((s: ComboObject): Stream => {
			return {
				bitrate: s.bitrate,
				url: s.url,
				type: "piped"
			};
		}).filter((s: Stream | undefined) => s != undefined);
		return {
			video: this.convertVideo(id, resp),
			streams
		};
	}

	private convertVideo(id: string, resp: ComboObject): Video {
		let title = resp.title;
		let author = resp.uploader ?? resp.uploaderName;
		if (resp.category == "Music") author = author.replace(" - Topic", "");
		let thumbnail = resp.thumbnail ?? resp.thumbnailUrl;
		return {id, title, author, thumbnail};
	}

	private convertSearch(resp: ComboObject | null): string[] {
		let ids: string[] = [];
		if (!resp) return ids;
		resp.items.forEach((s: ComboObject) => {
			if (s.type == "stream") {
				ids.push(s.url.replace("/watch?v=", ""));
			}
		});
		return ids;
	}

}