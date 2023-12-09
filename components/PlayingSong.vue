<template>
	<div class="song">
		<img :src="video.thumbnail">
		<div>
			<div>
				<b>{{ video.title }}</b>
			</div>
			<div>
				{{ video.author }}
			</div>
		</div>
		<div>
			<button>
				<Icon name="mdi:heart-outline" class="semiopacity" />
				<Icon v-if="0" name="mdi:heart" />
			</button>
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