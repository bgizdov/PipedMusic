import type { ISong } from "../frontend/Database";
import type { SharedSong } from "./SharedSong";
import type { List } from "../lists/List";

export class SongMenu {

	song: null | SharedSong = null;
	list: null | List<ISong> = null;
	x: null | number = null;
	y: null | number = null;

	state: SongMenuState = {
		visible: false,
		hidable: false,
		page: null
	};

	constructor() {
		this.reset();
		
	}

	reset() {
		this.list = null;
		this.song = null;
		this.x = null;
		this.y = null;
		this.state.page = null;
	}

	setPage(page: SongMenuPage) {
		this.state.page = page;
	}

	open(event: MouseEvent, song: SharedSong, list?: List<ISong>) {
		this.state.visible = !this.state.visible;
		this.song = song;
		this.list = list ?? null;
		this.x = event.pageX;
		this.y = event.pageY;
		this.state.hidable = false;
		setTimeout(() => {
			this.state.hidable = true;
		}, 100);
	}

	close() {
		if (this.state.hidable) {
			this.reset();
			this.state.visible = false;
		}
	}

}

type SongMenuPage = null | "playlists";

interface SongMenuState {
	visible: boolean,
	hidable: boolean,
	page: SongMenuPage
}