<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>Piped Music</h1>
				<p>Not done yet...</p>
			</div>

			<SongList :ids="arr" />

		</div>
		<div class="inner">

			<div class="text-block">
				<h3>Debug</h3>
			</div>

			<input type="text" v-model="data.id" />
			<button @click="app.play(data.id)">Load</button>

			<br>
			<br>

			<button @click="clearCache()">Clear cache</button>

		</div>
	</section>
</template>

<script lang="ts" setup>

import { app } from "~/src/frontend/app";

let arr = [
	"l1PWp-Helvs",
	"dp28pv_UvK8",
	"d40rzwlq8l4",
	"HhZTYsojXdA",
	"Z5NNPqJZy6g",
	"bp-svDWn5HU",
	"xyNZ4M2mI8s",
	"22U-GYVYZJE",
	"71c3DkVsH3c"
];

function randomId() {
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

function clearCache() {
	localStorage.clear();
}

let data = reactive({
	id: randomId()
});

</script>