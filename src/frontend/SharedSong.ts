import { SavedList } from "../lists/SavedList";
import type { RichVideo } from "../types";
import { api, queue } from "./App";
import { db } from "./Database";

export class SharedSong {

	public video: RichVideo;
	public playlists: SongPlaylists;

	constructor(video: RichVideo, playlists: SongPlaylists) {
		this.video = video;
		this.playlists = playlists;
	}

	public async playlistToggle(id: string) {
		if (this.playlists[id]) {
			await this.playlistRemove(id);
		} else {
			await this.playlistAdd(id);
		}
	}

	public async playlistAdd(id: string) {
		let l = await SavedList.get(id);
		if (l) await l.add(this.video.id);
		this.playlists[id] = true;
	}

	public async playlistRemove(id: string) {
		let l = await SavedList.get(id);
		if (l) await l.remove(this.video.id);
		this.playlists[id] = false;
	}

	public async play() {
		await queue.clear();
		await queue.add(this.video.id);
		await queue.play(0);
	}

	public async download() {
		let url = await api.getDownloadLink(this.video.id);
		let video = await api.getVideo(this.video.id);
		if (!url || !video) return;
		let link = document.createElement("a");
		link.download = `${video.author} - ${video.title}.m4a`;
		link.href = url;
		link.click();
	}

	private static instances: {[U: string]: SharedSong} = {};

	private static async create(id: string) {
		let video = await api.getRichVideo(id);
		if (!video) return null;
		let playlists = await this.getPlaylists(id);
		return new this(reactive(video), reactive(playlists));
	}

	public static async get(id: string) {
		let song: SharedSong | null = this.instances[id] ?? null;
		if (!song) {
			song = await this.create(id);
			if (song) this.instances[id] = song;
		}
		return song;
	}

	private static async getPlaylists(id: string) {
		let playlists: SongPlaylists = {liked: false};
		let presenceList = await db.songs.where({id}).toArray();
		for (let presence of presenceList) {
			let list = presence.list;
			if (list) playlists[list] = true;
		}
		return playlists;
	}

}

interface SongPlaylists {
	[U: string]: boolean,
	liked: boolean
}
