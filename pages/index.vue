<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>Piped Music</h1>
				<p>Liked songs</p>
			</div>
			
			<SongList :list="likedSongs" />

		</div>
		<div class="inner">

			<div class="text-block">
				<h3>Debug</h3>
			</div>

			<input type="text" v-model="data.id" />
			<button @click="app.play(data.id)">Load</button>

		</div>
	</section>
</template>

<script lang="ts" setup>

import { app, likedSongs } from "~/src/frontend/app";

let data = reactive({
	id: ""
});

</script>