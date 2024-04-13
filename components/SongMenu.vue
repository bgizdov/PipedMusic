<template>
	<div>
		<div v-if="songMenu.state.visible && songMenu.video" class="song-menu" :style="style()" @click.stop>
			<div class="header">
				<SongDetails :video="songMenu.video" />
			</div>
			<div class="item" @click="queue.addNext(songMenu.video.id); songMenu.close();">
				<Icon name="mdi:playlist-play" />
				<div>Play next</div>
			</div>
			<div class="item" @click="queue.add(songMenu.video.id); songMenu.close();">
				<Icon name="mdi:playlist-music" />
				<div>Add to the queue</div>
			</div>
			<div class="item" @click="download(songMenu.video.id); songMenu.close();">
				<Icon name="material-symbols:download" />
				<div>Download song</div>
			</div>
			<div class="item" @click="likedSongs.toggle(songMenu.video.id); data.liked = !data.liked;">
				<template v-if="data.liked">
					<Icon name="mdi:heart-broken-outline" />
					<div>Unlike</div>
				</template>
				<template v-else>
					<Icon name="mdi:heart-outline" />
					<div>Like</div>
				</template>
			</div>
			<div v-if="songMenu.list && !isSavedList('liked')" class="item" @click="songMenu.list.remove(songMenu.video.id); songMenu.close();">
				<Icon name="material-symbols:playlist-remove" />
				<div>Remove from this list</div>
			</div>
		</div>
		<div class="song-menu-shade" @click.prevent="songMenu.close();" @contextmenu.prevent="songMenu.close();" :class="{ visible: songMenu.state.visible }" />
	</div>
</template>

<script setup lang="ts">

import { download } from "~/src/frontend/Actions";
import { likedSongs, queue, songMenu } from '~/src/frontend/App';
import { SavedList } from '~/src/lists/SavedList';

let data = reactive({
	liked: false
});

watch(() => songMenu.video, update);

async function update() {
	if (!songMenu.video) return;
	data.liked = await likedSongs.has(songMenu.video.id);
}

function isSavedList(id?: string): boolean {
	let savedList = songMenu.list;
	if (savedList instanceof SavedList) {
		return id ? id == savedList.id : true;
	}
	return false;
}

function style() {
	return songMenu.x && songMenu.y ? { top: `${songMenu.y}px`, left: `${songMenu.x}px` } : '';
}

</script>