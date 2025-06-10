import type { SharedSong } from "../ui/SharedSong";

export class Player {

	public el: HTMLAudioElement;

	public playing: SharedSong | null = null;

	public retryCount = 0;

	public constructor() {
		this.el = document.createElement("audio");
		this.el.volume = this.getSavedVolume();
		this.hookMediaSession();
	}

	public setPlaying(song: SharedSong) {
		this.retryCount = 0;
		this.playing = song;
		this.el.src = song.video.stream;
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
		localStorage.setItem("volume", volume.toString());
	}

	public getSavedVolume() {
		let volumeString = localStorage.getItem("volume");
		if (volumeString == null) return 1;
		let volume = Number.parseFloat(volumeString);
		return (volume <= 1 && volume >= 0) ? volume : 1;
	}

	public restart() {
		if (this.retryCount == 0) {
			setTimeout(() => {
				if (!this.playing) return;
				this.el.src = this.playing.video.stream;
			}, 1000);
		}
		this.retryCount++;
	}

	public setMediaSession() {
		if (!navigator.mediaSession || !this.playing) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.playing.video.title,
			artist: this.playing.video.author,
			album: "",
			artwork: [
				{src: this.playing.video.thumbnails.large},
				{src: this.playing.video.thumbnails.small}
			]
		});

		// Expose play/pause/next/previous to browser media controls
		try {
			navigator.mediaSession.setActionHandler("play", () => this.play());
		} catch (e) {
			alert("MediaSession play action is not supported: " + (e instanceof Error ? e.message : e));
		}
		try {
			navigator.mediaSession.setActionHandler("pause", () => this.pause());
		} catch (e) {
			alert("MediaSession pause action is not supported: " + (e instanceof Error ? e.message : e));
		}
		try {
			navigator.mediaSession.setActionHandler("previoustrack", () => {
				const event = new CustomEvent("player:prev");
				window.dispatchEvent(event);
			});
		} catch (e) {
			alert("MediaSession previous track action is not supported: " + (e instanceof Error ? e.message : e));
		}
		try {
			navigator.mediaSession.setActionHandler("nexttrack", () => {
				const event = new CustomEvent("player:next");
				window.dispatchEvent(event);
			});
		} catch (e) {
			alert("MediaSession next track action is not supported: " + (e instanceof Error ? e.message : e));
		}
	}

	public hookMediaSession() {
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

	public setPositionState() {
		if (!Number.isFinite(this.el.duration)) return;
		navigator.mediaSession.setPositionState({
			duration: this.el.duration,
			position: this.el.currentTime,
			playbackRate: this.el.playbackRate
		});
	}

}

export interface PlayerState {
	playing: boolean,
	loading: boolean,
	loop: boolean,
	position: number,
	duration: number,
	volume: number,
	muted: boolean,
	song: SharedSong | null
}
