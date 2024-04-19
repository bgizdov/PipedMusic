<template>
	<NuxtLink :to="data.link" class="item" v-if="list && list.meta">
		<div class="img">
			<img :src="img" v-for="img in data.thumbnails" />
		</div>
		<h4>{{ list.meta.name }}</h4>
		<p>{{ list.meta.size }} songs</p>
	</NuxtLink>
</template>

<script setup lang="ts">

import { api } from '~/src/frontend/App';
import { SavedList } from '~/src/lists/SavedList';

let props = defineProps<Props>();

let list = props.list ?? (props.id ? await SavedList.get(props.id!) : null);

let data = reactive<Data>({
	thumbnails: []
});

if (list) {
	let songs = await list.list(4);
	data.thumbnails = [];
	songs.forEach(async s => {
		let t = await api.getThumbnail(s.id);
		if (t) data.thumbnails.push(t);
	});

	data.link = `/playlist/${list.id}`;
	if (list.id == "liked") data.link = "/liked";
}

interface Props {
	list?: SavedList,
	id?: string
}

interface Data {
	thumbnails: string[],
	link?: string
}

</script>