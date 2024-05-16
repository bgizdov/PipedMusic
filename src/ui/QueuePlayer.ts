import { Player } from "../frontend/Player";
import type { Queue } from "./Queue";
import { SharedSong } from "./SharedSong";

export class QueuePlayer extends Player {

	public queue: Queue;
	public playingIndex: number | null = null;

	public constructor(queue: Queue) {
		super();
		this.queue = queue;
	}

	public async replaceAndPlay(song: SharedSong) {
		this.queue.clear();
		this.queue.add(song.video.id);
		await this.playIndex(0);
	}

	public async playIndex(index: number) {
		this.playingIndex = index;
		let song = await SharedSong.get(this.queue.items[index]);
		if (!song) return;
		this.setPlaying(song);
		this.play();
	}

	public async next() {
		await this.playIndex(this.playingIndex !== null ? this.playingIndex + 1 : 0);
	}

	public async previous() {
		await this.playIndex(this.playingIndex !== null ? this.playingIndex - 1 : 0);
	}

	public async add(id: string) {
		let index = await this.queue.size();
		await this.queue.add(id);
		if (this.playing === null) await this.playIndex(index);
	}

	public async addNext(id: string) {
		let index = this.playingIndex !== null ? this.playingIndex + 1 : 0;
		this.queue.items.splice(index, 0, id);
		this.queue.invalidate();
		if (this.playing === null) await this.playIndex(index);
	}

	public hookMediaSession() {
		super.hookMediaSession();
		if (navigator.mediaSession) {
			navigator.mediaSession.setActionHandler("nexttrack", async () => await this.next());
			navigator.mediaSession.setActionHandler("previoustrack", async () => await this.previous());
		}
	}

}
