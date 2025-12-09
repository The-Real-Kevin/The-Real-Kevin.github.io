// planeController.js - Fixed exit condition to check x >= 128

const PLANE_SPEED = 9;
let playerInPlane = false;
let currentPlane = null;
let wasEKeyDown = false;

// Track which scene the plane is currently in
let planeScene = "Scene14"; // Plane starts in Scene14
let planeX = 160;
let planeY = 192;

export function initPlaneSystem(runtime) {
	console.log("Plane system initialized");
	playerInPlane = false;
	currentPlane = null;
	wasEKeyDown = false;
	
	// Initialize plane position and scene
	runtime.addEventListener("beforelayoutstart", () => {
		setTimeout(() => {
			const mayorPlane = runtime.objects.MayorPlane?.getFirstInstance();
			
			if (mayorPlane) {
				// Restore plane's saved position
				mayorPlane.x = planeX;
				mayorPlane.y = planeY;
				mayorPlane.animationFrame = 0; // Default facing right
				
				// Update visibility based on current scene
				updatePlaneVisibilityImmediate(runtime);
				
				console.log("Plane initialized at", Math.round(planeX), Math.round(planeY), "in", planeScene);
			}
		}, 50);
	});
}

export function isPlayerInPlane() {
	return playerInPlane;
}

export function getCurrentPlane() {
	return currentPlane;
}

function updatePlaneVisibilityImmediate(runtime) {
	const currentLayout = runtime.layout.name;
	const mayorPlane = runtime.objects.MayorPlane?.getFirstInstance();
	
	if (!mayorPlane) return;
	
	const shouldBeVisible = (planeScene === currentLayout);
	mayorPlane.isVisible = shouldBeVisible;
	
	console.log("Plane visibility in", currentLayout, ":", shouldBeVisible, "(tracked scene:", planeScene + ")");
}

export function updatePlaneSystem(runtime, player, keyboard) {
	const eKeyDown = keyboard.isKeyDown("KeyE");
	
	// Manage plane visibility based on tracked scene
	managePlaneVisibility(runtime);
	
	// Detect E key press (not held)
	if (eKeyDown && !wasEKeyDown) {
		if (!playerInPlane) {
			// Try to enter the plane (only in Scene13 or Scene14)
			tryEnterPlane(runtime, player);
		} else {
			// Exit the plane (only if x >= 128 and in Scene13/Scene14)
			tryExitPlane(runtime, player);
		}
	}
	
	wasEKeyDown = eKeyDown;
	
	// Handle plane movement if player is in plane
	if (playerInPlane && currentPlane) {
		handlePlaneMovement(runtime, player, currentPlane, keyboard);
	}
}

function managePlaneVisibility(runtime) {
	const currentLayout = runtime.layout.name;
	const mayorPlane = runtime.objects.MayorPlane?.getFirstInstance();
	
	if (!mayorPlane) return;
	
	// Plane is only visible if it's in the current scene
	const shouldBeVisible = (planeScene === currentLayout);
	mayorPlane.isVisible = shouldBeVisible;
}

function tryEnterPlane(runtime, player) {
	const currentLayout = runtime.layout.name;
	
	// Only allow boarding in Scene13 or Scene14
	if (currentLayout !== "Scene13" && currentLayout !== "Scene14") {
		console.log("Cannot board plane - must be in Scene13 or Scene14");
		return;
	}
	
	const mayorPlane = runtime.objects.MayorPlane?.getFirstInstance();
	
	if (!mayorPlane) {
		console.log("No plane found");
		return;
	}
	
	// Only check plane if it's in the current scene
	if (planeScene !== currentLayout) {
		console.log("Plane not in current scene");
		return;
	}
	
	const distance = Math.hypot(player.x - mayorPlane.x, player.y - mayorPlane.y);
	console.log("Distance to plane:", Math.round(distance));
	
	// If player is close enough to the plane (within 40 pixels)
	if (distance < 40) {
		enterPlane(runtime, player, mayorPlane);
		console.log("Player entered plane in", currentLayout);
	} else {
		console.log("Too far from plane");
	}
}

