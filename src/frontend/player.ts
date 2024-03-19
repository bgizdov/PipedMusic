import type { RichVideo } from "../types";

export class Player {
	
	public el: HTMLAudioElement;
	
	public playing: RichVideo | null = null;

	private retryCount = 0;

	public constructor() {
		this.el = document.createElement("audio");
		this.hookMediaSession();
	}

	public setPlaying(video: RichVideo) {
		this.retryCount = 0;
		this.playing = video;
		this.el.src = video.stream;
		this.setMediaSession();
	}

	public play() {
		this.el.play();
		if (navigator.mediaSession) {
			navigator.mediaSession.playbackState = "playing";
		}
	}

	public pause() {
		this.el.pause();
		if (navigator.mediaSession) {
			navigator.mediaSession.playbackState = "paused";
		}
	}

	public playPause() {
		this.el.paused ? this.play() : this.pause();
	}

	public seek(time: number) {
		this.el.currentTime = Math.max(Math.min(time, this.el.duration), 0);
	}

	public seekRel(relTime: number) {
		this.seek(this.el.currentTime + relTime);
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

	public setMediaSession() {
		if (!navigator.mediaSession || !this.playing) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.playing.title,
			artist: this.playing.author,
			album: "",
			artwork: [
				{src: this.playing.thumbnail}
			]
		});
	}

	private hookMediaSession() {
		if (navigator.mediaSession) {
			this.el.addEventListener("durationchange", () => this.setPositionState());
			this.el.addEventListener("timeupdate", () => this.setPositionState());
			navigator.mediaSession.setActionHandler("play", () => this.play());
			navigator.mediaSession.setActionHandler("pause", () => this.pause());
			navigator.mediaSession.setActionHandler("seekto", (a) => {
				if (a.seekTime) this.seek(a.seekTime);
			});
			navigator.mediaSession.setActionHandler("seekforward", (a) => {
				this.seekRel(a.seekOffset ? +a.seekOffset : +10);
			});
			navigator.mediaSession.setActionHandler("seekbackward", (a) => {
				this.seekRel(a.seekOffset ? -a.seekOffset : -10);
			});
		}
	}

	private setPositionState() {
		navigator.mediaSession.setPositionState({
			duration: this.el.duration,
			position: this.el.currentTime,
			playbackRate: this.el.playbackRate
		});
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