<template>
	<section class="playlist-page">
		<div class="inner">
			<div class="text-block" v-if="list.meta">
				<h1>{{ list.meta.name }}</h1>
				<p>{{ list.meta.size }} songs</p>
			</div>
			<div class="btn-row">
				<button class="btn btn-flex" @click="play();">
					<Icon name="mdi:play" />
					<div>Play</div>
				</button>
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

import { queue } from '~/src/frontend/App';
import type { ISong } from '~/src/frontend/Database';
import { shuffle } from '~/src/frontend/Misc';
import { SavedList } from '~/src/lists/SavedList';

let props = defineProps<Props>();

async function playInQueue(items: ISong[]) {
	await queue.clear();
	queue.items = items.map(item => item.id);
	queue.invalidate();
	await queue.play(0);
}

async function playShuffled() {
	let items = await props.list.list();
	await playInQueue(shuffle(items));
}

async function play() {
	let items = await props.list.list();
	await playInQueue(items);
}

interface Props {
	list: SavedList
}

</script>