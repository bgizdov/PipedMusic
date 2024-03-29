<template>
	<PlaylistPage :list="list" />
</template>

<script setup lang="ts">

import { DBList } from "~/src/frontend/list";

let list = DBList.getLiked();

</script>