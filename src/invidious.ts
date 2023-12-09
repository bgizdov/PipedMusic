import { Backend, type Stream, type Video } from "./backend";
import type { ComboObject } from "./main";

export class Invidious extends Backend {

	public async get(id: string) {
		let resp = await $fetch<ComboObject | null>(`https://yt.drgnz.club/api/v1/videos/${id}?fields=videoId,title,author,adaptiveFormats,videoThumbnails`);
		let video = this.convertVideo(resp);
		return video;
	}

	private convertVideo(resp: ComboObject | null): Video | null {
		if (!resp) return null;
		let streams = resp.adaptiveFormats.map((s: ComboObject) => {
			if (!s.audioSampleRate) return;
			return {
				sampleRate: s.audioSampleRate,
				url: s.url
			};
		}).filter((s: Stream | null) => s !== undefined);
		return {
			id: resp.videoId,
			title: resp.title,
			author: resp.author,
			thumbnail: resp.videoThumbnails[4].url,
			streams
		};
	}

}