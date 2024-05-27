import type { Player } from "../frontend/Player";
import { LocalList } from "../ui/LocalList";
import { SharedSong } from "./SharedSong";

export class Queue extends LocalList {

	public player: Player;
	public playingIndex: number = -1;

	public loop: QueueLoopType;

	constructor(player: Player) {
		super();
		this.player = player;
		this.loop = this.getSavedLoopType();
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
		const actionMap = {
			one: async () => await this.playIndex(this.playingIndex),
			playlist: async () => await this.next(),
			none: async () => await this.nextIfAny(),
		};
		await actionMap[this.loop]();
	}

	public async next() {
		await this.playIndex(await this.relativeIndex(+1));
	}

	public async nextIfAny() {
		if (this.playingIndex < (await this.size() - 1)) {
			await this.next();
		}
	}

	public async previous() {
		await this.playIndex(await this.relativeIndex(-1));
	}

	public async relativeIndex(move: number) {
		const size = await this.size();
		return (((this.playingIndex + move) % size) + size) % size;
	}

	public async add(id: string) {
		let index = await this.size();
		await super.add(id);
		if (this.playingIndex == -1) await this.playIndex(index);
	}

	public async addNext(id: string) {
		let index = this.playingIndex + 1;
		this.items.splice(index, 0, id);
		this.invalidate();
		if (this.playingIndex == -1) await this.playIndex(index);
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
		let removedPlaying = index == this.playingIndex;
		if (index < this.playingIndex) {
			this.playingIndex--;
		}
		if (await this.size() <= 1) return;
		super.removeIndex(index);
		if (removedPlaying) {
			this.playIndex(index);
		}
	}

	public cycleLoop() {
		const loopModes: QueueLoopType[] = ["none", "one", "playlist"];
		const currentModeIndex = loopModes.indexOf(this.loop);
		this.loop = loopModes[(currentModeIndex + 1) % loopModes.length];
		localStorage.setItem("loop", this.loop);
	}

	public getSavedLoopType() {
		let loopType = localStorage.getItem("loop");
		return loopType as QueueLoopType ?? "none";
	}

}

type QueueLoopType = "none" | "one" | "playlist";
