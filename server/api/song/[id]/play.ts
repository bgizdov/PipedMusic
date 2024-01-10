import { backend } from '~/src/backend/yt';

export default defineEventHandler(async (event) => {

	// const id = getRouterParam(event, "id");
	// if (!id) return;
	// let s = await backend.download(id);
	// setHeader(event, "Content-Type", s.mime);
	// if (s.length) setHeader(event, "Content-Length", s.length.toString());
	// setHeader(event, "Cache-Control", "max-age=604800");
	// return s.stream;

	const id = getRouterParam(event, "id");
	if (!id) return;
	let s = await backend.download(id);

	let range = getHeader(event, "Range");
	let headers = new Headers();
	if (range) headers.append("Range", range);

	return await fetch(s.url, {headers});
	
});