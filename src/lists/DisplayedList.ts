import type { List } from "./List";

export class DisplayedList<T> {

	public page: number = 0;
	public max_page: number = 0;

	public items: T[] = [];

	async update(list: DisplayableList<T>) {
		let limit = 100;
		let offset = this.page * 100;
		this.items = await list.list(limit, offset);
		this.max_page = Math.floor(await list.size() / 100);
	}

	async prev(list: DisplayableList<T>) {
		this.page = Math.max(this.page - 1, 0);
		await this.update(list);
	}

	async next(list: DisplayableList<T>) {
		this.page = Math.min(this.page + 1, this.max_page);
		await this.update(list);
	}

}

export interface DisplayableList<T> extends List<T> {

	addDisplay(display: DisplayedList<T>): void;

	removeDisplay(display: DisplayedList<T>): void;

}
