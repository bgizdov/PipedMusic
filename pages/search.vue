<template>
	<div class="searchpage">
		<section>
			<div class="inner text-center">

				<div class="text-block">
					<h1>{{ $t("page.search.title") }}</h1>
					<p v-if="shared.search">{{ $t("page.search.searching_for") }} <b>{{ shared.search }}</b></p>
					<p v-else>{{ $t("page.search.description") }}</p>
				</div>

				<SearchBar />

				<datalist id="suggestions" v-if="data.suggestions">
					<option v-for="s in data.suggestions" :value="s" />
				</datalist>

			</div>
			<div class="inner">

				<div class="song-list">
					<SongItemLoader :song="id" v-for="id in data.results" />
				</div>

			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>

import { api, shared } from "~/src/frontend/App";

let data = reactive<Data>({
	results: [],
	suggestions: []
});

let tout: NodeJS.Timeout | null = null;

async function search() {
	data.results = await api.getSearch(shared.search);
}

watch(() => shared.search, async () => {
	if (tout) clearTimeout(tout);
	tout = setTimeout(async () => {
		tout = null;
		await search();
	}, 250);
	data.results = [];
	data.suggestions = await api.getSearchSuggestions(shared.search);
});

onMounted(search);

interface Data {
	results: string[] | null,
	suggestions: string[] | null
}

</script>