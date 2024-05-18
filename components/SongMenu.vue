<template>
	<div>
		<div v-if="songMenu.state.visible && songMenu.song" class="song-menu" :style="style()" @click.stop>
			<template v-if="songMenu.state.page == 'playlists'">
				<div class="header">
					<Icon name="mdi:playlist-add" />
					{{ $t("song_menu.add_to_playlist") }}
				</div>
				<div class="item" v-for="playlist in data.playlists" @click="songMenu.song.playlistToggle(playlist.id);">
					<Icon v-if="songMenu.song.playlists[playlist.id]" name="mdi:checkbox-marked" />
					<Icon v-else name="mdi:checkbox-blank-outline" />
					{{ playlist.name }}
				</div>
				<div class="item" v-if="!data.playlists.length">
					{{ $t("song_menu.no_playlists") }}
				</div>
			</template>
			<template v-else>
				<div class="header">
					<SongDetails :video="songMenu.song.video" />
				</div>
				<div class="item" @click="queue.addNext(songMenu.song.video.id); songMenu.close();">
					<Icon name="mdi:playlist-play" />
					<div>{{ $t("song_menu.play_next") }}</div>
				</div>
				<div class="item" @click="queue.add(songMenu.song.video.id); songMenu.close();">
					<Icon name="mdi:playlist-music" />
					<div>{{ $t("song_menu.add_to_queue") }}</div>
				</div>
				<div class="item" @click="songMenu.setPage('playlists');">
					<Icon name="mdi:playlist-add" />
					<div>{{ $t("song_menu.add_to_playlist") }}</div>
				</div>
				<div class="item" @click="songMenu.song.download(); songMenu.close();">
					<Icon name="material-symbols:download" />
					<div>{{ $t("song_menu.download") }}</div>
				</div>
				<div class="item" @click="songMenu.song.playlistToggle('liked');">
					<template v-if="songMenu.song.playlists.liked">
						<Icon name="mdi:heart-broken-outline" />
						<div>{{ $t("song_menu.unlike") }}</div>
					</template>
					<template v-else>
						<Icon name="mdi:heart-outline" />
						<div>{{ $t("song_menu.like") }}</div>
					</template>
				</div>
				<div v-if="displayPlaylistRemove" class="item" @click="playlistRemove();">
					<Icon name="material-symbols:playlist-remove" />
					<div>{{ $t("song_menu.remove_from_list") }}</div>
				</div>
			</template>
		</div>
		<div class="song-menu-shade" @click.prevent="songMenu.close();" @contextmenu.prevent="songMenu.close();" :class="{ visible: songMenu.state.visible }" />
	</div>
</template>

<script setup lang="ts">

import type { StyleValue } from 'vue';
import { queue, songMenu } from '~/src/frontend/App';
import type { IPlaylist } from '~/src/frontend/Database';
import { LocalList } from '~/src/ui/LocalList';
import { PlaylistUI } from '~/src/ui/PlaylistUI';
import { type SongMenuPosition } from '~/src/ui/SongMenu';

let data = reactive<Data>({
	playlists: []
});

watch(() => songMenu.song, async () => {
	data.playlists = await PlaylistUI.list();
});

let displayPlaylistRemove = computed(() => songMenu.list && (songMenu.list instanceof PlaylistUI ? songMenu.list.id != 'liked' : true));

function playlistRemove() {
	if (!songMenu.list || !songMenu.song) return;
	if (songMenu.list instanceof PlaylistUI) {
		songMenu.song.playlistRemove(songMenu.list.id);
	} if (songMenu.list instanceof LocalList && songMenu.songIndex) {
		songMenu.list.removeIndex(songMenu.songIndex);
	} else {
		songMenu.list.remove(songMenu.song.video.id);
	}
	songMenu.close();
}

function style() {
	if (!songMenu.position) return "";
	let style: StyleValue = {};
	const positions: (keyof SongMenuPosition)[] = ['top', 'right', 'bottom', 'left'];
	for (const pos of positions) {
		style[pos] = `${songMenu.position[pos]}px`;
	}
	return style;
}

interface Data {
	playlists: IPlaylist[]
}

</script>