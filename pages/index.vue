<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>Piped Music</h1>
				<p>Liked songs</p>
			</div>
			
			<SongList :list="likedSongs" />

		</div>
	</section>
</template>

<script lang="ts" setup>

import { likedSongs } from "~/src/frontend/app";

</script>