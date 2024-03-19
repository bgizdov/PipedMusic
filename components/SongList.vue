<template>
	<div class="song-list">
		<div class="pagination" v-if="display.page != display.max_page">
			<div>
				Page {{ display.page + 1 }} / {{ display.max_page + 1 }}
			</div>
			<button class="btn" @click="display.prev();">Prev</button>
			<button class="btn" @click="display.next();">Next</button>
		</div>
		<SongItem :key="item.id" :id="item.id" :index="(display.page * 100) + i" :list="list" v-for="item, i in display.items" />
		<div v-if="!(list instanceof Queue)">
			<button class="btn" @click="playShuffled();">Play shuffle</button>
		</div>
	</div>
</template>

<script lang="ts" setup>

import { shuffle } from '~/src/frontend/actions';
import { queue } from '~/src/frontend/app';
import type { ISong } from '~/src/frontend/db';
import { DisplayedList, List } from '~/src/frontend/list';
import { Queue } from '~/src/frontend/queue';

let { list } = defineProps<Props>();

let display = reactive(new DisplayedList(list));

async function playShuffled() {
	await queue.clear();
	let items = await list.list();
	shuffle(items).forEach(async i => {
		await queue.add(i.id);
	});
	await queue.play(0);
}

onMounted(async () => {
	await display.update();
});

interface Props {
	list: List<ISong>
}

</script>