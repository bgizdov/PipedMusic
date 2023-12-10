<template>
	<div v-if="video" class="song-details song-item" @click="app.play(video.id)">
		<div class="image">
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
	</div>
</template>

<script lang="ts" setup>

import type { ShallowReactive } from 'vue';
import { app } from '~/src/app';
import type { Video } from '~/src/backend';

let video = ref<Video | null>(null);

let props = defineProps<Props>();

if (props.id) video.value = await app.backend.getVideo(props.id);
if (props.video) video.value = props.video;

interface Props {
	video?: ShallowReactive<Video>,
	id?: string
}

</script>