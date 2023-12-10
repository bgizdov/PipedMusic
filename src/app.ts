import type { Queryable, Video } from "./backend"
import { SimpleCache } from "./cache";
import { Invidious } from "./invidious";
import { Player } from "./player";

export class App {

	public static instance: App;

	public backend: Queryable;

	public player: Player;

	public playing: Video | null = null;

	public constructor() {
		this.backend = new SimpleCache(new Invidious());
		this.player = new Player(this.backend);
		if (App.instance) return App.instance;
	}

	public async play(id: string) {
		let video = await app.backend.getVideo(id);
		if (!video) return;
		this.playing = reactive<Video>(video);
		let streams = await app.backend.getStreams(id);
		this.player.setStreams(streams);
		this.player.play();
	}

}

export let app = new App();


export interface ComboObject {
	[U: string]: any
}
