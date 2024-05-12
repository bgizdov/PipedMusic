<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>{{ $t("page.home.title") }}</h1>
				<p>{{ $t("page.home.description") }}</p>
			</div>

			<div class="btn-row">
				<button class="btn btn-flex" @click="addPlaylist();">
					<Icon name="mdi:playlist-plus" />
					<div>{{ $t("page.home.add_playlist") }}</div>
				</button>
			</div>

			<div class="playlists">
				<PlaylistItem :list="likedSongs!" />
				<PlaylistItem :id="list.id" v-for="list in data.playlists" />
			</div>

		</div>
	</section>
</template>

<script setup lang="ts">

import type { IPlaylist } from '~/src/frontend/Database';
import { PlaylistUI } from '~/src/ui/PlaylistUI';

let { t } = useI18n();

let data = reactive<Data>({
	playlists: []
});

let likedSongs = await PlaylistUI.get("liked");

data.playlists = await PlaylistUI.list();

async function addPlaylist() {
	let name = prompt(t("playlist.name_prompt"));
	if (name) await PlaylistUI.new(name);
	data.playlists = await PlaylistUI.list();
}

interface Data {
	playlists: IPlaylist[]
}

</script>