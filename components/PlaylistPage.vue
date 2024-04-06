<template>
	<section class="playlist-page">
		<div class="inner">
			<div class="text-block" v-if="list.meta">
				<h1>{{ list.meta.name }}</h1>
				<p>{{ list.meta.size }} songs</p>
			</div>
			<SongList :list="list" />
		</div>
	</section>
</template>

<script setup lang="ts">

import { SavedList } from '~/src/lists/SavedList';

defineProps<Props>();

interface Props {
	list: SavedList
}

</script>