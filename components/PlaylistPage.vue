<template>
	<section class="playlist-page">
		<div class="inner">
			<div class="text-block" v-if="list.meta">
				<h1>{{ list.meta.name }}</h1>
				<p>{{ list.meta.size }} songs</p>
			</div>
			<div class="btn-row">
				<button class="btn btn-flex" @click="playShuffled();">
					<Icon name="mdi:shuffle" />
					<div>Play shuffled</div>
				</button>
			</div>
			<SongList :list="list" />
		</div>
	</section>
</template>

<script setup lang="ts">

import { shuffle } from '~/src/frontend/Actions';
import { queue } from '~/src/frontend/App';
import { SavedList } from '~/src/lists/SavedList';

let props = defineProps<Props>();

async function playShuffled() {
	await queue.clear();
	let items = await props.list.list();
	queue.items = shuffle(items).map(item => item.id);
	queue.invalidate();
	await queue.play(0);
}

interface Props {
	list: SavedList
}

</script>