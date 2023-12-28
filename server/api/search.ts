import { backend } from '~/src/backend/yt';

export default defineEventHandler(async (event) => {

	const { q } = getQuery<{q: string | null}>(event);
	if (!q) return;
	setHeader(event, "Cache-Control", "max-age=604800");
	return backend.getSearch(q);

});