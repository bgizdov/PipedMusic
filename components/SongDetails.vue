<template>
	<div class="song-details">
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
import type { Video } from '~/src/backend';
	
let { video } = defineProps<Props>();

interface Props {
	video: ShallowReactive<Video>
}

</script>