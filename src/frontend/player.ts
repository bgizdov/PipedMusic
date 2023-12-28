export class Player {
	
	public el: HTMLAudioElement;
	
	public stream: string | null = null;

	private types = {
		default(p: HTMLAudioElement) {
			p.crossOrigin = null;
		},
		piped(p: HTMLAudioElement) {
			p.crossOrigin = "anonymous";
		}
	};

	constructor() {
		this.el = this.createPlayer();
	}

	private createPlayer(): HTMLAudioElement {
		let p = document.createElement("audio");
		return p;
	}

	setStream(stream: string | null) {
		if (stream) {
			this.el.src = stream;
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