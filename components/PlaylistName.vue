<template>
	{{ playlistName }}
</template>

<script setup lang="ts">

import { computed } from 'vue';
import type { PlaylistUI } from '~/src/ui/PlaylistUI';

let { t } = useI18n();
let { list } = defineProps<Props>();

const playlistName = computed(() => {
	if (list && list.id == "liked") return t("playlist.liked_songs");
	return list ? list.meta.name : null;
});

interface Props {
	list: PlaylistUI
}

</script>
