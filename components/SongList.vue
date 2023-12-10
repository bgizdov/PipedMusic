<template>
	<div class="song-list">
		<SongItem :video="video" v-for="video in data.videos" />
	</div>
</template>

<script lang="ts" setup>

import { app } from '~/src/app';
import type { Video } from '~/src/backend';

let data = reactive<Data>({
	videos: []
});

let props = defineProps<Props>();

if (props.videos) data.videos = props.videos;

if (props.ids) {
	let arr = props.ids.map((id) => {
		return app.backend.getVideo(id);
	});
	for (let v of arr) {
		let video = await v;
		if (video) data.videos.push(video);
	}
}

interface Props {
	videos?: Video[],
	ids?: string[]
}

interface Data {
	videos: Video[]
}

</script>