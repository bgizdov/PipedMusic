<template>
	<ClientOnly>
		<SongPage :id="id" />
	</ClientOnly>
</template>

<script setup lang="ts">

import { api } from '~/src/frontend/API';
import { genMeta } from '~/src/frontend/Meta';

let id = useRoute().params.id as string;
let song = await api.getRichVideo(id);
let { t } = useI18n();

if (song) {
	useHead(genMeta({
		title: `${song.title} · ${song.author}`,
		desc: t("page.song.meta.description", {title: song.title, author: song.author}),
		image: song.thumbnails.large
	}));
}

</script>