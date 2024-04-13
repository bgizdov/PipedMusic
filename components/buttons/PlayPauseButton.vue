<template>
	<button @click="player.playPause();" class="btn-playpause">
		<Icon :class="{hidden: state.playing}" name="mdi:play" />
		<Icon :class="{hidden: !state.playing}" name="mdi:pause" />
	</button>
</template>

<script lang="ts" setup>

import { player } from '~/src/frontend/App';
import type { PlayerState } from '~/src/frontend/Player';

let { state } = defineProps<{state: PlayerState}>();

</script>