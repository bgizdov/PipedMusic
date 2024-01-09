<template>
	<div>
		<div class="player-page" v-if="state.video" :class="{ 'opened': app.global.player }">
			<div class="wrapper">
				<div class="mobile-nav">
					<button class="btn-close" @click="togglePlayer();">
						<Icon name="mdi:chevron-down" />
					</button>
				</div>
				<div class="grid">
					<div class="player">
						<img :src="state.video.thumbnail" @click="player.playPause()" />
						<div class="mobile">
							<h2>
								{{ state.video.title }}
							</h2>
							<div>
								{{ state.video.author }}
							</div>
							<ProgressBar :state="state" :player="player" />
							<div class="btn-row">
								<LikeButton :state="state" />
								<PrevButton />
								<PlayPauseButton class="btn" :state="state" />
								<NextButton />
								<LoopButton />
							</div>
						</div>
					</div>
					<div class="sidebar">
						<p>Queue</p>
						<SongList :list="queue" />
					</div>
				</div>
			</div>
		</div>

		<div class="player-bar" v-if="state.video">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<SongDetails :video="state.video" @click="togglePlayer();" />
				<div class="btn-row">
					<PlayPauseButton :state="state" />
				</div>
			</div>

			<div class="full inner">

				<div class="btn-row" @click.self="togglePlayer()">
					<PrevButton />
					<PlayPauseButton :state="state" />
					<NextButton />
					<div class="time">
						{{ formatTime(state.position) }} / {{ formatTime(state.duration) }}
					</div>
				</div>

				<div class="song">
					<SongDetails :video="state.video" @click="togglePlayer()" />
					<LikeButton :state="state" />
				</div>

				<div class="btn-row" @click.self="togglePlayer()">
					<LoopButton />
					<VolumeButton :player="player" :state="state" />
					<button class="btn-player" @click="togglePlayer()">
						<Icon v-if="app.global.player" name="mdi:chevron-down" />
						<Icon v-else name="mdi:chevron-up" />
					</button>
				</div>

			</div>

		</div>
	</div>
</template>

<script lang="ts" setup>

import { app, queue } from "~/src/frontend/app";
import type { Player, PlayerState } from "~/src/frontend/player";
import { formatTime } from "~/src/frontend/misc";

let state = reactive<PlayerState>({
	playing: false,
	loop: false,
	position: 0,
	duration: 0,
	volume: 1,
	muted: false,
	video: null
});

function togglePlayer() {
	app.global.player = !app.global.player;
}

function registerPlayer(player: Player) {
	let p = player.el;
	p.addEventListener("durationchange", () => state.duration = p.duration);
	p.addEventListener("timeupdate", () => state.position = p.currentTime);
	p.addEventListener("play", () => state.playing = !p.paused);
	p.addEventListener("pause", () => state.playing = !p.paused);
	p.addEventListener("canplay", () => state.video = queue.playing);
}

let player = app.player;

registerPlayer(player);

watch(() => app.global.player, () => {
	let html = document.querySelector("html");
	if (html) {
		if (app.global.player) html.classList.add("block-scrolling");
		else html.classList.remove("block-scrolling");
	}
});

</script>