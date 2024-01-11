import type { RichVideo } from "../types";
import type { App } from "./app";
import { List, ListAddMode } from "./list";

export class Queue extends List {

	private app: App;

	public playing: number | null = null;

	public constructor(app: App) {
		super();
		this.app = app;
	}

	public next() {
		if (this.playing === null) return;
		let index = Math.min(this.playing + 1, this.items.length - 1);
		this.play(index);
	}

	public previous() {
		if (this.playing === null) return;
		let index = Math.max(this.playing - 1, 0);
		this.play(index);
	}

	public add(id: string, mode: ListAddMode = 1): number {
		let index = super.add(id, mode);
		if (this.playing === null) this.play(index);
		return index;
	}

	public async addNext(id: string) {
		if (this.playing === null) return this.add(id);
		let index = this.playing + 1;
		this.items.splice(index, 0, id);
		return index;
	}

	public async play(index: number) {
		let id = this.get(index);
		if (!id) return;
		let video = await this.app.data.getRichVideo(id);
		if (!video) return;
		this.setMediaSession(video);
		this.app.player.setPlaying(video);
		this.app.player.play();
		this.playing = index;
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