import { app, likedSongs, queue } from "./app";

export function likeToggle(id: string) {
	likedSongs.toggle(id);
	likedSongs.save();
}

export async function download(id: string) {
	let url = await app.data.getDownloadLink(id);
	let video = await app.data.getVideo(id);
	if (!url || !video) return;
	let link = document.createElement("a");
	link.download = `${video.author} - ${video.title}.m4a`;
	link.href = url;
	link.click();
}

export function play(id: string) {
	queue.clear();
	queue.play(queue.add(id));
}