<template>
	<button v-if="state.video" class="btn-like" @click="toggle()">
		<Icon :class="{hidden: !data.liked}" name="mdi:heart" />
		<Icon :class="{hidden: data.liked}" name="mdi:heart-outline" class="semiopacity" />
	</button>
</template>

<script lang="ts" setup>

import { likeToggle } from '~/src/frontend/actions';
import { likedSongs } from '~/src/frontend/app';
import type { PlayerState } from '~/src/frontend/player';

let { state } = defineProps<{state: PlayerState}>();

let data = reactive({
	liked: false
});

async function update() {
	if (!state.video) return;
	data.liked = await likedSongs.has(state.video.id);
}

watch(() => state.video, update);

onMounted(update);

function toggle() {
	if (!state.video) return;
	likeToggle(state.video.id);
	data.liked = !data.liked;
}

</script>