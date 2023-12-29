<template>
	<div v-if="video" class="song-details song-item">
		<div class="image" @click="app.play(video.id)">
			<div class="hover">
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

import type { ShallowReactive } from 'vue';
import { app } from '~/src/frontend/app';
import { formatTime } from '~/src/frontend/misc';
import type { RichVideo } from '~/src/types';

let video = ref<RichVideo | null>(null);

let props = defineProps<Props>();

onMounted(async () => {
	if (props.id) video.value = await app.data.getRichVideo(props.id);
	if (props.video) video.value = props.video;
});

interface Props {
	video?: ShallowReactive<RichVideo>,
	id?: string
}

</script>