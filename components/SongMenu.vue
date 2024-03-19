<template>
	<div v-if="songMenu.visible && songMenu.video" class="song-menu" :style="style()">
		<div class="header">
			<SongDetails :video="songMenu.video" />
		</div>
		<div class="item" @click="queue.addNext(songMenu.video.id);">
			<Icon name="material-symbols:playlist-play" />
			<div>Play next</div>
		</div>
		<div class="item" @click="queue.add(songMenu.video.id);">
			<Icon name="material-symbols:playlist-add" />
			<div>Add to the queue</div>
		</div>
		<div class="item" @click="download(songMenu.video.id);">
			<Icon name="material-symbols:download" />
			<div>Download song</div>
		</div>
		<div class="item" @click="likeToggle(songMenu.video.id); data.liked = !data.liked;">
			<template v-if="data.liked">
				<Icon name="mdi:heart-broken-outline" />
				<div>Unlike</div>
			</template>
			<template v-else>
				<Icon name="mdi:heart-outline" />
				<div>Like</div>
			</template>
		</div>
		<div v-if="songMenu.list && !isSavedList('liked')" class="item" @click="songMenu.list.remove(songMenu.video.id);">
			<Icon name="material-symbols:playlist-remove" />
			<div>Remove from this list</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { download, likeToggle } from "~/src/frontend/actions";
import { likedSongs, queue, songMenu } from '~/src/frontend/app';
import type { ISong } from "~/src/frontend/db";
import { DBList, List } from '~/src/frontend/list';

let data = reactive({
	liked: false
});

watch(() => songMenu.video, update);

async function update() {
	if (!songMenu.video) return;
	data.liked = await likedSongs.has(songMenu.video.id);
	console.log(data.liked);
	console.log(likedSongs);
}

function isSavedList(name?: string): boolean {
	let savedList: List<ISong> | null = songMenu.list;
	if (savedList instanceof DBList) {
		return name ? name == savedList.name : true;
	}
	return false;
}

function style() {
	return songMenu.x && songMenu.y ? { top: `${songMenu.y}px`, left: `${songMenu.x}px` } : '';
}

</script>