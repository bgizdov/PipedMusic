import type { ISong } from "../frontend/db";
import type { List } from "../lists/List";
import type { RichVideo } from "../types";

export class SongMenu {

	video: null | RichVideo = null;
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
		this.video = null;
		this.x = null;
		this.y = null;
		this.state.page = null;
	}

	setPage(page: SongMenuPage) {
		this.state.page = page;
	}

	open(event: MouseEvent, video: RichVideo, list?: List<ISong>) {
		this.state.visible = !this.state.visible;
		this.video = video;
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

type SongMenuPage = null;

interface SongMenuState {
	visible: boolean,
	hidable: boolean,
	page: SongMenuPage
}