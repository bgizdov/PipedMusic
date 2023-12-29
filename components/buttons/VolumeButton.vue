<template>
	<div class="volume">
		<button class="btn-volume" @click="toggle()">
			<Icon :class="{hidden: volumeLevel() != 0}" name="mdi:volume-mute" class="semiopacity" />
			<Icon :class="{hidden: volumeLevel() != 1}" name="mdi:volume-low" />
			<Icon :class="{hidden: volumeLevel() != 2}" name="mdi:volume-medium" />
			<Icon :class="{hidden: volumeLevel() != 3}" name="mdi:volume-high" />
		</button>
		<div class="box">
			<input type="range" v-model="state.volume" @input="player.setVolume(state.volume)" min="0" max="1" step=".01">
		</div>
	</div>
</template>

<script lang="ts" setup>

import type { Player, PlayerState } from '~/src/frontend/player';

let { player, state } = defineProps<Props>();

function volumeLevel() {
	if (state.volume == 0 || state.muted) return 0;
	if (state.volume < .35) return 1;
	if (state.volume < .65) return 2;
	return 3;
}

function toggle() {
	state.muted = !state.muted;
	let value = state.muted ? 0 : state.volume;
	if (state.volume == 0) state.volume = 1;
	player.setVolume(value);
}

interface Props {
	player: Player,
	state: PlayerState
}

</script>