<template>
	<PlaylistPage v-if="list" :list="list" />
</template>

<script setup lang="ts">

import { SavedList } from "~/src/lists/SavedList";

let id = useRoute().params.id as string;
let list = await SavedList.get(id);

</script>