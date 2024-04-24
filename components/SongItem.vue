<template>
	<div v-if="song" class="song-details song-item" @contextmenu.prevent="popup($event, song);">
		<div class="image" @click="playSong(song)">
			<div v-if="isPlaying" class="playing">
				<Icon name="mdi:volume" />
			</div>
			<div v-else class="hover">
				<Icon name="mdi:play" />
			</div>
			<img loading="lazy" :src="song.video.thumbnail">
		</div>
		<NuxtLink :to="'/song/' + song.video.id" @click="shared.player = false;">
			<div>
				<b>{{ song.video.title }}</b>
			</div>
			<div>
				{{ song.video.author }}
			</div>
		</NuxtLink>
		<div>
			{{ formatTime(song.video.duration) }}
		</div>
	</div>
	<div v-else class="song-details song-item">
		<div class="image">
			<Icon name="svg-spinners:180-ring" />
		</div>
		<div>
			<div>
				Loading...
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>

import { queue, shared, songMenu } from '~/src/frontend/App';
import { formatTime } from '~/src/frontend/Misc';
import { List } from '~/src/lists/List';
import { Queue } from '~/src/ui/Queue';
import type { ISong } from '~/src/frontend/Database';
import { SharedSong } from '~/src/ui/SharedSong';

let song = ref<SharedSong | null>(null);

let props = defineProps<Props>();

let isPlaying = computed(() => {
	if (!song.value || queue.playing == null) return false;
	if (props.list instanceof Queue && props.index !== undefined) {
		return queue.playing == props.index;
	}
	return song.value.video.id == queue.playing_id;
});

function playSong(song: SharedSong) {
	if (props.list instanceof Queue && props.index !== undefined) {
		queue.play(props.index);
	} else {
		song.play();
	}
}

function popup(event: MouseEvent, song: SharedSong) {
	songMenu.open(event, song, props.list);
}

onMounted(async () => {
	if (props.id) song.value = await SharedSong.get(props.id);
	if (props.song) song.value = props.song;
});

interface Props {
	song?: SharedSong,
	id?: string,
	list?: List<ISong>,
	index?: number
}

</script>