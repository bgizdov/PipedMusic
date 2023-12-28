<template>
	<div class="progress" @mousedown="data.seeking = true;" @mouseup="data.seeking = false;">
		<div class="bar" />
		<div class="bar" :style="{ width: (data.progress/state.duration)*100+'%' }" />
		<input type="range" min="0" :max="state.duration" v-model="data.progress" step=".1" @input="seek">
	</div>
</template>

<script lang="ts" setup>

import type { Player, PlayerState } from '~/src/frontend/player';

let { player, state } = defineProps<Props>();

let data = reactive({
	seeking: false,
	progress: 0
});

watch(() => state.position, () => {
	if (!data.seeking) data.progress = state.position;
});

function seek(e: Event) {
	let el = e.target as HTMLInputElement;
	player.seek(el.valueAsNumber);
}

interface Props {
	player: Player,
	state: PlayerState
}

</script>