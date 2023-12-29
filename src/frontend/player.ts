import type { RichVideo } from "../types";

export class Player {
	
	public el: HTMLAudioElement;
	
	public stream: string | null = null;

	public constructor() {
		this.el = document.createElement("audio");
	}

	public setStream(stream: string | null) {
		if (stream) {
			this.el.src = stream;
		}
	}

	public play() {
		this.el.play();
	}

	public pause() {
		this.el.pause();
	}

	public playPause() {
		this.el.paused ? this.play() : this.pause();
	}

	public seek(time: number) {
		this.el.currentTime = time;
	}

	public setVolume(volume: number) {
		this.el.volume = volume;
	}

}

export interface PlayerState {
	playing: boolean,
	loop: boolean,
	position: number,
	duration: number,
	volume: number,
	muted: boolean,
	video: RichVideo | null
}