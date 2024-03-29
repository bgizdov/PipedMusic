<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>Piped Music</h1>
				<p>Free & open-source music client</p>
			</div>

			<div class="playlists">
				<PlaylistItem :list="likedSongs" />
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">

import { likedSongs } from '~/src/frontend/app';

</script>