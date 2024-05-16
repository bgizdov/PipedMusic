import { API } from "./API"
import { SongMenu } from "../ui/SongMenu";
import { migrate } from "./Migration";
import { Queue } from "../ui/Queue";
import { QueuePlayer } from "../ui/QueuePlayer";

export let api = new API();

export let queue = reactive(new Queue);
export let player = reactive(new QueuePlayer(queue));

player.hookMediaSession();

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
