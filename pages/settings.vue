<template>
	<div>
		<section>
			<div class="inner text-center">

				<div class="text-block">
					<h1>{{ $t("page.settings.title") }}</h1>
					<p>{{ $t("page.settings.description") }}</p>
				</div>

			</div>
			<div class="inner">

				<div class="btn-row">
					<button class="btn btn-flex" @click="dataExport">
						<Icon name="mdi:export" />
						<div>{{ $t("page.settings.export_data") }}</div>
					</button>
					<button class="btn btn-flex" @click="dataImport">
						<Icon name="mdi:import" />
						<div>{{ $t("page.settings.import_data") }}</div>
					</button>
				</div>

			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>

import { db, type ExportedData } from "~/src/frontend/Database";
import { PlaylistUI } from "~/src/ui/PlaylistUI";
import { SharedSong } from "~/src/ui/SharedSong";

let { t } = useI18n();

async function dataExport() {
	const data = await db.dataExport();
	const href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
	let downloadLink = document.createElement("a");
	downloadLink.setAttribute("href", href);
	downloadLink.setAttribute("download", `pipedmusic-data.json`);
	downloadLink.click();
}

function dataImport() {
	let uploadInput = document.createElement("input");
	uploadInput.accept = "application/json";
	uploadInput.type = "file";
	uploadInput.addEventListener("change", processData);
	uploadInput.click();
}

async function processFile(file: File | null): Promise<ExportedData | null> {
	if (!file) return null;
	let fileContent = await file.text();
	try {
		let data: ExportedData = JSON.parse(fileContent);
		if (!data || !data.songs || !data.playlists) return null;
		return data;
	} catch(e) {
		return null;
	}
}

async function processData(e: Event) {
	let input = e.target as HTMLInputElement;
	let file = input.files ? input.files[0] : null;
	let data = await processFile(file);
	if (!data) {
		alert(t("page.settings.import_wrong_file"));
		return;
	}
	let really = confirm(t("page.settings.import_wrong_file"));
	if (!really) return;
	await resetApp();
	await db.dataImport(data);
	navigateTo("/");
}

async function resetApp() {
	PlaylistUI.clear();
	SharedSong.clear();
	await db.wipe();
}

</script>