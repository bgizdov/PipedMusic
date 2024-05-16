<template>
	<button class="btn-prev" @click="player.previous();">
		<Icon name="mdi:skip-previous" />
	</button>
</template>

<script setup lang="ts">

import { player } from '~/src/frontend/App';

</script>