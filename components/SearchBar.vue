<template>
	<div class="searchbar">
		<input type="text" v-model="search.data.query" @input="showSearchPage" @focus="showSearchPage" :placeholder="$t('page.search.placeholder')" list="suggestions">
		<button @click="search.clear()" v-if="settings.prefs.search_clear_button && search.data.query">
			<Icon name="mdi:close" />
		</button>
		<button @click="search.search()">
			<Icon name="mdi:search" />
		</button>
	</div>
</template>

<script lang="ts" setup>

import { search } from '~/src/ui/Search';
import { shared } from '~/src/ui/Shared';
import { settings } from '~/src/ui/Settings';

function showSearchPage() {
	if (useRoute().path != '/search') {
		useRouter().push('/search');
	}
	shared.player_opened = false;
}

</script>