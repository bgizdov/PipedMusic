<template>
	<nav>
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

</script>