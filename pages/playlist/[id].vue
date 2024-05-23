<template>
	<PlaylistPage v-if="list" :list="list" />
</template>

<script setup lang="ts">

import { genMeta } from "~/src/frontend/Meta";
import { PlaylistUI } from "~/src/ui/PlaylistUI";

let id = useRoute().params.id as string;
let list = await PlaylistUI.get(id);

let { t } = useI18n();

if (list) {
	useHead(genMeta({
		title: list.id == "liked" ? t("playlist.liked_songs") : list.meta.name
	}));
}

</script>