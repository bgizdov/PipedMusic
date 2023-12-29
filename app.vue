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

		<div class="player" v-if="state.video">

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
					<SongDetails :video="state.video" />
					<div>
						<button class="btn-like" @click="likedSongs.toggle(state.video.id); likedSongs.save();">
							<Icon v-if="likedSongs.has(state.video.id)" name="mdi:heart" />
							<Icon v-else name="mdi:heart-outline" class="semiopacity" />
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

import { app, likedSongs } from "~/src/frontend/app";
import type { Player, PlayerState } from "~/src/frontend/player";
import { formatTime } from "./src/frontend/misc";

useHead({
	title: "Piped Music"
});

let state = reactive<PlayerState>({
	playing: false,
	loop: false,
	position: 0,
	duration: 0,
	volume: 1,
	muted: false,
	video: null
});

function registerPlayer(player: Player) {
	let p = player.el;
	p.addEventListener("durationchange", () => state.duration = p.duration);
	p.addEventListener("timeupdate", () => state.position = p.currentTime);
	p.addEventListener("play", () => state.playing = !p.paused);
	p.addEventListener("pause", () => state.playing = !p.paused);
	p.addEventListener("canplay", () => state.video = app.playing);
}

let player = app.player;

registerPlayer(player);

</script>