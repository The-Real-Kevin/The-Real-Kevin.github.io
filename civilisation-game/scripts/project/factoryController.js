// factoryController.js - Updated with Factory6

const SCENE11_LAYOUT = "Scene11";
const FACTORY_SCENES = ["Factory1", "Factory2", "Factory3", "Factory4", "Factory5", "Factory6"]; // ADDED Factory6
const FACTORY_ENTRANCE_POS = { x: 248, y: 128 }; // Scene11
const FACTORY_EXIT_POS = { x: 160, y: 200 }; // Factory1

let inFactory = false;
let eKeyWasPressed = false;

export function isInFactory() {
	return inFactory;
}

export function initFactorySystem(runtime) {
	console.log("Factory system initialized");
	
	// Check current layout on init
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		
		if (FACTORY_SCENES.includes(layoutName)) {
			inFactory = true;
			console.log("Entered factory:", layoutName);
		} else {
			inFactory = false;
		}
	});
}

export function updateFactorySystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Update inFactory flag based on current layout
	if (FACTORY_SCENES.includes(currentLayout)) {
		if (!inFactory) {
			inFactory = true;
			console.log("In factory scene:", currentLayout);
		}
	} else {
		if (inFactory) {
			inFactory = false;
			console.log("Left factory");
		}
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check for factory entrance/exit
	if (currentLayout === SCENE11_LAYOUT) {
		checkFactoryEntrance(runtime, player, eKeyPressed);
	} else if (currentLayout === "Factory1") {
		checkFactoryExit(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkFactoryEntrance(runtime, player, eKeyPressed) {
	const factoryBox = runtime.objects.FactoryBox?.getFirstInstance();
	if (!factoryBox) return;
	
	// Check if player is touching the box
	const distance = Math.hypot(player.x - factoryBox.x, player.y - factoryBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Factory - Press E to enter");
	}
	
	// Enter factory
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		enterFactory(runtime);
	}
}

function checkFactoryExit(runtime, player, eKeyPressed) {
	const factoryBox = runtime.objects.FactoryBox?.getFirstInstance();
	if (!factoryBox) return;
	
	// Check if player is touching the exit box
	const distance = Math.hypot(player.x - factoryBox.x, player.y - factoryBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Exit - Press E to leave factory");
	}
	
	// Exit factory
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		exitFactory(runtime);
	}
}

function enterFactory(runtime) {
	console.log("=== ENTERING FACTORY ===");
	
	// Set spawn position for Factory1
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to Factory1
	runtime.goToLayout("Factory1");
}

function exitFactory(runtime) {
	console.log("=== EXITING FACTORY ===");
	
	// Set spawn position back to Scene11 (near entrance)
	globalThis.playerSpawnX = FACTORY_ENTRANCE_POS.x;
	globalThis.playerSpawnY = FACTORY_ENTRANCE_POS.y + 20; // Slightly below box
	
	// Return to Scene11
	runtime.goToLayout(SCENE11_LAYOUT);
}

export function handleFactoryTransitions(runtime, player) {
	const currentLayout = runtime.layout.name;
	const sceneIndex = FACTORY_SCENES.indexOf(currentLayout);
	
	// Only do transitions if we're in a factory scene
	if (sceneIndex === -1) return;
	
	// Moving LEFT - go to NEXT scene
	if (player.x < 0) {
		if (sceneIndex < FACTORY_SCENES.length - 1) {
			// Normal transition to next factory scene
			console.log("Going to next factory:", FACTORY_SCENES[sceneIndex + 1]);
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(FACTORY_SCENES[sceneIndex + 1]);
		} else {
			// At Factory6, loop back to Factory1
			console.log("Looping from Factory6 to Factory1");
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(FACTORY_SCENES[0]);
		}
	}
	
	// Moving RIGHT - go to previous scene
	if (player.x > 320) {
		if (sceneIndex > 0) {
			// Normal transition to previous factory scene
			console.log("Going to previous factory:", FACTORY_SCENES[sceneIndex - 1]);
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(FACTORY_SCENES[sceneIndex - 1]);
		} else {
			// At Factory1, loop back to Factory6
			console.log("Looping from Factory1 to Factory6");
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(FACTORY_SCENES[FACTORY_SCENES.length - 1]);
		}
	}
}