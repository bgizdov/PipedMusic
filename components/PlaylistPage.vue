<template>
	<section class="playlist-page">
		<div class="inner">
			<div class="text-block" v-if="list.meta">
				<h1>{{ list.meta.name }}</h1>
				<p>{{ $t("playlist.song_count", {count: list.meta.size}) }}</p>
			</div>
			<div class="btn-row">
				<button class="btn btn-flex" @click="play();">
					<Icon name="mdi:play" />
					<div>{{ $t("playlist.play") }}</div>
				</button>
				<button class="btn btn-flex" @click="playShuffled();">
					<Icon name="mdi:shuffle" />
					<div>{{ $t("playlist.play_shuffled") }}</div>
				</button>
				<button class="btn btn-flex" @click="deletePlaylist();" v-if="list.id != 'liked'">
					<Icon name="mdi:playlist-remove" />
					<div>{{ $t("playlist.delete") }}</div>
				</button>
			</div>
			<SongList :list="list" />
		</div>
	</section>
</template>

<script setup lang="ts">

import { player, queue } from '~/src/frontend/App';
import type { ISong } from '~/src/frontend/Database';
import { shuffle } from '~/src/frontend/Misc';
import { PlaylistUI } from '~/src/ui/PlaylistUI';

let { t } = useI18n();

let props = defineProps<Props>();

async function playInQueue(items: ISong[]) {
	await queue.clear();
	queue.items = items.map(item => item.id);
	queue.invalidate();
	await player.playIndex(0);
}

async function playShuffled() {
	let items = await props.list.list();
	await playInQueue(shuffle(items));
}

async function play() {
	let items = await props.list.list();
	await playInQueue(items);
}

async function deletePlaylist() {
	let confirmation = confirm(t("playlist.delete_confirmation"));
	if (confirmation) {
		await props.list.delete();
		navigateTo("/");
	}
}

interface Props {
	list: PlaylistUI
}

</script>