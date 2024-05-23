<template>
	<div class="searchbar">
		<input type="text" v-model="search.data.query" @input="showSearchPage" @focus="showSearchPage" :placeholder="$t('page.search.placeholder')" list="suggestions">
		<Icon name="mdi:search" />
	</div>
</template>

<script lang="ts" setup>

import { search } from '~/src/ui/Search';
import { shared } from '~/src/ui/Shared';

function showSearchPage() {
	if (useRoute().path != '/search') {
		useRouter().push('/search');
	}
	shared.player = false;
}

</script>