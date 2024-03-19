import { db } from "./db";

function detect_old_lists(): string[] {
	let lists: string[] = [];
	for (let name of Object.keys(localStorage)) {
		if (name.startsWith("list_")) lists.push(name);
	}
	return lists;
}

export function migrate() {
	let lists = detect_old_lists();
	lists.forEach(name => {
		let ids = localStorage.getItem(name)?.split(",");
		if (ids) {
			db.songs.bulkAdd(ids.map(id => {
				return {id, list: "liked", timestamp: new Date()};
			}));
			console.log(`Migrated ${ids.length} songs from ${name}`);
		}
		localStorage.removeItem(name);
	});
}