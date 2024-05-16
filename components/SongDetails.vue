<template>
	<div class="song-details">
		<div class="image">
			<img loading="lazy" :src="video.thumbnails.small">
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
import type { RichVideo } from '~/src/types';

let { video } = defineProps<Props>();

interface Props {
	video: ShallowReactive<RichVideo>
}

</script>