<template>
	<div>

		<Nav />

		<ClientOnly>
			<SongMenu />
			<Player />
		</ClientOnly>

		<div class="content">
			<NuxtPage />
		</div>


	</div>
</template>
