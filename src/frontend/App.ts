import { API } from "./API"
import { SongMenu } from "../ui/SongMenu";
import { migrate } from "./Migration";
import { Queue } from "../ui/Queue";
import { Player } from "./Player";

export let api = new API();

export let player = new Player();
export let queue = reactive(new Queue(player));

migrate();

export let shared = reactive<SharedData>({
	search: "",
	player: false
});

interface SharedData {
	search: string,
	player: boolean
}

export let songMenu = reactive(new SongMenu());
