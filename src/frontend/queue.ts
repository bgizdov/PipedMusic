import type { App } from "./app";
import { LocalList } from "./list";

export class Queue extends LocalList {

	public app: App;

	public playing: number | null = null;
	public playing_id: string | null = null;

	constructor(app: App) {
		super();
		this.app = app;
	}

	public async next() {
		await this.play(this.playing !== null ? this.playing + 1 : 0);
	}

	public async previous() {
		await this.play(this.playing !== null ? this.playing - 1 : 0);
	}

	public async add(id: string) {
		let index = await this.size();
		await super.add(id);
		if (this.playing === null) await this.play(index);
	}

	public async addNext(id: string) {
		let index = this.playing !== null ? this.playing + 1 : 0;
		this.items.splice(index, 0, id);
		this.invalidate();
		if (this.playing === null) await this.play(index);
	}

	public async play(index: number) {
		let song = await this.get(index);
		if (!song) return;
		let video = await this.app.data.getRichVideo(song.id);
		if (!video) return;
		this.app.player.setPlaying(video);
		this.app.player.play();
		this.playing = index;
		this.playing_id = song.id;
	}

}