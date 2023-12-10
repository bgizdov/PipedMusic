<template>
	<div class="song-details song-item" @click="app.play(video.id)">
		<div>
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
	
let { video } = defineProps<Props>();

interface Props {
	video: ShallowReactive<Video>
}

</script>