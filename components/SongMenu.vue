<template>
	<div>
		<div v-if="songMenu.state.visible && songMenu.song" class="song-menu" :style="style()" @click.stop>
			<template v-if="songMenu.state.page == 'playlists'">
				<div class="header">
					<Icon name="mdi:playlist-add" />
					Add to the playlist
				</div>
				<div class="item" v-for="playlist in data.playlists" @click="songMenu.song.playlistToggle(playlist.id);">
					<Icon v-if="songMenu.song.playlists[playlist.id]" name="mdi:checkbox-marked" />
					<Icon v-else name="mdi:checkbox-blank-outline" />
					{{ playlist.name }}
				</div>
				<div class="item" v-if="!data.playlists.length">
					No playlists
				</div>
			</template>
			<template v-else>
				<div class="header">
					<SongDetails :video="songMenu.song.video" />
				</div>
				<div class="item" @click="queue.addNext(songMenu.song.video.id); songMenu.close();">
					<Icon name="mdi:playlist-play" />
					<div>Play next</div>
				</div>
				<div class="item" @click="queue.add(songMenu.song.video.id); songMenu.close();">
					<Icon name="mdi:playlist-music" />
					<div>Add to the queue</div>
				</div>
				<div class="item" @click="songMenu.setPage('playlists');">
					<Icon name="mdi:playlist-add" />
					<div>Add to the playlist</div>
				</div>
				<div class="item" @click="songMenu.song.download(); songMenu.close();">
					<Icon name="material-symbols:download" />
					<div>Download song</div>
				</div>
				<div class="item" @click="songMenu.song.playlistToggle('liked');">
					<template v-if="songMenu.song.playlists.liked">
						<Icon name="mdi:heart-broken-outline" />
						<div>Unlike</div>
					</template>
					<template v-else>
						<Icon name="mdi:heart-outline" />
						<div>Like</div>
					</template>
				</div>
				<div v-if="displayPlaylistRemove" class="item" @click="playlistRemove();">
					<Icon name="material-symbols:playlist-remove" />
					<div>Remove from this list</div>
				</div>
			</template>
		</div>
		<div class="song-menu-shade" @click.prevent="songMenu.close();" @contextmenu.prevent="songMenu.close();" :class="{ visible: songMenu.state.visible }" />
	</div>
</template>

<script setup lang="ts">

import { queue, songMenu } from '~/src/frontend/App';
import type { IPlaylist } from '~/src/frontend/Database';
import { SavedList } from '~/src/lists/SavedList';

let data = reactive<Data>({
	playlists: []
});

watch(() => songMenu.song, async () => {
	data.playlists = await SavedList.list();
});

let displayPlaylistRemove = computed(() => songMenu.list && (songMenu.list instanceof SavedList ? songMenu.list.id != 'liked' : true));

function playlistRemove() {
	if (!songMenu.list || !songMenu.song) return;
	if (songMenu.list instanceof SavedList) {
		songMenu.song.playlistRemove(songMenu.list.id);
	} else {
		songMenu.list.remove(songMenu.song.video.id);
	}
	songMenu.close();
}

function style() {
	return songMenu.x && songMenu.y ? { top: `${songMenu.y}px`, left: `${songMenu.x}px` } : '';
}

interface Data {
	playlists: IPlaylist[]
}

</script>