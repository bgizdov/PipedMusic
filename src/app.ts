import type { Backend, Video } from "./backend"
import { SimpleCache } from "./cache";
import { Invidious } from "./invidious";
import { Piped } from "./piped";
import { Player } from "./player";

export class App {

	public static instance: App;

	public backend: Backend;

	public player: Player;

	public playing: Video | null = null;

	public global: GlobalData;

	public constructor() {
		// this.backend = new Piped();
		this.backend = new Invidious();
		this.backend.setCache(new SimpleCache());
		this.player = new Player(this.backend);
		this.global = reactive({
			search: ""
		});
		if (App.instance) return App.instance;
	}

	public async play(id: string) {
		let video = await app.backend.getVideo(id);
		if (!video) return;
		let streams = await app.backend.getStreams(id);
		this.player.setStreams(streams);
		this.playing = reactive<Video>(video);
		this.player.play();
	}

}

export let app = new App();

export interface GlobalData {
	search: string
}

export interface ComboObject {
	[U: string]: any
}
