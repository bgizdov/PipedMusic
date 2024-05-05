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

	async dataExport(): Promise<ExportedData> {
		const playlists = await this.playlists.toArray();
		const songs = await this.songs.toArray();
		return {playlists, songs};
	}

	async dataImport(data: ExportedData) {
		await db.playlists.bulkAdd(data.playlists);
		await db.songs.bulkAdd(data.songs);
	}

	async wipe() {
		await db.playlists.clear();
		await db.songs.clear();
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

export interface ExportedData {
	songs: ISong[],
	playlists: IPlaylist[]
}

export let db = new Database();