<template>
	<div class="searchbar">
		<input type="text" v-model="shared.search" @input="search" @focus="search" placeholder="Search..." list="suggestions">
		<Icon name="mdi:search" />
	</div>
</template>

<script lang="ts" setup>

import { shared } from "~/src/frontend/App";

function search() {
	if (useRoute().path != '/search') {
		useRouter().push('/search');
	}
	shared.player = false;
}

</script>