<template>
	<button v-if="state.song" class="btn-like" @click="state.song.playlistToggle('liked');">
		<Icon :class="{hidden: !state.song.playlists.liked}" name="mdi:heart" />
		<Icon :class="{hidden: state.song.playlists.liked}" name="mdi:heart-outline" class="semiopacity" />
	</button>
</template>

<script lang="ts" setup>

import type { PlayerState } from '~/src/frontend/Player';

let { state } = defineProps<{state: PlayerState}>();

</script>