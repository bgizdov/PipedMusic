import type { APIInterface } from "../frontend/api";
import type { Player } from "../frontend/player";
import { LocalList } from "./LocalList";

export class Queue extends LocalList {

	private player: Player;
	private data: APIInterface;

	public playing: number | null = null;
	public playing_id: string | null = null;

	constructor(player: Player, data: APIInterface) {
		super();
		this.player = player;
		this.data = data;
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
		let video = await this.data.getRichVideo(song.id);
		if (!video) return;
		this.player.setPlaying(video);
		this.player.play();
		this.playing = index;
		this.playing_id = song.id;
	}

}
