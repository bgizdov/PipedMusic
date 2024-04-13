<template>
	<NuxtLink :to="link" class="item" v-if="list.meta">
		<div class="img">
			<img :src="img" v-for="img in thumbnails" />
		</div>
		<h4>{{ list.meta.name }}</h4>
		<p>{{ list.meta.size }} songs</p>
	</NuxtLink>
</template>

<script setup lang="ts">

import { api } from '~/src/frontend/App';
import type { SavedList } from '~/src/lists/SavedList';

let props = defineProps<Props>();

let songs = await props.list.list(4);
let thumbnails: string[] = [];
songs.forEach(async s => {
	let t = await api.getThumbnail(s.id);
	if (t) thumbnails.push(t);
});

let link = `/playlist/${props.list.id}`;
if (props.list.id == "liked") link = "/liked";

interface Props {
	list: SavedList
}

</script>