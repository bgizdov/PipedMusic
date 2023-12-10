<template>
	<div class="searchbar">
		<input type="text" v-model="app.global.search" @input="search" @focus="search" placeholder="Search..." list="suggestions">
		<Icon name="mdi:search" />
	</div>
</template>

<script lang="ts" setup>

import { app } from "~/src/app";

function search() {
	if (useRoute().path != '/search') {
		useRouter().push('/search');
	}
}

</script>