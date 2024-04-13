<template>
	<button class="btn-prev" @click="queue.previous();">
		<Icon name="mdi:skip-previous" />
	</button>
</template>

<script setup lang="ts">

import { queue } from '~/src/frontend/App';

</script>