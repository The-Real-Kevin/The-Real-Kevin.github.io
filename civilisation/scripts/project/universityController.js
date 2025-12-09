// universityController.js - Handles university entrance/exit and scene transitions

const SCENE5_LAYOUT = "Scene5";
const UNIVERSITY_SCENES = [
	"University1", "University2", "University3", "University4", "University5", 
	"University6", "University7", "University8", "University9", "University10", "University11"
];
const UNIVERSITY_ENTRANCE_POS = { x: 150, y: 126 }; // Scene5
const UNIVERSITY_EXIT_POS = { x: 160, y: 200 }; // University1

let inUniversity = false;
let eKeyWasPressed = false;

export function isInUniversity() {
	return inUniversity;
}

export function initUniversitySystem(runtime) {
	console.log("University system initialized");
	
	// Check current layout on init
	runtime.addEventListener("beforelayoutstart", () => {
		const layoutName = runtime.layout.name;
		
		if (UNIVERSITY_SCENES.includes(layoutName)) {
			inUniversity = true;
			console.log("Entered university:", layoutName);
		} else {
			inUniversity = false;
		}
	});
}

export function updateUniversitySystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Update inUniversity flag based on current layout
	if (UNIVERSITY_SCENES.includes(currentLayout)) {
		if (!inUniversity) {
			inUniversity = true;
			console.log("In university scene:", currentLayout);
		}
	} else {
		if (inUniversity) {
			inUniversity = false;
			console.log("Left university");
		}
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check for university entrance/exit
	if (currentLayout === SCENE5_LAYOUT) {
		checkUniversityEntrance(runtime, player, eKeyPressed);
	} else if (currentLayout === "University1") {
		checkUniversityExit(runtime, player, eKeyPressed);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkUniversityEntrance(runtime, player, eKeyPressed) {
	const universityBox = runtime.objects.UniversityBox?.getFirstInstance();
	if (!universityBox) return;
	
	// Check if player is touching the box
	const distance = Math.hypot(player.x - universityBox.x, player.y - universityBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near University - Press E to enter");
	}
	
	// Enter university
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		enterUniversity(runtime);
	}
}

function checkUniversityExit(runtime, player, eKeyPressed) {
	const universityBox = runtime.objects.UniversityBox?.getFirstInstance();
	if (!universityBox) return;
	
	// Check if player is touching the exit box
	const distance = Math.hypot(player.x - universityBox.x, player.y - universityBox.y);
	
	// Show hint when near
	if (distance < 30 && runtime.tickCount % 60 === 0) {
		console.log("Near Exit - Press E to leave university");
	}
	
	// Exit university
	if (distance < 25 && eKeyPressed && !eKeyWasPressed) {
		exitUniversity(runtime);
	}
}

function enterUniversity(runtime) {
	console.log("=== ENTERING UNIVERSITY ===");
	
	// Set spawn position for University1
	globalThis.playerSpawnX = 160;
	globalThis.playerSpawnY = 200;
	
	// Go to University1
	runtime.goToLayout("University1");
}

function exitUniversity(runtime) {
	console.log("=== EXITING UNIVERSITY ===");
	
	// Set spawn position back to Scene5 (near entrance)
	globalThis.playerSpawnX = UNIVERSITY_ENTRANCE_POS.x;
	globalThis.playerSpawnY = UNIVERSITY_ENTRANCE_POS.y + 20; // Slightly below box
	
	// Return to Scene5
	runtime.goToLayout(SCENE5_LAYOUT);
}

export function handleUniversityTransitions(runtime, player) {
	const currentLayout = runtime.layout.name;
	const sceneIndex = UNIVERSITY_SCENES.indexOf(currentLayout);
	
	// Only do transitions if we're in a university scene
	if (sceneIndex === -1) return;
	
	// Moving LEFT - go to NEXT scene (reversed from main scenes!)
	if (player.x < 0) {
		if (sceneIndex < UNIVERSITY_SCENES.length - 1) {
			// Normal transition to next university scene
			console.log("Going to next university:", UNIVERSITY_SCENES[sceneIndex + 1]);
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(UNIVERSITY_SCENES[sceneIndex + 1]);
		} else {
			// At University11, loop back to University1
			console.log("Looping from University11 to University1");
			player.x = 300;
			globalThis.playerSpawnX = 300;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(UNIVERSITY_SCENES[0]);
		}
	}
	
	// Moving RIGHT - go to previous scene
	if (player.x > 320) {
		if (sceneIndex > 0) {
			// Normal transition to previous university scene
			console.log("Going to previous university:", UNIVERSITY_SCENES[sceneIndex - 1]);
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(UNIVERSITY_SCENES[sceneIndex - 1]);
		} else {
			// At University1, loop back to University11
			console.log("Looping from University1 to University11");
			player.x = 10;
			globalThis.playerSpawnX = 10;
			globalThis.playerSpawnY = player.y;
			runtime.goToLayout(UNIVERSITY_SCENES[UNIVERSITY_SCENES.length - 1]);
		}
	}
}