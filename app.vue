<template>
	<div>

		<Nav />

		<SongMenu />

		<div class="content">

			<NuxtPage />

		</div>

		<Player />

	</div>
</template>

<script lang="ts" setup>

useHead({
	title: "Piped Music"
});

</script>