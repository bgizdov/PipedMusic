import { likedSongs } from "./app";

export function likeToggle(id: string) {
	likedSongs.toggle(id);
	likedSongs.save();
}