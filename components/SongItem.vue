<template>
	<div v-if="video" class="song-details song-item">
		<div class="image" @click="play(video)">
			<div v-if="isPlaying" class="playing">
				<Icon name="mdi:volume" />
			</div>
			<div v-else class="hover">
				<Icon name="mdi:play" />
			</div>
			<img :src="video.thumbnail">
		</div>
		<div>
			<div>
				<b>{{ video.title }}</b>
			</div>
			<div>
				{{ video.author }}
			</div>
		</div>
		<div>
			{{ formatTime(video.duration) }}
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

import { app, queue } from '~/src/frontend/app';
import { formatTime } from '~/src/frontend/misc';
import type { ShallowReactive } from 'vue';
import type { List } from '~/src/frontend/list';
import type { RichVideo } from '~/src/types';
import { Queue } from '~/src/frontend/queue';

let video = ref<RichVideo | null>(null);

let props = defineProps<Props>();

let isPlaying = computed(() => {
	if (!video.value || !queue.playing) return false;
	return video.value.id == queue.playing.id;
});

function play(video: RichVideo) {
	if (props.list instanceof Queue) {
		queue.play(video.id);
	} else {
		if (!queue.has(video.id)) queue.add(video.id);
		queue.play(video.id);
	}
}

onMounted(async () => {
	if (props.id) video.value = await app.data.getRichVideo(props.id);
	if (props.video) video.value = props.video;
});

interface Props {
	video?: ShallowReactive<RichVideo>,
	id?: string,
	list?: List
}

</script>