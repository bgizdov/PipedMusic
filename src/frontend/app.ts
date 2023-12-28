import { Data, type DataInterface } from "../frontend/data"
import { Player } from "../frontend/player";
import type { RichVideo } from "../types";

export class App {

	public static instance: App;

	public player: Player;

	public data: DataInterface;

	public playing: RichVideo | null = null;

	public global: GlobalData;

	public constructor() {
		this.data = new Data();
		this.player = new Player();
		this.global = reactive({
			search: ""
		});
		if (App.instance) return App.instance;
	}

	public async play(id: string) {
		let video = await app.data.getRichVideo(id);
		if (!video) return;
		let stream = await app.data.getStream(id);
		this.player.setStream(stream);
		this.playing = reactive<RichVideo>(video);
		this.player.play();
	}

}

export let app = new App();

export interface GlobalData {
	search: string
}