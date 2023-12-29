<template>
	<div>

		<nav>
			<div class="inner">
				<NuxtLink to="/" @click="app.global.player = false;">
					<img class="logo" src="/logo.webp">
				</NuxtLink>
				<SearchBar />
				<div class="btn-row btn-row-right" @click="app.global.player = false;">
					<NuxtLink to="/search" class="btn-search">
						<Icon name="mdi:search" />
					</NuxtLink>
				</div>
			</div>
		</nav>

		<div class="content">

			<NuxtPage />

		</div>

		<Player />

	</div>
</template>

<script lang="ts" setup>

import { app } from "~/src/frontend/app";

</script>