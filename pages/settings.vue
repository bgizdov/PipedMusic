<template>
	<div>
		<section>
			<div class="inner text-center">

				<div class="text-block">
					<h1>Settings</h1>
					<p>Configure your Piped Music client</p>
				</div>

			</div>
			<div class="inner">
				
				<div class="btn-row">
					<button class="btn btn-flex" @click="dataExport">
						<Icon name="mdi:export" />
						<div>Export data</div>
					</button>
					<button class="btn btn-flex" @click="dataImport">
						<Icon name="mdi:import" />
						<div>Import data</div>
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
		alert("This file is not valid Piped Music backup!");
		return;
	}
	let really = confirm(`You are going to replace ALL YOUR DATA with backup you uploaded! Are you sure?`);
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