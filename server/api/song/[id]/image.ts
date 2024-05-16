import { backend } from '~/src/backend/yt';

export default defineEventHandler(async (event) => {

	const id = getRouterParam(event, "id");
	if (!id) return;
	return backend.getThumbnail(id, 920);

});