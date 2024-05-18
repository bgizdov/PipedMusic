<template>
	<button class="btn-loop" @click="queue.cycleLoop">
		<Icon v-if="queue.loop == 'none'" name="cil:loop" class="semiopacity" />
		<Icon v-if="queue.loop == 'playlist'" name="cil:loop" />
		<Icon v-if="queue.loop == 'one'" name="cil:loop-1" />
	</button>
</template>

<script lang="ts" setup>

import { queue } from '~/src/frontend/App';

</script>