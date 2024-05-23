<template>
	<div v-if="song">
		<SongItem :song="song" :list="props.list" :index="props.index" />
	</div>
	<div v-else class="song-details song-item">
		<div class="image">
			<Icon name="svg-spinners:180-ring" />
		</div>
		<div>
			<div>{{ $t("misc.loading") }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import type { ISong } from '~/src/frontend/Database';
import type { List } from '~/src/lists/List';
import { SharedSong } from '~/src/ui/SharedSong';

let props = defineProps<Props>();

let song = ref<SharedSong | null>(null);

onMounted(async () => {
	if (typeof props.song == "string") {
		song.value = await SharedSong.get(props.song);
	} else {
		song.value = props.song;
	}
});

interface Props {
	song: SharedSong | string,
	list?: List<ISong>,
	index?: number
}

</script>
