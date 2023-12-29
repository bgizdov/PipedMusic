import { Data, type DataInterface } from "../frontend/data"
import { Player } from "../frontend/player";
import { SavedList } from "./list";
import { Queue } from "./queue";

export class App {

	public static instance: App;

	public player: Player;

	public data: DataInterface;

	public global: GlobalData;

	public constructor(data: Data, player: Player) {
		this.data = data;
		this.player = player;
		this.global = reactive({
			search: "",
			player: false
		});
		if (App.instance) return App.instance;
	}

}

export let player = new Player();
export let data = new Data();
export let app = new App(data, player);

export let likedSongs = reactive(SavedList.load("liked"));
export let queue = reactive(new Queue(app));

export interface GlobalData {
	search: string,
	player: boolean
}