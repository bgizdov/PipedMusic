<template>
	<section>
		<div class="inner">

			<div class="text-block">
				<h1>{{ $t("page.home.title") }}</h1>
				<p>{{ $t("page.home.description") }}</p>
			</div>

			<ClientOnly>
				<PlaylistList />
			</ClientOnly>

		</div>
	</section>
</template>

<script setup lang="ts">

import { genMeta } from "~/src/frontend/Meta";

useHead(genMeta({
	use_title_suffix: false
}));

let { t } = useI18n();

</script>