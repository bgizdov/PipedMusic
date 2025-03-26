import { SongMenu } from "../ui/SongMenu";
import { migrate } from "./Migration";
import { Queue } from "../ui/Queue";
import { Player } from "./Player";
import { api } from "./API";
import { settings } from "../ui/Settings";

export let player = reactive(new Player());
export let queue = reactive(new Queue(player));
api.setBackendUrl(settings.prefs.backend_url);

queue.hookPlayer();
queue.hookMediaSession();

migrate();

export let songMenu = reactive(new SongMenu());
