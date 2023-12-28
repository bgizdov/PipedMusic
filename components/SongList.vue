<template>
	<div class="song-list">
		<SongItem :video="video" v-for="video in data.videos" />
		<SongItem :id="id" v-for="id in data.ids" />
	</div>
</template>

<script lang="ts" setup>

import type { RichVideo } from '~/src/types';

let data = reactive<Data>({
	videos: [],
	ids: []
});

let props = defineProps<Props>();

onMounted(async () => {
	if (props.videos) data.videos = props.videos;
	if (props.ids) data.ids = props.ids;
});

interface Props {
	videos?: RichVideo[],
	ids?: string[]
}

interface Data {
	videos: RichVideo[],
	ids: string[]
}

</script>