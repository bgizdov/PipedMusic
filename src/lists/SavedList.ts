import { db, type ISong } from "../frontend/Database";
import { randomString } from "../frontend/Misc";
import { List } from "./List";

export class SavedList extends List<ISong> {

	public id: string;
	public meta: SavedListMeta | null = null;

	private constructor(id: string) {
		super();
		this.id = id;
	}
	
	private static instances: {[U: string]: SavedList} = {};

	private static create(id: string): [SavedList, boolean] {
		let l = this.instances[id];
		if (!l) {
			l = new SavedList(id);
			this.instances[id] = l;
			return [l, true];
		}
		return [l, false];
	}

	static async get(id: string): Promise<SavedList | null> {
		let [l, is_new] = SavedList.create(id);
		if (is_new) {
			let playlist = await db.playlists.where({id}).first();
			if (!playlist) return null;
			l.setMeta({
				name: playlist.name,
				size: await l.size()
			});
		}
		return l;
	}

	static getLiked() {
		let [l, is_new] = SavedList.create("liked");
		if (is_new) {
			l.setMeta({
				name: "Liked",
				size: 0
			});
			l.updateMeta();
		}
		return l;
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
		this.invalidate();
		await this.updateMeta();
	}

	async remove(id: string) {
		await db.songs.where({list: this.id, id}).delete();
		this.invalidate();
		await this.updateMeta();
	}

	async get(index: number) {
		return await db.songs.where({list: this.id}).offset(index).limit(1).first();
	}

	async clear() {
		await db.songs.where({list: this.id}).delete();
		this.invalidate();
		await this.updateMeta();
	}

	setMeta(meta: SavedListMeta) {
		this.meta = reactive(meta);
	}

	async updateMeta() {
		if (!this.meta) return;
		this.meta.size = await this.size();
	}

	async delete() {
		await db.playlists.where({id: this.id}).delete();
	}

}

interface SavedListMeta {
	name: string,
	size: number
}
