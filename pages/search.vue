<template>
	<div class="searchpage">
		<section>
			<div class="inner text-center">

				<div class="text-block">
					<h1>Search</h1>
					<p v-if="shared.search">Searching for: <b>{{ shared.search }}</b></p>
					<p v-else>Type what you want to search!</p>
				</div>

				<SearchBar />

				<datalist id="suggestions" v-if="data.suggestions">
					<option v-for="s in data.suggestions" :value="s" />
				</datalist>

			</div>
			<div class="inner">
				
				<div class="song-list">
					<SongItem :id="id" v-for="id in data.results" />
				</div>

			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>

import { app, shared } from "~/src/frontend/app";

let data = reactive<Data>({
	results: [],
	suggestions: []
});

let tout: NodeJS.Timeout | null = null;

async function search() {
	data.results = await app.data.getSearch(shared.search);
}

watch(() => shared.search, async () => {
	if (tout) clearTimeout(tout);
	tout = setTimeout(async () => {
		tout = null;
		await search();
	}, 250);
	data.results = [];
	console.log(shared.search);
	data.suggestions = await app.data.getSearchSuggestions(shared.search);
});

onMounted(search);

interface Data {
	results: string[] | null,
	suggestions: string[] | null
}

</script>