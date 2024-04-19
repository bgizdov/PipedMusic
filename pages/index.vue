<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>Piped Music</h1>
				<p>Free & open-source music client</p>
			</div>

			<div class="btn-row">
				<button class="btn btn-flex" @click="addPlaylist();">
					<Icon name="mdi:playlist-plus" />
					<div>New playlist</div>
				</button>
			</div>

			<div class="playlists">
				<PlaylistItem :list="likedSongs" />
				<PlaylistItem :id="list.id" v-for="list in data.playlists" />
			</div>

		</div>
	</section>
</template>

<script setup lang="ts">

import { likedSongs } from '~/src/frontend/App';
import type { IPlaylist } from '~/src/frontend/Database';
import { SavedList } from '~/src/lists/SavedList';

let data = reactive<Data>({
	playlists: []
});

data.playlists = await SavedList.list();

async function addPlaylist() {
	let name = prompt("Enter the playlist name:");
	if (name) await SavedList.new(name);
	data.playlists = await SavedList.list();
}

interface Data {
	playlists: IPlaylist[]
}

</script>