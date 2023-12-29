<template>
	<div>
		<div class="player-page" v-if="state.video" :class="{ 'opened': app.global.player }">
			<div class="content">
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
							<div class="btn-row">
								<LikeButton class="btn" :state="state" />
								<button class="btn btn-prev">
									<Icon name="mdi:skip-previous" />
								</button>
								<PlayPauseButton class="btn" :state="state" />
								<button class="btn btn-next">
									<Icon name="mdi:skip-next" />
								</button>
							</div>
						</div>
					</div>
					<div class="sidebar">
						Queue soon...
					</div>
				</div>
			</div>
		</div>

		<div class="player-bar" v-if="state.video">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<SongDetails v-if="app.playing" :video="app.playing" @click="togglePlayer();" />
				<div class="btn-row">
					<PlayPauseButton :state="state" />
				</div>
			</div>

			<div class="full inner">

				<div class="btn-row" @click.self="togglePlayer()">
					<button class="btn-prev">
						<Icon name="mdi:skip-previous" />
					</button>
					<PlayPauseButton :state="state" />
					<button class="btn-next">
						<Icon name="mdi:skip-next" />
					</button>
					<div class="time">
						{{ formatTime(state.position) }} / {{ formatTime(state.duration) }}
					</div>
				</div>

				<div class="song">
					<SongDetails :video="state.video" @click="togglePlayer()" />
					<LikeButton :state="state" />
				</div>

				<div class="btn-row" @click.self="togglePlayer()">
					<button class="btn-loop">
						<Icon v-if="0" name="cil:loop" class="semiopacity" />
						<Icon v-if="0" name="cil:loop" />
						<Icon name="cil:loop-1" />
					</button>
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

import { app, likedSongs } from "~/src/frontend/app";
import type { Player, PlayerState } from "~/src/frontend/player";
import { formatTime } from "~/src/frontend/misc";

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

function togglePlayer() {
	app.global.player = !app.global.player;
}

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