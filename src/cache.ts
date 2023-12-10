import { Queryable, Backend, type Stream, type Video } from "./backend";

export class SimpleCache extends Queryable {

	public backend: Backend;

	public constructor(backend: Backend) {
		super();
		this.backend = backend;
		backend.setCache(this);
	}

	public async getVideo(id: string): Promise<Video | null> {
		let video: Video | null = this.loadCache(`video_${id}`);
		return video == null ? await this.backend.getVideo(id) : video;
	}

	public async getStreams(id: string): Promise<Stream[] | null> {
		let streams: Stream[] | null = this.loadCache(`streams_${id}`);
		return streams == null ? await this.backend.getStreams(id) : streams;
	}

	public loadCache(name: string): any | null {
		let res = localStorage.getItem(name);
		if (!res) return null;
		let item: CacheItem = JSON.parse(res);
		if (item.expiration < (new Date().getTime())) return null;
		return item.data;
	}

	public saveCache(name: string, data: any, ttl: number) {
		let item: CacheItem = {
			expiration: (new Date().getTime() + ttl * 60),
			data
		};
		localStorage.setItem(name, JSON.stringify(item));
	}

}

interface CacheItem {
	expiration: number,
	data: any
}