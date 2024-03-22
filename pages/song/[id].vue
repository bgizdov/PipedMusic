<template>
	<section class="song-page">
		<div class="inner" v-if="video">

			<img :src="video.thumbnail">

			<div class="text-block">
				<h1>{{ video.title }}</h1>
				<p>{{ video.author }}</p>
			</div>

			<div class="btn-row">
				<button class="btn btn-flex" @click="play(video.id);">
					<Icon name="mdi:play-circle-outline" />
					<div>Play</div>
				</button>
				<button class="btn btn-flex" @click="likeToggle(video.id);">
					<template v-if="data.liked">
						<Icon name="mdi:heart-broken-outline" />
						<div>Unlike</div>
					</template>
					<template v-else>
						<Icon name="mdi:heart-outline" />
						<div>Like</div>
					</template>
				</button>
				<button class="btn btn-flex" @click="download(video.id);">
					<Icon name="material-symbols:download" />
					<div>Download</div>
				</button>
			</div>

		</div>
	</section>
</template>

<script setup lang="ts">

import { download, likeToggle, play } from "~/src/frontend/actions";
import { app, likedSongs } from "~/src/frontend/app";
import type { ComboObject } from "~/src/types";

let { id }: ComboObject = useRoute().params;
let video = await app.data.getRichVideo(id);

let data = reactive({
	liked: false
});

onMounted(async () => {
	data.liked = await likedSongs.has(id)
});

</script>