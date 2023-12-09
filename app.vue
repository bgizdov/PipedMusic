<template>
	<div>

		<section>
			<div class="inner">

				<input type="text" v-model="data.id" />
				<button @click="play(data.id)">Load</button>

			</div>
		</section>

		<div class="player">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<PlayingSong v-if="player.video" :video="player.video" />
				<div class="items">
					<button v-if="state.playing" @click="player.pause()">
						<Icon name="mdi:pause" class="main" />
					</button>
					<button v-else @click="player.play()">
						<Icon name="mdi:play" class="main" />
					</button>
				</div>
			</div>

			<div class="full inner">

				<div class="items">
					<button>
						<Icon name="mdi:skip-previous" />
					</button>
					<button v-if="state.playing" @click="player.pause()">
						<Icon name="mdi:pause" class="main" />
					</button>
					<button v-else @click="player.play()">
						<Icon name="mdi:play" class="main" />
					</button>
					<button>
						<Icon name="mdi:skip-next" />
					</button>
					<div class="time">
						{{ formatTime(state.position) }} / {{ formatTime(state.duration) }}
					</div>
				</div>

				<PlayingSong v-if="player.video" :video="player.video" />

				<div class="items">
					<button>
						<Icon v-if="0" name="cil:loop" class="semiopacity" />
						<Icon v-if="0" name="cil:loop" />
						<Icon name="cil:loop-1" />
					</button>
					<div class="volume">
						<button>
							<Icon v-if="state.volume < .2" name="mdi:volume-low" class="semiopacity" />
							<Icon v-else-if="state.volume < .7" name="mdi:volume-medium" />
							<Icon v-else name="mdi:volume-high" />
						</button>
						<div class="box">
							<input type="range" v-model="state.volume" @input="player.setVolume(state.volume)" min="0" max="1" step=".01">
						</div>
					</div>
				</div>

			</div>

		</div>

	</div>
</template>

<script lang="ts" setup>

import { Invidious } from "~/src/invidious";
import { Player, type PlayerState } from "./src/player";
import PlayingSong from "./components/PlayingSong.vue";

useHead({
	title: "Piped Music"
});

let data = reactive({
	id: randomId()
});

let state = reactive<PlayerState>({
	playing: false,
	loop: false,
	position: 0,
	duration: 0,
	volume: 1
});

function registerPlayer(player: Player) {
	let p = player.el;
	p.addEventListener("durationchange", () => state.duration = p.duration);
	p.addEventListener("timeupdate", () => state.position = p.currentTime);
	p.addEventListener("play", () => state.playing = !p.paused);
	p.addEventListener("pause", () => state.playing = !p.paused);
}

function randomId() {
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
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

let backend = new Invidious();
let player = new Player(backend);
registerPlayer(player);

async function play(id: string) {
	let video = await backend.get(id);
	player.setVideo(video);
	player.play();
}

function formatTime(seconds: number) {
	if (seconds < 0) seconds = 0;
	const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), Math.floor(seconds % 60)];
	if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	return `${m}:${String(s).padStart(2, '0')}`;
}

</script>