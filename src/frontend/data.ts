import type { RichVideo, Video } from "../types";

export class Data implements DataInterface {

	public async getVideo(id: string): Promise<Video | null> {
		return await $fetch<Video | null>(`/api/song/${id}/info`);
	}

	public async getRichVideo(id: string): Promise<RichVideo | null> {
		let video = await this.getVideo(id);
		let stream = await this.getStream(id);
		let thumbnail = await this.getThumbnail(id);
		if (!video || !stream || !thumbnail) return null;
		return {...video, thumbnail, stream};
	}

	public async getStream(id: string): Promise<string | null> {
		return `/api/song/${id}/play`;
	}

	public async getThumbnail(id: string): Promise<string | null> {
		return `/api/song/${id}/thumbnail`;
	}

	public async getSearch(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>("/api/search", {query: {q}})) ?? [];
	}

	public async getSearchSuggestions(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>("/api/search-suggestions", {query: {q}})) ?? [];
	}

}

export interface DataInterface {

	getVideo(id: string): Promise<Video | null>;
	getRichVideo(id: string): Promise<RichVideo | null>;
	getStream(id: string): Promise<string | null>;
	getThumbnail(id: string): Promise<string | null>;
	getSearch(q: string): Promise<string[]>;
	getSearchSuggestions(q: string): Promise<string[]>;

}