export abstract class Backend {

	public abstract get(id: string): Promise<Video | null>;

	public selectStream(streams: Stream[], quality: number): Stream | null {
		let stream: Stream | null = null;
		let gap = Number.MAX_SAFE_INTEGER;
		streams.forEach(s => {
			let g = quality - s.sampleRate;
			if (g < gap) stream = s, gap = g;
		});
		return stream;
	}

}

export interface Video {
	id: string,
	title: string,
	author: string,
	thumbnail: string,
	streams: Stream[]
}

export interface Stream {
	sampleRate: number,
	url: string
}