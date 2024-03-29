import { db, type ISong } from "./db";

export abstract class List<T> {

	public displays: DisplayedList<T>[] = [];

	abstract list(limit?: number, offset?: number): Promise<T[]>;

	abstract size(): Promise<number>;

	abstract has(id: string): Promise<boolean>;

	async toggle(id: string) {
		let found = await this.has(id);
		if (found) {
			await this.remove(id);
		} else {
			await this.add(id);
		}
	}

	abstract add(id: string): Promise<void>;
	
	abstract remove(id: string): Promise<void>;

	abstract get(index: number): Promise<T | undefined>;

	abstract clear(): Promise<void>;

	addDisplay(display: DisplayedList<T>) {
		this.displays.push(display);
	}

	removeDisplay(display: DisplayedList<T>) {
		const index = this.displays.indexOf(display);
		if (index > -1) {
			this.displays.splice(index, 1);
		}
	}

	invalidate() {
		this.displays.forEach(display => {
			display.update(this);
		});
	}

}

export class LocalList extends List<ISong> {

	public items: string[] = [];

	async list(limit?: number, offset: number = 0) {
		let items = this.items.slice(offset, limit ? offset + limit : undefined);
		return items.map(id => {
			return {id};
		});
	}

	async size() {
		return this.items.length;
	}

	async has(id: string): Promise<boolean> {
		return this.items.indexOf(id) !== -1;
	}

	async add(id: string) {
		this.items.push(id);
		this.invalidate();
	}

	async remove(id: string) {
		let i = this.items.indexOf(id);
		if (i != -1) this.items.splice(i, 1);
		this.invalidate();
	}

	async get(index: number) {
		return this.items[index] ? {id: this.items[index]} : undefined;
	}

	async clear() {
		this.items = [];
		this.invalidate();
	}

}

export class DBList extends List<ISong> {

	public id: string;
	public meta: DBListMeta | null = null;

	private constructor(id: string) {
		super();
		this.id = id;
	}
	
	private static instances: {[U: string]: DBList} = {};

	private static create(id: string): [DBList, boolean] {
		let l = this.instances[id];
		if (!l) {
			l = new DBList(id);
			this.instances[id] = l;
			return [l, true];
		}
		return [l, false];
	}

	static async get(id: string): Promise<DBList | null> {
		let [l, is_new] = DBList.create(id);
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
		let [l, is_new] = DBList.create("liked");
		if (is_new) {
			l.setMeta({
				name: "Liked",
				size: 0
			});
			l.updateMeta();
		}
		return l;
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

	setMeta(meta: DBListMeta) {
		this.meta = reactive(meta);
	}

	async updateMeta() {
		if (!this.meta) return;
		this.meta.size = await this.size();
	}

}

interface DBListMeta {
	name: string,
	size: number
}

export class DisplayedList<T> {

	public page: number = 0;
	public max_page: number = 0;

	public items: T[] = [];

	async update(list: List<T>) {
		let limit = 100;
		let offset = this.page * 100;
		this.items = await list.list(limit, offset);
		this.max_page = Math.floor(await list.size() / 100);
	}

	async prev(list: List<T>) {
		this.page = Math.max(this.page - 1, 0);
		await this.update(list);
	}

	async next(list: List<T>) {
		this.page = Math.min(this.page + 1, this.max_page);
		await this.update(list);
	}

}
