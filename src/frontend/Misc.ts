export function formatTime(seconds: number) {
	if (seconds < 0) seconds = 0;
	const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), Math.floor(seconds % 60)];
	if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	return `${m}:${String(s).padStart(2, '0')}`;
}

export function shuffle<T>(items: T[]) {
	let i = items.length;
	let index;
	while (i--) {
		index = Math.floor((i + 1) * Math.random());
		[items[i], items[index]] = [items[index], items[i]];
	}
	return items;
}
