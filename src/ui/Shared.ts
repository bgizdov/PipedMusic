export let shared = reactive<SharedData>({
	player_visible: false,
	player_opened: false
});

interface SharedData {
	player_visible: boolean,
	player_opened: boolean
}
