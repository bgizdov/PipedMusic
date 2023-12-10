import type { Queryable, Stream } from "./backend";

export class Player {
	
	public el: HTMLAudioElement;
	
	public streams: Stream[] | null = null;

	public backend: Queryable;

	constructor(backend: Queryable) {
		this.backend = backend;
		this.el = this.createPlayer();
	}

	private createPlayer(): HTMLAudioElement {
		let p = document.createElement("audio");
		return p;
	}

	setStreams(streams: Stream[] | null) {
		if (streams) {
			this.streams = streams;
			let stream = this.backend.selectStream(streams, 100000);
			if (stream) {
				this.el.src = stream.url;
			} 
		}
	}

	play() {
		this.el.play();
	}

	pause() {
		this.el.pause();
	}

	seek(time: number) {
		this.el.currentTime = time;
	}

	setVolume(volume: number) {
		this.el.volume = volume;
	}

}

export interface PlayerState {
	playing: boolean,
	loop: boolean,
	position: number,
	duration: number,
	volume: number,
	muted: boolean
}