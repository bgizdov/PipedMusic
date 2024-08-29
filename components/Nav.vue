<template>
	<nav :class="{ floating: nav_floating }">
		<div class="inner">
			<NuxtLink to="/" @click="shared.player_opened = false;">
				<img class="logo" src="/logo.webp">
			</NuxtLink>
			<SearchBar />
			<div class="btn-row btn-row-right" @click="shared.player_opened = false;">
				<NuxtLink to="/settings">
					<Icon name="mdi:settings" />
				</NuxtLink>
				<NuxtLink to="/search" class="btn-search">
					<Icon name="mdi:search" />
				</NuxtLink>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">

import { shared } from "~/src/ui/Shared";

let nav_floating = ref(false);

function onScroll() {
	let st = document.querySelector("html")?.scrollTop;
	nav_floating.value = st != 0;
}

onMounted(() => {
	document.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
	document.removeEventListener("scroll", onScroll);
});

</script>