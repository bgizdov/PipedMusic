import type { RichVideo, Thumbnails, Video } from "../types";

export class API implements APIInterface {

	public async getVideo(id: string): Promise<Video | null> {
		return await $fetch<Video | null>(`/api/song/${id}/info`);
	}

	public async getRichVideo(id: string): Promise<RichVideo | null> {
		let video = await this.getVideo(id);
		let stream = await this.getStream(id);
		let thumbnails = await this.getThumbnails(id);
		if (!video || !stream || !thumbnails) return null;
		return {...video, thumbnails, stream};
	}

	public async getStream(id: string): Promise<string | null> {
		return `/api/song/${id}/play`;
	}

	public async getDownloadLink(id: string): Promise<string | null> {
		return `/api/song/${id}/dl`;
	}

	public async getThumbnails(id: string): Promise<Thumbnails | null> {
		return {
			small: `/api/song/${id}/thumbnail`,
			large: `/api/song/${id}/image`
		};
	}

	public async getSearch(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>("/api/search", {query: {q}})) ?? [];
	}

	public async getSearchSuggestions(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>("/api/search-suggestions", {query: {q}})) ?? [];
	}

}

export interface APIInterface {

	getVideo(id: string): Promise<Video | null>;
	getRichVideo(id: string): Promise<RichVideo | null>;
	getStream(id: string): Promise<string | null>;
	getDownloadLink(id: string): Promise<string | null>;
	getThumbnails(id: string): Promise<Thumbnails | null>;
	getSearch(q: string): Promise<string[]>;
	getSearchSuggestions(q: string): Promise<string[]>;

}