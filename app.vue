<template>
	<div>

		<section>
			<div class="inner">

				<input type="text" v-model="data.id" />
				<button @click="app.play(data.id)">Load</button>
				
				<SongList :ids="arr" />

			</div>
		</section>

		<div class="player">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<SongDetails v-if="app.playing" :video="app.playing" />
				<div class="items">
					<button @click="state.playing ? player.pause() : player.play();" class="btn-play">
						<Icon :class="{hidden: state.playing}" name="mdi:play" class="main" />
						<Icon :class="{hidden: !state.playing}" name="mdi:pause" class="main" />
					</button>
				</div>
			</div>

			<div class="full inner">

				<div class="items">
					<button class="btn-prev">
						<Icon name="mdi:skip-previous" />
					</button>
					<button @click="state.playing ? player.pause() : player.play();" class="btn-play">
						<Icon :class="{hidden: state.playing}" name="mdi:play" class="main" />
						<Icon :class="{hidden: !state.playing}" name="mdi:pause" class="main" />
					</button>
					<button class="btn-next">
						<Icon name="mdi:skip-next" />
					</button>
					<div class="time">
						{{ formatTime(state.position) }} / {{ formatTime(state.duration) }}
					</div>
				</div>

				<div class="song">
					<SongDetails v-if="app.playing" :video="app.playing" />
					<div>
						<button class="btn-like">
							<Icon name="mdi:heart-outline" class="semiopacity" />
							<Icon v-if="0" name="mdi:heart" />
						</button>
					</div>
				</div>

				<div class="items">
					<button class="btn-loop">
						<Icon v-if="0" name="cil:loop" class="semiopacity" />
						<Icon v-if="0" name="cil:loop" />
						<Icon name="cil:loop-1" />
					</button>
					<VolumeButton :player="player" :state="state" />
				</div>

			</div>

		</div>

	</div>
</template>

<script lang="ts" setup>

import { app } from "./src/app";
import type { Player, PlayerState } from "./src/player";

useHead({
	title: "Piped Music"
});

let arr = [
	"2Lh7zL49Lyo",
	"dp28pv_UvK8",
	"d40rzwlq8l4",
	"HhZTYsojXdA",
	"Z5NNPqJZy6g",
	"bp-svDWn5HU",
	"xyNZ4M2mI8s",
	"22U-GYVYZJE"
];

function randomId() {
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

let data = reactive({
	id: randomId()
});

let state = reactive<PlayerState>({
	playing: false,
	loop: false,
	position: 0,
	duration: 0,
	volume: 1,
	muted: false
});

function registerPlayer(player: Player) {
	let p = player.el;
	p.addEventListener("durationchange", () => state.duration = p.duration);
	p.addEventListener("timeupdate", () => state.position = p.currentTime);
	p.addEventListener("play", () => state.playing = !p.paused);
	p.addEventListener("pause", () => state.playing = !p.paused);
}

let player = app.player;

registerPlayer(player);

function formatTime(seconds: number) {
	if (seconds < 0) seconds = 0;
	const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), Math.floor(seconds % 60)];
	if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	return `${m}:${String(s).padStart(2, '0')}`;
}

</script>