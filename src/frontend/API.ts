import { API_URL } from "../../config";
import type { RichVideo, Thumbnails, Video } from "../types";

export class API implements APIInterface {

	api: string = API_URL;

	public async getVideo(id: string): Promise<Video | null> {
		return await $fetch<Video | null>(`${this.api}/track/${id}`, {mode: "cors"});
	}

	public async getRichVideo(id: string): Promise<RichVideo | null> {
		let video = await this.getVideo(id);
		let stream = await this.getStream(id);
		let thumbnails = await this.getThumbnails(id);
		if (!video || !stream || !thumbnails) return null;
		return {...video, thumbnails, stream};
	}

	public async getStream(id: string): Promise<string | null> {
		return `${this.api}/track/${id}/stream`;
	}

	public async getDownloadLink(id: string): Promise<string | null> {
		return `${this.api}/track/${id}/download`;
	}

	public async getThumbnails(id: string): Promise<Thumbnails | null> {
		return {
			small: `${this.api}/track/${id}/cover/128`,
			large: `${this.api}/track/${id}/cover/512`
		};
	}

	public async getSearch(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>(`${this.api}/search`, {query: {q}, mode: "cors"})) ?? [];
	}

	public async getSearchSuggestions(q: string): Promise<string[]> {
		return (await $fetch<string[] | null>(`${this.api}/search/suggestions`, {query: {q}, mode: "cors"})) ?? [];
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

export let api = new API();
