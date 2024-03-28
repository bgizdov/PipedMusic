<template>
	<div>

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

		<SongMenu />

		<div class="content">

			<NuxtPage />

		</div>

		<Player />

	</div>
</template>

<script lang="ts" setup>

import { shared, songMenu } from "~/src/frontend/app";

useHead({
	title: "Piped Music"
});

</script>