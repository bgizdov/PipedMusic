import { Data, type DataInterface } from "../frontend/data"
import { Player } from "../frontend/player";
import type { RichVideo } from "../types";
import type { ISong } from "./db";
import { DBList, List } from "./list";
import { migrate } from "./migration";
import { Queue } from "./queue";

export class App {

	public static instance: App;

	public player: Player;

	public data: DataInterface;

	public constructor(data: Data, player: Player) {
		this.data = data;
		this.player = player;
		if (App.instance) return App.instance;
	}

}

export let player = new Player();
export let data = new Data();
export let app = new App(data, player);

export let likedSongs = reactive(new DBList("liked"));
export let queue = reactive(new Queue(app));

migrate();

export let shared = reactive<SharedData>({
	search: "",
	player: false
});

interface SharedData {
	search: string,
	player: boolean
}

export let songMenu = reactive<SongMenu>({
	visible: false,
	video: null,
	list: null,
	x: null,
	y: null,
	hideable: true
});

interface SongMenu {
	visible: boolean,
	video: null | RichVideo,
	list: null | List<ISong>,
	x: null | number,
	y: null | number,
	hideable: boolean
}