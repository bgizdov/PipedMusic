<template>
	<div v-if="song" class="song-details song-item" @contextmenu.prevent="popup($event, song, props.index);">
		<div class="image" @click="playSong(song)">
			<div v-if="isPlaying" class="playing">
				<Icon name="mdi:volume" />
			</div>
			<div v-else class="hover">
				<Icon name="mdi:play" />
			</div>
			<img loading="lazy" :src="song.video.thumbnails.small">
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
</template>

<script lang="ts" setup>

import { player, queue, songMenu } from '~/src/frontend/App';
import { formatTime } from '~/src/frontend/Misc';
import { List } from '~/src/lists/List';
import { Queue } from '~/src/ui/Queue';
import type { ISong } from '~/src/frontend/Database';
import { SharedSong } from '~/src/ui/SharedSong';
import { shared } from '~/src/ui/Shared';

let props = defineProps<Props>();

let isPlaying = computed(() => {
	if (!props.song || player.playing == null) return false;
	if (props.list instanceof Queue && props.index !== undefined) {
		return queue.playingIndex == props.index;
	}
	return props.song.video.id == player.playing.video.id;
});

function playSong(song: SharedSong) {
	if (props.list instanceof Queue && props.index !== undefined) {
		queue.playIndex(props.index);
	} else {
		song.play();
	}
}

function popup(event: MouseEvent, song: SharedSong, index?: number) {
	songMenu.open(event, song, props.list, index);
}

interface Props {
	song: SharedSong,
	list?: List<ISong>,
	index?: number
}

</script>
