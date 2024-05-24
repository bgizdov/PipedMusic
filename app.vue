<template>
	<div>

		<Nav />

		<ClientOnly>
			<SongMenu />
			<Player />
		</ClientOnly>

		<div class="content" :class="{ 'visible-player': shared.player_visible }">
			<NuxtPage />
			<Footer />
		</div>

	</div>
</template>

<script setup lang="ts">

import { shared } from './src/ui/Shared';

</script>
