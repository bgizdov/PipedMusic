import Dexie, { type Table } from "dexie";

class Database extends Dexie {

	songs!: Table<ISong, number>;

	constructor () {
		super("pipedmusic");
		this.version(1).stores({
			songs: "++n, id, list, timestamp"
		});
	}

}

export interface ISong {
	n?: number,
	id: string,
	list?: string,
	timestamp?: Date
}

export let db = new Database();