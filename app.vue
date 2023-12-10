<template>
	<div>

		<nav>
			<div class="inner">
				<NuxtLink to="/">
					<img class="logo" src="/logo.webp">
				</NuxtLink>
				<SearchBar />
				<div class="btn-row btn-row-right">
					<NuxtLink to="/search" class="btn-search">
						<Icon name="mdi:search" />
					</NuxtLink>
				</div>
			</div>
		</nav>

		<div class="content">

			<NuxtPage />

		</div>

		<div class="player">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<SongDetails v-if="app.playing" :video="app.playing" />
				<div class="btn-row">
					<button @click="state.playing ? player.pause() : player.play();" class="btn-play">
						<Icon :class="{hidden: state.playing}" name="mdi:play" class="main" />
						<Icon :class="{hidden: !state.playing}" name="mdi:pause" class="main" />
					</button>
				</div>
			</div>

			<div class="full inner">

				<div class="btn-row">
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

				<div class="btn-row">
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