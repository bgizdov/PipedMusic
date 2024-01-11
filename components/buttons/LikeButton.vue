<template>
	<button v-if="state.video" class="btn-like" @click="toggle()">
		<Icon :class="{hidden: !liked}" name="mdi:heart" />
		<Icon :class="{hidden: liked}" name="mdi:heart-outline" class="semiopacity" />
	</button>
</template>

<script lang="ts" setup>

import { likeToggle } from '~/src/frontend/actions';
import { likedSongs } from '~/src/frontend/app';
import type { PlayerState } from '~/src/frontend/player';

let liked = computed(() => state.video ? likedSongs.has(state.video.id) : false);

let { state } = defineProps<{state: PlayerState}>();

function toggle() {
	if (!state.video) return;
	likeToggle(state.video.id);
}

</script>