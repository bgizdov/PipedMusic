<template>
	<section class="song-page">
		<div class="inner" v-if="song">

			<img :src="song.video.thumbnail">

			<div class="text-block">
				<h1>{{ song.video.title }}</h1>
				<p>{{ song.video.author }}</p>
			</div>

			<div class="btn-row">
				<button class="btn btn-flex" @click="song.play();">
					<Icon name="mdi:play-circle-outline" />
					<div>{{ $t("page.song.play") }}</div>
				</button>
				<button class="btn btn-flex" @click="song.playlistToggle('liked');">
					<template v-if="song.playlists.liked">
						<Icon name="mdi:heart-broken-outline" />
						<div>{{ $t("page.song.unlike") }}</div>
					</template>
					<template v-else>
						<Icon name="mdi:heart-outline" />
						<div>{{ $t("page.song.like") }}</div>
					</template>
				</button>
				<button class="btn btn-flex" @click="song.download();">
					<Icon name="material-symbols:download" />
					<div>{{ $t("page.song.download") }}</div>
				</button>
			</div>

		</div>
	</section>
</template>

<script setup lang="ts">

import { SharedSong } from "~/src/ui/SharedSong";

let id = useRoute().params.id as string;
let song = await SharedSong.get(id);

</script>