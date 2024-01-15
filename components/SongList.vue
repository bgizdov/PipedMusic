<template>
	<div class="song-list">
		<div class="pagination" v-if="data.page != data.max_page">
			<div>
				Page {{ data.page + 1 }} / {{ data.max_page + 1 }}
			</div>
			<button class="btn" @click="prev();">Prev</button>
			<button class="btn" @click="next();">Next</button>
		</div>
		<SongItem :key="id" :id="id" :index="(data.page * 100) + i" :list="list" v-for="id, i in list.getPage(data.page)" />
		<div v-if="!(list instanceof Queue)">
			<button class="btn" @click="playShuffled();">Play shuffle</button>
		</div>
	</div>
</template>

<script lang="ts" setup>

import { queue } from '~/src/frontend/app';
import type { List } from '~/src/frontend/list';
import { Queue } from '~/src/frontend/queue';

let { list } = defineProps<Props>();

let data = reactive({
	page: 0,
	max_page: computed(() => Math.floor(list.size() / 100))
});

function playShuffled() {
	queue.replace(list.clone().shuffle().items);
	queue.play(0);
}

function prev() {
	data.page = Math.max(0, data.page - 1);
}

function next() {
	data.page = Math.min(data.max_page, data.page + 1);
}

interface Props {
	list: List
}

</script>