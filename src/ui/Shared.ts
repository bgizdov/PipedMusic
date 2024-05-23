export let shared = reactive<SharedData>({
	player: false
});

interface SharedData {
	player: boolean
}
