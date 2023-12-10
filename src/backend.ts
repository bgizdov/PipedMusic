import type { SimpleCache } from "./cache";

export abstract class Backend {

	public cache: SimpleCache | null = null;

	public setCache(cache: SimpleCache) {
		this.cache = cache;
	}

	public cached(name: string): any {
		if (!this.cache) return null;
		return this.cache.loadCache(name);
	}

	public abstract getVideo(id: string): Promise<Video | null>;

	public abstract getStreams(id: string): Promise<Stream[] | null>;

	public abstract getSearchSuggestions(q: string): Promise<string[] | null>;

	public abstract getSearch(q: string): Promise<string[] | null>;

	public selectStream(streams: Stream[], quality: number): Stream | null {
		let stream: Stream | null = null;
		let gap = Number.MAX_SAFE_INTEGER;
		streams.forEach(s => {
			let g = quality - s.bitrate;
			if (g < gap) stream = s, gap = g;
		});
		return stream;
	}

}

export interface Video {
	id: string,
	title: string,
	author: string,
	thumbnail: string
}

export type StreamType = "default" | "piped";

export interface Stream {
	bitrate: number,
	url: string,
	type: StreamType
}

export interface VideoWithStreams {
	video: Video | null,
	streams: Stream[] | null
}