<template>
	<div v-if="video" class="song-details song-item" @click.right.prevent="popup($event, video);">
		<div class="image" @click="play(video)">
			<div v-if="isPlaying" class="playing">
				<Icon name="mdi:volume" />
			</div>
			<div v-else class="hover">
				<Icon name="mdi:play" />
			</div>
			<img :src="video.thumbnail">
		</div>
		<div @click="popup($event, video, true);">
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

import { app, queue, songMenu } from '~/src/frontend/app';
import { formatTime } from '~/src/frontend/misc';
import type { ShallowReactive } from 'vue';
import type { List } from '~/src/frontend/list';
import type { RichVideo } from '~/src/types';
import { Queue } from '~/src/frontend/queue';

let video = ref<RichVideo | null>(null);

let props = defineProps<Props>();

let isPlaying = computed(() => {
	if (!video.value || queue.playing == null) return false;
	return video.value.id == queue.items[queue.playing];
});

function play(video: RichVideo) {
	if (props.list instanceof Queue) {
		queue.play(queue.index(video.id));
	} else {
		let index = queue.index(video.id);
		if (index == -1) index = queue.add(video.id);
		queue.play(index);
	}
}

function popup(event: MouseEvent, video: RichVideo, force?: boolean) {
	songMenu.visible = force ?? !songMenu.visible;
	songMenu.video = video;
	songMenu.list = props.list ?? null;
	songMenu.x = event.pageX;
	songMenu.y = event.pageY;
	songMenu.hideable = false;
	setTimeout(() => {
		songMenu.hideable = true;
	}, 100);
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