import type { RichVideo } from "../types";
import type { App } from "./app";
import { List, ListAddMode } from "./list";

export class Queue extends List {

	private app: App;

	public playing: RichVideo | null = null;

	public constructor(app: App) {
		super();
		this.app = app;
	}

	public add(id: string, mode: ListAddMode = 1) {
		super.add(id, mode);
		if (!this.playing) this.play(id);
	}

	public async play(id: string) {
		let video = await this.app.data.getRichVideo(id);
		if (!video) return;
		let stream = await this.app.data.getStream(id);
		this.setMediaSession(video);
		this.app.player.setStream(video.stream);
		this.app.player.play();
		this.playing = video;
	}

	public setMediaSession(video: RichVideo) {
		if (!navigator.mediaSession) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: video.title,
			artist: video.author,
			album: "",
			artwork: [
				{src: video.thumbnail}
			]
		});
	}

}