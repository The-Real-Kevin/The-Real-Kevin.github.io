// labController.js - Updated with Lab6

const SCENE12_LAYOUT = "Scene12";
const LAB_SCENES = ["Lab1", "Lab2", "Lab3", "Lab4", "Lab5", "Lab6"]; // ADDED Lab6
const LAB_ENTRANCE_POS = { x: 195, y: 128 }; // Scene12
const LAB_EXIT_POS = { x: 160, y: 200 }; // Lab1

let inLab = false;
let eKeyWasPressed = false;

export function isInLab() {
	return inLab;
}

export function initLabSystem(runtime) {
	console.log("Lab system initialized");
	
	// Check current layout on init
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		
		if (LAB_SCENES.includes(layoutName)) {
			inLab = true;
			console.log("Entered lab:", layoutName);
		} else {
			inLab = false;
		}
	});
}

export function updateLabSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Update inLab flag based on current layout
	if (LAB_SCENES.includes(currentLayout)) {
		if (!inLab) {
			inLab = true;
			console.log("In lab scene:", currentLayout);
		}
	} else {
		if (inLab) {
			inLab = false;
			console.log("Left lab");
		}
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check for lab entrance/exit
	if (currentLayout === SCENE12_LAYOUT) {
		checkLabEntrance(runtime, player, eKeyPressed);
	} else if (currentLayout === "Lab1") {
		checkLabExit(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkLabEntrance(runtime, player, eKeyPressed) {
	const labBox = runtime.objects.LabBox?.getFirstInstance();
	if (!labBox) return;
	
	// Check if player is touching the box
	const distance = Math.hypot(player.x - labBox.x, player.y - labBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Lab - Press E to enter");
	}
	
	// Enter lab
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		enterLab(runtime);
	}
}

function checkLabExit(runtime, player, eKeyPressed) {
	const labBox = runtime.objects.LabBox?.getFirstInstance();
	if (!labBox) return;
	
	// Check if player is touching the exit box
	const distance = Math.hypot(player.x - labBox.x, player.y - labBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Exit - Press E to leave lab");
	}
	
	// Exit lab
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		exitLab(runtime);
	}
}

function enterLab(runtime) {
	console.log("=== ENTERING LAB ===");
	
	// Set spawn position for Lab1
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to Lab1
	runtime.goToLayout("Lab1");
}

function exitLab(runtime) {
	console.log("=== EXITING LAB ===");
	
	// Set spawn position back to Scene12 (near entrance)
	globalThis.playerSpawnX = LAB_ENTRANCE_POS.x;
	globalThis.playerSpawnY = LAB_ENTRANCE_POS.y + 20; // Slightly below box
	
	// Return to Scene12
	runtime.goToLayout(SCENE12_LAYOUT);
}

export function handleLabTransitions(runtime, player) {
	const currentLayout = runtime.layout.name;
	const sceneIndex = LAB_SCENES.indexOf(currentLayout);
	
	// Only do transitions if we're in a lab scene
	if (sceneIndex === -1) return;
	
	// Moving LEFT - go to NEXT scene
	if (player.x < 0) {
		if (sceneIndex < LAB_SCENES.length - 1) {
			// Normal transition to next lab scene
			console.log("Going to next lab:", LAB_SCENES[sceneIndex + 1]);
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(LAB_SCENES[sceneIndex + 1]);
		} else {
			// At Lab6, loop back to Lab1
			console.log("Looping from Lab6 to Lab1");
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(LAB_SCENES[0]);
		}
	}
	
	// Moving RIGHT - go to previous scene
	if (player.x > 320) {
		if (sceneIndex > 0) {
			// Normal transition to previous lab scene
			console.log("Going to previous lab:", LAB_SCENES[sceneIndex - 1]);
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(LAB_SCENES[sceneIndex - 1]);
		} else {
			// At Lab1, loop back to Lab6
			console.log("Looping from Lab1 to Lab6");
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(LAB_SCENES[LAB_SCENES.length - 1]);
		}
	}
}