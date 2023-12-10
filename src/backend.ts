import type { SimpleCache } from "./cache";

export abstract class Queryable {

	public abstract getVideo(id: string): Promise<Video | null>;

	public abstract getStreams(id: string): Promise<Stream[] | null>;

	public selectStream(streams: Stream[], quality: number): Stream | null {
		let stream: Stream | null = null;
		let gap = Number.MAX_SAFE_INTEGER;
		streams.forEach(s => {
			let g = quality - s.sampleRate;
			if (g < gap) stream = s, gap = g;
		});
		return stream;
	}

}

export abstract class Backend extends Queryable {

	public cache: SimpleCache | null = null;

	public setCache(cache: SimpleCache) {
		this.cache = cache;
	}

}

export interface Video {
	id: string,
	title: string,
	author: string,
	thumbnail: string
}

export interface Stream {
	sampleRate: number,
	url: string
}