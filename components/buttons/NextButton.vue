<template>
	<button class="btn-next" @click="player.next();">
		<Icon name="mdi:skip-next" />
	</button>
</template>

<script setup lang="ts">

import { player } from '~/src/frontend/App';

</script>