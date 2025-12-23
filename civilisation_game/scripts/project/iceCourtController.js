// iceCourtController.js - Handles IceCourt state persistence

export function initIceCourtSystem(runtime) {
	console.log("IceCourt persistence system initialized");
	
	// Initialize global state if needed
	if (globalThis.iceCourtRevealed === undefined) {
		globalThis.iceCourtRevealed = false;
	}
	
	// Listen for layout changes to restore state
	runtime.addEventListener("beforelayoutstart", () => {
		if (runtime.layout?.name === "Court1") {
			setTimeout(() => {
				restoreIceCourtState(runtime);
			}, 50);
		}
	});
}

export function updateIceCourtSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Court1
	if (currentLayout !== "Court1") return;
	
	// Restore state every frame to ensure it persists
	if (globalThis.iceCourtRevealed) {
		const iceCourt = runtime.objects.IceCourt?.getFirstInstance();
		if (iceCourt && !iceCourt.isVisible) {
			iceCourt.isVisible = true;
		}
	}
}

function restoreIceCourtState(runtime) {
	if (globalThis.iceCourtRevealed) {
		const iceCourt = runtime.objects.IceCourt?.getFirstInstance();
		if (iceCourt) {
			iceCourt.isVisible = true;
			console.log("IceCourt state restored - visible");
		}
		
		// Hide drop zone if mission completed
		const dropZone = runtime.objects.DropZoneMarker?.getFirstInstance();
		if (dropZone) {
			dropZone.isVisible = false;
		}
	}
}