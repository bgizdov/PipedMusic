export class BackendCache {

	private cache: {[U: string]: [number, any]} = {};

	public constructor() {
		this.cache = {};
	}

	public save(name: string, obj: any, ttl: number = 30*60) {
		let expiration = ((new Date()).getTime() / 1000) + ttl;
		this.cache[name] = [expiration, obj];
	}

	public async get<T>(name: string, fn: () => T | Promise<T>, ttl?: number): Promise<T> {
		let item = this.cache[name];
		let now = (new Date()).getTime() / 1000;
		if (!item || item[0] < now) {
			let res = await fn();
			this.save(name, res, ttl);
			return res;
		} else {
			return item[1];
		}
	}

}