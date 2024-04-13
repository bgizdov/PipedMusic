import { API } from "./API"
import { Player } from "./Player";
import { SongMenu } from "../ui/SongMenu";
import { SavedList } from "../lists/SavedList";
import { migrate } from "./Migration";
import { Queue } from "../lists/Queue";

export let player = new Player();
export let api = new API();

export let likedSongs = SavedList.getLiked();
export let queue = reactive(new Queue(player, api));

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
