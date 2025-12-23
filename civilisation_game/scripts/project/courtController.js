// courtController.js - Handles court entrance/exit and scene transitions (now with Court6 and Court7)

const SCENE4_LAYOUT = "Scene4";
const COURT_SCENES = ["Court1", "Court2", "Court3", "Court4", "Court5", "Court6", "Court7"]; // ADDED Court6 and Court7
const COURT_ENTRANCE_POS = { x: 160, y: 128 }; // Scene4
const COURT_EXIT_POS = { x: 160, y: 230 }; // Court1

let inCourt = false;
let eKeyWasPressed = false;

export function isInCourt() {
	return inCourt;
}

export function initCourtSystem(runtime) {
	console.log("Court system initialized");
	
	// Check current layout on init
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		
		if (COURT_SCENES.includes(layoutName)) {
			inCourt = true;
			console.log("Entered court:", layoutName);
		} else {
			inCourt = false;
		}
	});
}

export function updateCourtSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Update inCourt flag based on current layout
	if (COURT_SCENES.includes(currentLayout)) {
		if (!inCourt) {
			inCourt = true;
			console.log("In court scene:", currentLayout);
		}
	} else {
		if (inCourt) {
			inCourt = false;
			console.log("Left court");
		}
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check for court entrance/exit
	if (currentLayout === SCENE4_LAYOUT) {
		checkCourtEntrance(runtime, player, eKeyPressed);
	} else if (currentLayout === "Court1") {
		checkCourtExit(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkCourtEntrance(runtime, player, eKeyPressed) {
	const courtBox = runtime.objects.CourtBox?.getFirstInstance();
	if (!courtBox) return;
	
	// Check if player is touching the box
	const distance = Math.hypot(player.x - courtBox.x, player.y - courtBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Court - Press E to enter");
	}
	
	// Enter court
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		enterCourt(runtime);
	}
}

function checkCourtExit(runtime, player, eKeyPressed) {
	const courtBox = runtime.objects.CourtBox?.getFirstInstance();
	if (!courtBox) return;
	
	// Check if player is touching the exit box
	const distance = Math.hypot(player.x - courtBox.x, player.y - courtBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Exit - Press E to leave court");
	}
	
	// Exit court
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		exitCourt(runtime);
	}
}

function enterCourt(runtime) {
	console.log("=== ENTERING COURT ===");
	
	// Set spawn position for Court1
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 230;
	
	// Go to Court1
	runtime.goToLayout("Court1");
}

function exitCourt(runtime) {
	console.log("=== EXITING COURT ===");
	
	// Set spawn position back to Scene4 (near entrance)
	globalThis.playerSpawnX = COURT_ENTRANCE_POS.x;
	globalThis.playerSpawnY = COURT_ENTRANCE_POS.y + 20; // Slightly below box
	
	// Return to Scene4
	runtime.goToLayout(SCENE4_LAYOUT);
}

export function handleCourtTransitions(runtime, player) {
	const currentLayout = runtime.layout.name;
	const sceneIndex = COURT_SCENES.indexOf(currentLayout);
	
	// Only do transitions if we're in a court scene
	if (sceneIndex === -1) return;
	
	// Moving LEFT - go to NEXT scene
	if (player.x < 0) {
		if (sceneIndex < COURT_SCENES.length - 1) {
			// Normal transition to next court scene
			console.log("Going to next court:", COURT_SCENES[sceneIndex + 1]);
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(COURT_SCENES[sceneIndex + 1]);
		} else {
			// At Court7, loop back to Court1
			console.log("Looping from Court7 to Court1");
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(COURT_SCENES[0]);
		}
	}
	
	// Moving RIGHT - go to previous scene
	if (player.x > 320) {
		if (sceneIndex > 0) {
			// Normal transition to previous court scene
			console.log("Going to previous court:", COURT_SCENES[sceneIndex - 1]);
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(COURT_SCENES[sceneIndex - 1]);
		} else {
			// At Court1, loop back to Court7
			console.log("Looping from Court1 to Court7");
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(COURT_SCENES[COURT_SCENES.length - 1]);
		}
	}
}