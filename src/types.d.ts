export interface Video {
	id: string,
	title: string,
	author: string
}

export interface RichVideo extends Video {
	thumbnail: string,
	stream: string
}

export interface ComboObject {
	[U: string]: any
}