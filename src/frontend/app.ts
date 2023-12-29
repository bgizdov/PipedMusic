import { Data, type DataInterface } from "../frontend/data"
import { Player } from "../frontend/player";
import type { RichVideo } from "../types";
import { SavedList } from "./list";

export class App {

	public static instance: App;

	public player: Player;

	public data: DataInterface;

	public playing: RichVideo | null = null;

	public global: GlobalData;

	public constructor(data: Data, player: Player) {
		this.data = data;
		this.player = player;
		this.global = reactive({
			search: ""
		});
		if (App.instance) return App.instance;
	}

	public async play(id: string) {
		let video = await this.data.getRichVideo(id);
		if (!video) return;
		let stream = await this.data.getStream(id);
		this.setMediaSession(video);
		this.player.setStream(stream);
		this.playing = video;
		this.player.play();
	}

	public setMediaSession(video: RichVideo) {
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

export let player = new Player();
export let data = new Data();
export let app = new App(data, player);

export let likedSongs = reactive(SavedList.load("liked"));

export interface GlobalData {
	search: string
}