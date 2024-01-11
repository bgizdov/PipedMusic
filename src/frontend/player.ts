import type { RichVideo } from "../types";

export class Player {
	
	public el: HTMLAudioElement;
	
	public playing: RichVideo | null = null;

	private retryCount = 0;

	public constructor() {
		this.el = document.createElement("audio");
	}

	public setPlaying(video: RichVideo) {
		this.retryCount = 0;
		this.playing = video;
		this.el.src = video.stream;
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

	public restart() {
		if (this.retryCount == 0) {
			setTimeout(() => {
				if (!this.playing) return;
				this.el.src = this.playing.stream;
			}, 1000);
		}
		this.retryCount++;
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