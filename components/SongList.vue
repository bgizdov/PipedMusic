<template>
	<div class="song-list">
		<div class="pagination" v-if="display.max_page">
			<div>
				Page {{ display.page + 1 }} / {{ display.max_page + 1 }}
			</div>
			<button class="btn" @click="display.prev(list);">Prev</button>
			<button class="btn" @click="display.next(list);">Next</button>
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
import { DisplayedList } from '~/src/lists/DisplayedList';
import { List } from '~/src/lists/List';
import { Queue } from '~/src/lists/Queue';

let { list } = defineProps<Props>();

let display = reactive(new DisplayedList<ISong>());
list.addDisplay(display);

async function playShuffled() {
	await queue.clear();
	let items = await list.list();
	queue.items = shuffle(items).map(item => item.id);
	queue.invalidate();
	await queue.play(0);
}

onMounted(async () => {
	await display.update(list);
});

onUnmounted(() => {
	list.removeDisplay(display);
});

interface Props {
	list: List<ISong>
}

</script>