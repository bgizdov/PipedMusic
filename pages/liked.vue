<template>
	<PlaylistPage :list="list" />
</template>

<script setup lang="ts">

import { SavedList } from "~/src/lists/SavedList";

let list = SavedList.getLiked();

</script>