import type { ISong } from "../frontend/Database";
import type { SharedSong } from "./SharedSong";
import type { List } from "../lists/List";

export class SongMenu {

	song: null | SharedSong = null;
	list: null | List<ISong> = null;
	
	position: null | SongMenuPosition = null;

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
		this.position = null;
		this.state.page = null;
	}

	setPage(page: SongMenuPage) {
		this.state.page = page;
	}

	getPosition(x: number, y: number): SongMenuPosition {
		const width = window.innerWidth;
		const height = window.innerHeight;
		let pos: SongMenuPosition = {};
		if (x > (width - 200)) {
			pos.right = width-x;
		} else {
			pos.left = x;
		}
		if (y > (height - 200)) {
			pos.bottom = height-y;
		} else {
			pos.top = y;
		}
		return pos;
	}

	open(event: MouseEvent, song: SharedSong, list?: List<ISong>) {
		this.state.visible = !this.state.visible;
		this.song = song;
		this.list = list ?? null;
		this.position = this.getPosition(event.x, event.y);
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

export interface SongMenuPosition {
	top?: number,
	left?: number,
	bottom?: number,
	right?: number
}