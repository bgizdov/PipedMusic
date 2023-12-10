import type { Stream, Video } from "./backend";

export class SimpleCache {

	public cacheVideo(video: Video) {
		this.saveCache(`video_${video.id}`, video, 24*60*60)
	}

	public cacheStreams(id: string, streams: Stream[]) {
		this.saveCache(`streams_${id}`, streams, 60*60)
	}

	public cacheSearchSuggestions(q: string, suggestions: string[]) {
		this.saveCache(`suggestions_${q}`, suggestions, 60*60);
	}

	public cacheSearch(q: string, results: string[]) {
		this.saveCache(`search_${q}`, results, 60*60);
	}

	public loadCache(name: string): any | null {
		let res = localStorage.getItem(name);
		if (!res) return null;
		let item: CacheItem = JSON.parse(res);
		if (item.expiration < (new Date().getTime())) return null;
		return item.data;
	}

	public saveCache(name: string, data: any, seconds: number) {
		let item: CacheItem = {
			expiration: (new Date().getTime() + seconds * 1000),
			data
		};
		localStorage.setItem(name, JSON.stringify(item));
	}

}

interface CacheItem {
	expiration: number,
	data: any
}