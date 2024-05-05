<template>
	<nav>
		<div class="inner">
			<NuxtLink to="/" @click="shared.player = false;">
				<img class="logo" src="/logo.webp">
			</NuxtLink>
			<SearchBar />
			<div class="btn-row btn-row-right" @click="shared.player = false;">
				<NuxtLink to="/search" class="btn-search">
					<Icon name="mdi:search" />
				</NuxtLink>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">

import { shared } from "~/src/frontend/App";

</script>