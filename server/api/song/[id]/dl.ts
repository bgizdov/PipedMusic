import { backend } from '~/src/backend/yt';

export default defineEventHandler(async (event) => {

	const id = getRouterParam(event, "id");
	if (!id) return;
	let data = await backend.download(id);
	setHeader(event, "Content-Disposition", `inline; filename="${data.filename}"`);
	return data.stream;

});