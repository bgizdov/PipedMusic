import type { Backend, Video } from "./backend";

export class Player {
	
	public el: HTMLAudioElement;
	
	public video: Video | null = null;

	public backend: Backend;

	constructor(backend: Backend) {
		this.backend = backend;
		this.el = this.createPlayer();
	}

	private createPlayer(): HTMLAudioElement {
		let p = document.createElement("audio");
		return p;
	}

	setVideo(video: Video | null) {
		if (video) {
			this.video = video;
			let stream = this.backend.selectStream(video.streams, 100000);
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
	volume: number
}