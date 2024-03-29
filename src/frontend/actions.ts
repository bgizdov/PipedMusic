import { app, queue } from "./app";

export async function download(id: string) {
	let url = await app.data.getDownloadLink(id);
	let video = await app.data.getVideo(id);
	if (!url || !video) return;
	let link = document.createElement("a");
	link.download = `${video.author} - ${video.title}.m4a`;
	link.href = url;
	link.click();
}

export async function play(id: string) {
	await queue.clear();
	await queue.add(id);
	await queue.play(0);
}

export function shuffle<T>(items: T[]) {
	let i = items.length;
	let index;
	while (i--) {
		index = Math.floor((i + 1) * Math.random());
		[items[i], items[index]] = [items[index], items[i]];
	}
	return items;
}
