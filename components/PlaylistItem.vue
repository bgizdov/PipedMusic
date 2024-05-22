<template>
	<NuxtLink :to="data.link" class="item" v-if="list && list.meta">
		<div class="img">
			<img :src="img" v-for="img in data.thumbnails" />
		</div>
		<h4><PlaylistName :list="list" /></h4>
		<p>{{ $t("playlist.song_count", {count: list.meta.size}) }}</p>
	</NuxtLink>
</template>

<script setup lang="ts">

import { api } from '~/src/frontend/App';
import { PlaylistUI } from '~/src/ui/PlaylistUI';

let props = defineProps<Props>();

let list = props.list ?? (props.id ? await PlaylistUI.get(props.id!) : null);

let data = reactive<Data>({
	thumbnails: []
});

if (list) {
	let songs = await list.list(4);
	data.thumbnails = [];
	songs.forEach(async s => {
		let t = await api.getThumbnails(s.id);
		if (t) data.thumbnails.push(t.small);
	});
	data.link = `/playlist/${list.id}`;
}

interface Props {
	list?: PlaylistUI,
	id?: string
}

interface Data {
	thumbnails: string[],
	link?: string
}

</script>