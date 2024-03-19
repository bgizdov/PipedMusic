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
			display.update();
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

	public name: string;

	constructor(name: string) {
		super();
		this.name = name;
	}

	async list(limit?: number, offset: number = 0) {
		let q = db.songs.where({list: this.name}).offset(offset);
		if (limit) q = q.limit(limit);
		return await q.toArray();
	}

	async size() {
		return await db.songs.where({list: this.name}).count();
	}

	async has(id: string) {
		return (await db.songs.where({list: this.name, id}).first()) !== undefined;
	}

	async add(id: string) {
		await db.songs.add({
			id,
			timestamp: new Date(),
			list: this.name
		});
		this.invalidate();
	}

	async remove(id: string) {
		await db.songs.where({list: this.name, id}).delete();
		this.invalidate();
	}

	async get(index: number) {
		return await db.songs.where({list: this.name}).offset(index).limit(1).first();
	}

	async clear() {
		await db.songs.where({list: this.name}).delete();
		this.invalidate();
	}

}

export class DisplayedList<T> {

	public list: List<T>;

	public page: number = 0;
	public max_page: number = 0;

	public items: T[] = [];
	
	constructor(list: List<T>) {
		this.list = list;
		this.list.addDisplay(this);
	}

	async update() {
		let limit = 100;
		let offset = this.page * 100;
		this.items = await this.list.list(limit, offset);
		this.max_page = Math.floor(await this.list.size() / 100);
	}

	async prev() {
		this.page = Math.max(this.page - 1, 0);
		await this.update();
	}

	async next() {
		this.page = Math.min(this.page + 1, this.max_page);
		await this.update();
	}

	destroy() {
		this.list.removeDisplay(this);
	}

}