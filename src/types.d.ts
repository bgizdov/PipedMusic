export interface Video {
	id: string,
	title: string,
	author: string,
	duration: number
}

export interface RichVideo extends Video {
	thumbnails: Thumbnails,
	stream: string
}

export interface Thumbnails {
	small: string,
	large: string
}

export interface ComboObject {
	[U: string]: any
}