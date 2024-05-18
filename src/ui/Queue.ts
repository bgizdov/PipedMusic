import type { Player } from "../frontend/Player";
import { LocalList } from "../ui/LocalList";
import { SharedSong } from "./SharedSong";

export class Queue extends LocalList {

	public player: Player;
	public playingIndex: number = -1;

	constructor(player: Player) {
		super();
		this.player = player;
	}

	public async replaceAndPlay(song: SharedSong) {
		await this.clear();
		await this.add(song.video.id);
		await this.playIndex(0);
	}

	public async playIndex(index: number) {
		this.playingIndex = index;
		let id = this.items[index];
		let song = id ? await SharedSong.get(id) : null;
		if (!song) return;
		this.player.setPlaying(song);
		this.player.play();
	}

	public async songEnd() {
		// TODO: add loop options
		await this.next();
	}

	public async next() {
		await this.playIndex(await this.relativeIndex(+1));
	}

	public async previous() {
		await this.playIndex(await this.relativeIndex(-1));
	}

	public async relativeIndex(move: number) {
		if (move > 0) {
			const last = (await this.size()) - 1;
			return Math.min(this.playingIndex + move, last);
		} else {
			return Math.max(this.playingIndex + move, 0);
		}
	}

	public async add(id: string) {
		let index = await this.size();
		await super.add(id);
		if (this.playingIndex === null) await this.playIndex(index);
	}

	public async addNext(id: string) {
		let index = this.playingIndex + 1;
		this.items.splice(index, 0, id);
		this.invalidate();
		if (this.playingIndex === null) await this.playIndex(index);
	}

	public hookPlayer() {
		this.player.el.addEventListener("ended", async () => await this.songEnd());
	}

	public hookMediaSession() {
		if (navigator.mediaSession) {
			navigator.mediaSession.setActionHandler("nexttrack", async () => await this.next());
			navigator.mediaSession.setActionHandler("previoustrack", async () => await this.previous());
		}
	}

	public async removeIndex(index: number) {
		if (index < this.playingIndex) {
			this.playingIndex--;
		}
		if (await this.size() <= 1) return;
		super.removeIndex(index);
		if (index == this.playingIndex) {
			this.playIndex(index);
		}
	}

}
