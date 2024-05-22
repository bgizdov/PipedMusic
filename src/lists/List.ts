export abstract class List<T> {

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

}
