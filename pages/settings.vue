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
				<div class="prefs">

					<label class="row">
						<div>{{ $t("page.settings.language") }}</div>
						<select v-model="language">
							<option :value="l.code" v-for="l in locales">{{ l.name }}</option>
						</select>
					</label>

					<label class="row">
						<div>{{ $t("page.settings.backend_url") }}</div>
						<input v-model="settings.prefs.backend_url" @change="api.setBackendUrl(settings.prefs.backend_url)" type="url">
					</label>

					<label class="row">
						<div>{{ $t("page.settings.search_clear_button") }}</div>
						<input type="checkbox" v-model="settings.prefs.search_clear_button" />
					</label>

					<label class="row">
						<div>{{ $t("page.settings.save_queue") }}</div>
						<input type="checkbox" v-model="settings.prefs.save_queue" />
					</label>

				</div>

			</div>
			<div class="inner">

				<h4>{{ $t("page.settings.data.title") }}</h4>

				<div class="btn-row">
					<button class="btn btn-flex" @click="dataExport">
						<Icon name="mdi:export" />
						<div>{{ $t("page.settings.data.export") }}</div>
					</button>
					<button class="btn btn-flex" @click="dataImport">
						<Icon name="mdi:import" />
						<div>{{ $t("page.settings.data.import") }}</div>
					</button>
				</div>

				<!-- Import from URL -->
				<div class="row" style="margin-top: 20px;">
					<input
						v-model="importUrl"
						type="url"
						placeholder="Paste data URL here"
						style="width: 60%; max-width: 400px; margin-right: 10px;"
					/>
					<button class="btn btn-flex" @click="dataImportFromUrl">
						<Icon name="mdi:download" />
						<div>Import from URL</div>
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
import { locales } from "~/src/frontend/Locales";
import { genMeta } from "~/src/frontend/Meta";
import { settings } from "~/src/ui/Settings";
import { api } from "~/src/frontend/API";

let { t, setLocale, locale } = useI18n();

useHead(genMeta({
	title: t("page.settings.title")
}));

let language = ref(locale.value);
watch(language, async l => await setLocale(l));

watch(settings.prefs, () => {
	settings.save();
}, {deep: true});

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
		alert(t("page.settings.data.import_wrong_file"));
		return;
	}
	let really = confirm(t("page.settings.data.import_warning"));
	if (!really) return;
	await resetApp();
	await db.dataImport(data);
	navigateTo("/");
}

let importUrl = ref("");

// Helper to try multiple CORS proxies in order
async function fetchWithCorsFallback(url: string): Promise<Response> {
	const proxies = [
		(proxyUrl: string) => `https://corsproxy.io/?${encodeURIComponent(proxyUrl)}`,
		(proxyUrl: string) => `https://cors-anywhere.herokuapp.com/${proxyUrl}`,
		(proxyUrl: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(proxyUrl)}`
	];
	let lastError: any = null;
	for (const proxy of proxies) {
		try {
			const resp = await fetch(proxy(url));
			if (resp.ok) return resp;
			lastError = new Error(`Proxy failed: ${proxy(url)}`);
		} catch (e) {
			lastError = e;
		}
	}
	throw lastError || new Error("All CORS proxies failed");
}

async function dataImportFromUrl() {
	if (!importUrl.value) {
		alert("Please enter a URL.");
		return;
	}
	try {
		let resp: Response;
		try {
			resp = await fetchWithCorsFallback(importUrl.value);
		} catch (e) {
			alert("Failed to fetch data from all CORS proxies.");
			return;
		}
		const data = await resp.json();
		if (!data || !data.songs || !data.playlists) {
			alert("Invalid data format.");
			return;
		}
		let really = confirm(t("page.settings.data.import_warning"));
		if (!really) return;
		await resetApp();
		await db.dataImport(data);
		navigateTo("/");
	} catch (e) {
		alert("Failed to import data from URL.");
	}
}

async function resetApp() {
	PlaylistUI.clear();
	SharedSong.clear();
	await db.wipe();
}

</script>
