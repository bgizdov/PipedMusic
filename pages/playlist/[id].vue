<template>
	<PlaylistPage v-if="list" :list="list" />
</template>

<script setup lang="ts">

import { PlaylistUI } from "~/src/ui/PlaylistUI";

let id = useRoute().params.id as string;
let list = await PlaylistUI.get(id);

</script>