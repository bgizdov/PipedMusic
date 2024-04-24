import { API } from "./API"
import { Player } from "./Player";
import { SongMenu } from "../ui/SongMenu";
import { migrate } from "./Migration";
import { Queue } from "../ui/Queue";

export let player = new Player();
export let api = new API();

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
