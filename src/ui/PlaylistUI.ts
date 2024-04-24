import type { ISong } from "../frontend/Database";
import type { DisplayableList, DisplayedList } from "../lists/DisplayedList";
import { Playlist } from "../lists/Playlist";
import { SharedSong } from "./SharedSong";

export class PlaylistUI extends Playlist implements DisplayableList<ISong> {

	public static map: {[U: string]: PlaylistUI} = {};
	
	public meta: PlaylistMeta;

	private displays: DisplayedList<ISong>[] = [];

	private constructor(id: string) {
		super(id);
		this.meta = reactive({name: "Unknown", size: 0});
	}

	static async get(id: string) {
		if (this.map[id]) return this.map[id]; 
		let list = new PlaylistUI(id);
		if (await list.updateMeta()) {
			this.map[id] = list;
			return list;
		}
		return null;
	}

	async add(id: string): Promise<void> {
		this.setSongPresence(id, true);
		await super.add(id);
		this.invalidate();
		this.updateMeta();
	}

	async remove(id: string): Promise<void> {
		this.setSongPresence(id, false);
		await super.remove(id);
		this.invalidate();
		this.updateMeta();
	}

	async clear(): Promise<void> {
		(await super.list()).forEach(s => {
			this.setSongPresence(s.id, false);
		});
		await super.clear();
		this.invalidate();
		this.updateMeta();
	}

	private setSongPresence(id: string, present: boolean) {
		SharedSong.getCached(id)?.setPlaylistPresence(this, present);
	}

	private async updateMeta(): Promise<boolean> {
		let info = await this.info();
		if (!info) return false;
		this.meta.name = info.name;
		this.meta.size = await this.size();
		return true;
	}

	addDisplay(display: DisplayedList<ISong>) {
		this.displays.push(display);
	}

	removeDisplay(display: DisplayedList<ISong>) {
		const index = this.displays.indexOf(display);
		if (index > -1) {
			this.displays.splice(index, 1);
		}
	}

	invalidate() {
		this.displays.forEach(display => {
			display.update(this);
		});
	}

}

interface PlaylistMeta {
	name: string,
	size: number
}