function enterPlane(runtime, player, plane) {
	playerInPlane = true;
	currentPlane = plane;
	
	// Hide the player sprite
	player.isVisible = false;
	
	// Position player at plane location
	player.x = plane.x;
	player.y = plane.y;
	
	console.log("✓ Player now in plane at", Math.round(plane.x), Math.round(plane.y));
}

function tryExitPlane(runtime, player) {
	if (!currentPlane) return;
	
	const currentLayout = runtime.layout.name;
	
	// Only allow exiting in Scene13 or Scene14
	if (currentLayout !== "Scene13" && currentLayout !== "Scene14") {
		console.log("Cannot exit plane - must land in Scene13 or Scene14 first");
		return;
	}
	
	// FIXED: Check if BOTH plane AND player x position >= 128 (landed safely on the ground)
	if (currentPlane.y < 128 || player.y < 128) {
		console.log("Cannot exit plane - must land on ground (x >= 128). Plane x:", Math.round(currentPlane.x), "Player x:", Math.round(player.x));
		return;
	}
	
	exitPlane(runtime, player);
}

function exitPlane(runtime, player) {
	const currentLayout = runtime.layout.name;
	console.log("Player exiting plane in", currentLayout);
	
	playerInPlane = false;
	
	// Show the player sprite again
	player.isVisible = true;
	
	// Position player slightly offset from plane
	player.x = currentPlane.x;
	player.y = currentPlane.y + 10;
	
	// Save plane's position
	planeX = currentPlane.x;
	planeY = currentPlane.y;
	
	// Update the plane's scene to current scene
	planeScene = currentLayout;
	console.log("✓ Plane left in scene:", currentLayout, "at", Math.round(planeX), Math.round(planeY));
	
	currentPlane = null;
}

function handlePlaneMovement(runtime, player, plane, keyboard) {
	let moved = false;
	
	// Movement controls - NO BOUNDS, plane can fly anywhere!
	if (keyboard.isKeyDown("ArrowDown")) {
		plane.y += PLANE_SPEED;
		player.y = plane.y;
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowLeft")) {
		plane.x -= PLANE_SPEED;
		player.x = plane.x;
		plane.animationFrame = 1; // Left frame
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowUp")) {
		plane.y -= PLANE_SPEED;
		player.y = plane.y;
		moved = true;
	}
	if (keyboard.isKeyDown("ArrowRight")) {
		plane.x += PLANE_SPEED;
		player.x = plane.x;
		plane.animationFrame = 0; // Right frame
		moved = true;
	}
	
	// Save plane position continuously
	planeX = plane.x;
	planeY = plane.y;
}

// Update the plane's tracked scene BEFORE transitioning
export function updatePlaneSceneBeforeTransition(newScene) {
	if (currentPlane) {
		console.log("✈️ Moving plane from", planeScene, "to", newScene);
		planeScene = newScene;
		planeX = currentPlane.x;
		planeY = currentPlane.y;
	}
}

// Get debug info about plane
export function debugPlaneInfo(runtime) {
	const mayorPlane = runtime.objects.MayorPlane?.getFirstInstance();
	console.log("=== PLANE DEBUG INFO ===");
	console.log("Current scene:", runtime.layout.name);
	console.log("Player in plane:", playerInPlane);
	
	if (mayorPlane) {
		console.log("Plane:", {
			position: `(${Math.round(mayorPlane.x)}, ${Math.round(mayorPlane.y)})`,
			scene: planeScene,
			visible: mayorPlane.isVisible,
			isCurrentPlane: mayorPlane === currentPlane,
			canExit: mayorPlane.x >= 128
		});
	} else {
		console.log("No plane found");
	}
	console.log("===================");
}