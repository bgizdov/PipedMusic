<template>
	<div>

		<section>
			<div class="inner">

				<input type="text" v-model="data.id" />
				<button @click="play(data.id)">Load</button>

			</div>
		</section>

		<div class="player">

			<div class="progress" @mousedown="data.seeking = true;" @mouseup="data.seeking = false;">
				<div class="bar" />
				<div class="bar" :style="{ width: (data.progress/player.state.duration)*100+'%' }" />
				<input type="range" min="0" :max="player.state.duration" v-model="data.progress" step=".1" @input="seek">
			</div>
			<div class="inner">

				<div class="items">
					<button>
						<Icon name="mdi:skip-previous" />
					</button>
					<button v-if="player.state.playing" @click="player.pause()">
						<Icon name="mdi:pause" class="main" />
					</button>
					<button v-else @click="player.play()">
						<Icon name="mdi:play" class="main" />
					</button>
					<button>
						<Icon name="mdi:skip-next" />
					</button>
					<div class="time">
						{{ formatTime(player.state.position) }} / {{ formatTime(player.state.duration) }}
					</div>
				</div>

				<div class="song">
					<template v-if="player.video">
						<img :src="player.video.thumbnail">
						<div>
							<div>
								<b>{{ player.video.title }}</b>
							</div>
							<div>
								{{ player.video.author }}
							</div>
						</div>
						<div>
							<button>
								<Icon name="mdi:heart-outline" class="semiopacity" />
								<Icon v-if="0" name="mdi:heart" />
							</button>
						</div>
					</template>
				</div>

				<div class="items">
					<button>
						<Icon v-if="0" name="cil:loop" class="semiopacity" />
						<Icon v-if="0" name="cil:loop" />
						<Icon name="cil:loop-1" />
					</button>
					<div class="volume">
						<button>
							<Icon v-if="player.state.volume < .2" name="mdi:volume-low" class="semiopacity" />
							<Icon v-else-if="player.state.volume < .7" name="mdi:volume-medium" />
							<Icon v-else name="mdi:volume-high" />
						</button>
						<div class="box">
							<input type="range" orient="vertical" v-model="player.state.volume" @input="player.setVolume(player.state.volume)" min="0" max="1" step=".01">
						</div>
					</div>
				</div>

			</div>

		</div>

	</div>
</template>

<script lang="ts" setup>

import { Invidious } from "~/src/invidious";
import { Player } from "./src/player";

useHead({
	title: "Piped Music"
});

let data = reactive({
	id: randomId(),
	progress: 0,
	seeking: false
});

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

watch(() => player.state.position, () => {
	if (!data.seeking) data.progress = player.state.position;
});

async function play(id: string) {
	let video = await backend.get(id);
	player.setVideo(video);
	player.play();
}

function seek(e: Event) {
	let el = e.target as HTMLInputElement;
	player.seek(el.valueAsNumber);
}

function formatTime(seconds: number) {
	if (seconds < 0) seconds = 0;
	const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), Math.floor(seconds % 60)];
	if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	return `${m}:${String(s).padStart(2, '0')}`;
}

</script>