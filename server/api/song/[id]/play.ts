import { backend } from '~/src/backend/yt';

export default defineEventHandler(async (event) => {

	const id = getRouterParam(event, "id");
	if (!id) return;
	setHeader(event, "Cache-Control", "max-age=604800");
	return backend.download(id);

});