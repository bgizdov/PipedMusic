<template>
	<div>
		<div class="player-page" v-if="state.song" :class="{ 'opened': shared.player_opened }" @touchmove="playerTouchMove" @touchend="playerTouchEnd" :style="data.player_page_offset ? { transition: 'none', transform: 'translateY('+data.player_page_offset+'px)' } : ''">
			<div class="wrapper" :style="data.player_page_offset ? { overflow: 'hidden' } : ''" ref="wrapper">
				<div class="mobile-nav">
					<button class="btn-close" @click="togglePlayer();">
						<Icon name="mdi:chevron-down" />
					</button>
				</div>
				<div class="grid">
					<div class="player">
						<img :src="state.song.video.thumbnails.large" @click="player.playPause()" />
						<div class="mobile">
							<h2>
								{{ state.song.video.title }}
							</h2>
							<div>
								{{ state.song.video.author }}
							</div>
							<div class="mobile-progress">
								<ProgressBar :state="state" :player="player" />
								<div class="time">
									<div>{{ formatTime(state.position) }}</div>
									<div>{{ formatTime(state.duration) }}</div>
								</div>
							</div>
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
						<p>{{ $t("queue.title") }}</p>
						<SongList :list="queue" />
					</div>
				</div>
			</div>
		</div>

		<div class="player-bar" v-if="state.song">

			<ProgressBar :player="player" :state="state" />

			<div class="mini inner">
				<SongDetails :key="state.song.video.id" :video="state.song.video" @click="togglePlayer();" />
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
					<SongDetails :key="state.song.video.id" :video="state.song.video" @click="togglePlayer()" />
					<LikeButton :state="state" />
				</div>

				<div class="btn-row" @click.self="togglePlayer()">
					<LoopButton />
					<VolumeButton :player="player" :state="state" />
					<button class="btn-player" @click="togglePlayer()">
						<Icon v-if="shared.player_opened" name="mdi:chevron-down" />
						<Icon v-else name="mdi:chevron-up" />
					</button>
				</div>

			</div>

		</div>
	</div>
</template>

<script lang="ts" setup>

import { player, queue } from "~/src/frontend/App";
import type { Player, PlayerState } from "~/src/frontend/Player";
import { formatTime } from "~/src/frontend/Misc";
import type { ComboObject } from "~/src/types";
import { shared } from "~/src/ui/Shared";
import { settings } from "~/src/ui/Settings";

let wrapper = ref<HTMLElement | null>(null);

let data = reactive<ComboObject>({
	player_page_offset: 0,
	start_y: null,
	now_y: null
});

let state = reactive<PlayerState>({
	playing: false,
	loop: false,
	loading: false,
	position: 0,
	duration: 1,
	volume: player.el.volume,
	muted: player.el.volume == 0,
	song: null
});

function togglePlayer() {
	shared.player_opened = !shared.player_opened;
}

function registerPlayer(player: Player) {
	let p = player.el;
	p.addEventListener("durationchange", () => state.duration = p.duration);
	p.addEventListener("timeupdate", () => state.position = p.currentTime);
	p.addEventListener("play", () => state.playing = !p.paused);
	p.addEventListener("pause", () => state.playing = !p.paused);
	p.addEventListener("error", () => player.restart());
	p.addEventListener("loadstart", () => state.loading = true);
	p.addEventListener("loadeddata", () => state.loading = false);
	p.addEventListener("loadstart", () => {
		state.song = player.playing;
		shared.player_visible = true;
	});
}

registerPlayer(player);

watch(() => shared.player_opened, () => {
	let html = document.querySelector("html");
	if (html) {
		if (shared.player_opened) html.classList.add("block-scrolling");
		else html.classList.remove("block-scrolling");
	}
});

function movePlayerPage() {
	data.player_page_offset = data.now_y != null ? Math.max(data.now_y - data.start_y, 0) : 0;
}

function playerTouchMove(event: TouchEvent) {
	if (wrapper.value && wrapper.value.scrollTop) return;
	let cy = event.touches[0].clientY;
	if (!data.start_y) data.start_y = cy;
	else data.now_y = cy;
	movePlayerPage();
}

function playerTouchEnd() {
	data.now_y = null;
	data.start_y = null;
	if (data.player_page_offset > 200) {
		shared.player_opened = false;
	}
	movePlayerPage();
}

onMounted(() => {
	if (process.client && settings.prefs.save_queue) {
		setTimeout(() => queue.loadQueue(), 100);
	}
});

</script>