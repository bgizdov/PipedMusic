<template>
	<div class="searchbar">
		<input type="text" v-model="shared.search" @input="search" @focus="search" :placeholder="$t('page.search.placeholder')" list="suggestions">
		<Icon name="mdi:search" />
	</div>
</template>

<script lang="ts" setup>

import { shared } from '~/src/ui/Shared';

function search() {
	if (useRoute().path != '/search') {
		useRouter().push('/search');
	}
	shared.player = false;
}

</script>