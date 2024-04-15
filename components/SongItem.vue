<template>
	<div v-if="song" class="song-details song-item" @contextmenu.prevent="popup($event, song);">
		<div class="image" @click="playSong(song.video)">
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
import type { ShallowReactive } from 'vue';
import { List } from '~/src/lists/List';
import type { RichVideo } from '~/src/types';
import { Queue } from '~/src/lists/Queue';
import { play } from '~/src/frontend/Actions';
import type { ISong } from '~/src/frontend/Database';
import { SharedSong } from '~/src/frontend/SharedSong';

let song = ref<SharedSong | null>(null);

let props = defineProps<Props>();

let isPlaying = computed(() => {
	if (!song.value || queue.playing == null) return false;
	if (props.list instanceof Queue && props.index !== undefined) {
		return queue.playing == props.index;
	}
	return song.value.video.id == queue.playing_id;
});

function playSong(video: RichVideo) {
	if (props.list instanceof Queue && props.index !== undefined) {
		queue.play(props.index);
	} else {
		play(video.id);
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