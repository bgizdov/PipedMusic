<template>
	<button class="btn-loop" @click="queue.cycleLoop">
		<Icon :class="{hidden: queue.loop != 'none'}" name="cil:loop" class="semiopacity" />
		<Icon :class="{hidden: queue.loop != 'playlist'}" name="cil:loop" />
		<Icon :class="{hidden: queue.loop != 'one'}" name="cil:loop-1" />
	</button>
</template>

<script lang="ts" setup>

import { queue } from '~/src/frontend/App';

</script>