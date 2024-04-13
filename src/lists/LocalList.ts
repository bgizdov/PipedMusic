import type { ISong } from "../frontend/Database";
import { List } from "./List";

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
