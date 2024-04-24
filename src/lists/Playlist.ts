import { db, type IPlaylist, type ISong } from "../frontend/Database";
import { randomString } from "../frontend/Misc";
import { List } from "./List";

export class Playlist extends List<ISong> {

	public id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	static async new(name: string) {
		let id = randomString(10);
		while ((await db.playlists.where({id}).toArray()).length) {
			id = randomString(10);
		}
		await db.playlists.add({id, name});
	}

	static async list(limit?: number, offset: number = 0) {
		let q = db.playlists.offset(offset);
		if (limit) q = q.limit(limit);
		return await q.toArray();
	}

	async info(): Promise<IPlaylist | null> {
		if (this.id == "liked") {
			return {id: this.id, name: "Liked songs"};
		} else {
			return await db.playlists.where({id: this.id}).first() ?? null;
		}
	}

	async list(limit?: number, offset: number = 0) {
		let q = db.songs.where({list: this.id}).reverse().offset(offset);
		if (limit) q = q.limit(limit);
		return await q.toArray();
	}

	async size() {
		return await db.songs.where({list: this.id}).count();
	}

	async has(id: string) {
		return (await db.songs.where({list: this.id, id}).first()) !== undefined;
	}

	async add(id: string) {
		await db.songs.add({
			id,
			timestamp: new Date(),
			list: this.id
		});
	}

	async remove(id: string) {
		await db.songs.where({list: this.id, id}).delete();
	}

	async get(index: number) {
		return await db.songs.where({list: this.id}).offset(index).limit(1).first();
	}

	async clear() {
		await db.songs.where({list: this.id}).delete();
	}

	async delete() {
		await db.playlists.where({id: this.id}).delete();
	}

}
