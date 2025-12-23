// iceCityController.js - Handles IceCity state persistence in Scene6

export function initIceCitySystem(runtime) {
	console.log("IceCity persistence system initialized");
	
	// Initialize global state if needed
	if (globalThis.iceCityRevealed === undefined) {
		globalThis.iceCityRevealed = false;
	}
}

export function updateIceCitySystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Scene6
	if (currentLayout !== "Scene6") return;
	
	// Restore state every frame to ensure it persists
	if (globalThis.iceCityRevealed) {
		const iceCity = runtime.objects.IceCity?.getFirstInstance();
		if (iceCity && !iceCity.isVisible) {
			iceCity.isVisible = true;
			console.log("IceCity state restored - visible");
		}
		
		// Hide drop zone if mission completed
		const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
		if (dropZone && dropZone.isVisible) {
			dropZone.isVisible = false;
		}
	}
}