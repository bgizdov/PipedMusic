import { Backend, type Stream, type Video } from "./backend";
import type { ComboObject } from "./app";

export class Invidious extends Backend {

	private async get(id: string): Promise<VideoWithStreams> {
		let resp = await $fetch<ComboObject | null>(`https://yt.drgnz.club/api/v1/videos/${id}?fields=videoId,title,author,adaptiveFormats,videoThumbnails`);
		let [video, streams] = this.convertVideo(resp);
		if (this.cache) {
			this.cache.saveCache(`video_${id}`, video, 24*60*60);
			this.cache.saveCache(`streams_${id}`, streams, 60*60);
		}
		return [video, streams];
	}
	
	public async getVideo(id: string): Promise<Video | null> {
		let [video, _] = await this.get(id);
		return video;
	}

	public async getStreams(id: string): Promise<Stream[] | null> {
		let [_, streams] = await this.get(id);
		return streams;
	}

	private convertVideo(resp: ComboObject | null): [Video, Stream[]] | [null, null] {
		if (!resp) return [null, null];
		let streams = resp.adaptiveFormats.map((s: ComboObject) => {
			if (!s.audioSampleRate) return;
			return {
				sampleRate: s.audioSampleRate,
				url: s.url
			};
		}).filter((s: Stream | null) => s !== undefined);
		return [{
			id: resp.videoId,
			title: resp.title,
			author: resp.author,
			thumbnail: resp.videoThumbnails[4].url
		}, streams];
	}

}

type VideoWithStreams = [Video | null, Stream[] | null];