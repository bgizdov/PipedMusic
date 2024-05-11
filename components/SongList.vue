<template>
	<div class="song-list">
		<div class="pagination" v-if="display.max_page">
			<div>
				{{ $t("list.page", {current: display.page + 1, total: display.max_page + 1 }) }}
			</div>
			<button class="btn" @click="display.prev(list);">{{ $t("list.prev_page") }}</button>
			<button class="btn" @click="display.next(list);">{{ $t("list.next_page") }}</button>
		</div>
		<SongItem :key="`${item.id}-${index(i)}`" :id="item.id" :index="index(i)" :list="list" v-for="item, i in display.items" />
	</div>
</template>

<script lang="ts" setup>

import type { ISong } from '~/src/frontend/Database';
import { DisplayedList, type DisplayableList } from '~/src/lists/DisplayedList';

let { list } = defineProps<Props>();

let display = reactive(new DisplayedList<ISong>());
list.addDisplay(display);

function index(pos: number) {
	return (display.page * 100) + pos;
}

onMounted(async () => {
	await display.update(list);
});

onUnmounted(() => {
	list.removeDisplay(display);
});

interface Props {
	list: DisplayableList<ISong>
}

</script>