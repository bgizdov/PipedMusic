import type { RichVideo } from "../types";
import { PlaylistUI } from "./PlaylistUI";
import { api, player } from "../frontend/App";
import { db } from "../frontend/Database";

export class SharedSong {

	private static map: {[U: string]: SharedSong} = {};

	public video: RichVideo;
	public playlists: SongPlaylists;

	private constructor(video: RichVideo, playlists: SongPlaylists) {
		this.video = video;
		this.playlists = playlists;
	}

	static clear() {
		this.map = {};
	}

	public static async get(id: string) {
		if (this.map[id]) return this.map[id];
		let video = await api.getRichVideo(id);
		if (!video) return null;
		let playlists = await this.getPlaylists(id);
		let song = new this(reactive(video), reactive(playlists));
		this.map[id] = song;
		return song;
	}

	public static getCached(id: string) {
		return this.map[id] ?? null;
	}

	public async playlistToggle(id: string) {
		if (this.playlists[id]) {
			await this.playlistRemove(id);
		} else {
			await this.playlistAdd(id);
		}
	}

	public async playlistAdd(id: string) {
		let l = await PlaylistUI.get(id);
		if (l) await l.add(this.video.id);
	}

	public async playlistRemove(id: string) {
		let l = await PlaylistUI.get(id);
		if (l) await l.remove(this.video.id);
	}

	public setPlaylistPresence(list: PlaylistUI, present: boolean) {
		this.playlists[list.id] = present;
	}

	public async play() {
		await player.replaceAndPlay(this);
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
