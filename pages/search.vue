<template>
	<div class="searchpage">
		<section>
			<div class="inner text-center">

				<div class="text-block">
					<h1>{{ $t("page.search.title") }}</h1>
					<p v-if="data.query">{{ $t("page.search.searching_for") }} <b>{{ data.query }}</b></p>
					<p v-else>{{ $t("page.search.description") }}</p>
				</div>

				<SearchBar />

				<datalist id="suggestions" v-if="data.suggestions">
					<option v-for="s in data.suggestions" :value="s" />
				</datalist>

			</div>
			<div class="inner">

				<div class="song-list">
					<ClientOnly>
						<SongItemLoader :song="id" v-for="id in data.results" />
					</ClientOnly>
				</div>

			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>

import { genMeta } from "~/src/frontend/Meta";
import { search } from "~/src/ui/Search";

let { t } = useI18n();
let { data } = search;

useHead(genMeta({
	title: t("page.search.title")
}));

</script>