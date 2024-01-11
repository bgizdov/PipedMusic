<template>
	<button class="btn-next" @click="queue.next();">
		<Icon name="mdi:skip-next" />
	</button>
</template>

<script setup lang="ts">

import { queue } from '~/src/frontend/app';

</script>