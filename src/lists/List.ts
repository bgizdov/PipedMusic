import type { DisplayedList } from "./DisplayedList";

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
