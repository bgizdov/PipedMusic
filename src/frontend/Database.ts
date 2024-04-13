import Dexie, { type Table } from "dexie";

class Database extends Dexie {

	songs!: Table<ISong, number>;

	playlists!: Table<IPlaylist, number>;

	constructor () {
		super("pipedmusic");
		this.version(2).stores({
			songs: "++n, id, list, timestamp",
			playlists: "++n, id, name"
		});
	}

}

export interface ISong {
	n?: number,
	id: string,
	list?: string,
	timestamp?: Date
}

export interface IPlaylist {
	n?: number,
	id: string,
	name: string
}

export let db = new Database();