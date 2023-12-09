import type { ShallowReactive } from "vue";
import type { Backend, Video } from "./backend";

export class Player {

	public state: ShallowReactive<PlayerState>;
	
	public el: HTMLAudioElement;
	
	public video: Video | null = null;

	public backend: Backend;

	constructor(backend: Backend) {
		this.backend = backend;
		this.state = reactive({
			playing: false,
			loop: false,
			position: 0,
			duration: 0,
			volume: 1
		});
		this.el = this.createPlayer();
	}

	private createPlayer(): HTMLAudioElement {
		let p = document.createElement("audio");
		let s = this.state;
		p.addEventListener("durationchange", () => s.duration = p.duration);
		p.addEventListener("timeupdate", () => s.position = p.currentTime);
		p.addEventListener("play", () => s.playing = !p.paused);
		p.addEventListener("pause", () => s.playing = !p.paused);
		return p;
	}

	setVideo(video: Video | null) {
		if (video) {
			this.video = reactive<Video>(video);
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
		this.state.volume = volume;
	}

}

interface PlayerState {
	playing: boolean,
	loop: boolean,
	position: number,
	duration: number,
	volume: number
}