// statueController.js - Statue2 pre-built, only build Statue1

const SCENE1_LAYOUT = "Scene1";

let statue1Built = false;
let statue2Built = true; // CHANGED: Statue2 starts built
let eKeyWasPressed = false;
let missionActive = false;
let missionCompleteFlag = false;
let hasInitializedThisSession = false;

export function isStatueMissionActive() {
	return missionActive;
}

export function initStatueSystem(runtime) {
	// Initialize saved state
	if (globalThis.statue1Built === undefined) {
		globalThis.statue1Built = false;
	}
	if (globalThis.statue2Built === undefined) {
		globalThis.statue2Built = true; // CHANGED: Statue2 starts built
	}
}

export function startStatueMission(runtime) {
	console.log("=== MISSION 2: BUILD STATUE 1 ===");
	console.log("Walk to statue base and press E to build");
	
	missionActive = true;
	hasInitializedThisSession = false;
	
	// Load saved state
	statue1Built = globalThis.statue1Built || false;
	statue2Built = globalThis.statue2Built !== undefined ? globalThis.statue2Built : true; // CHANGED
	
	// Set initial visibility
	updateStatueVisibility(runtime);
}

export function updateStatueSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// ALWAYS restore statues in Scene1, regardless of mission active state
	if (currentLayout === SCENE1_LAYOUT) {
		// Sync local state with global state
		statue1Built = globalThis.statue1Built || false;
		statue2Built = globalThis.statue2Built !== undefined ? globalThis.statue2Built : true; // CHANGED
		
		// Restore statue visibility every frame
		updateStatueVisibility(runtime);
		
		// Only run mission logic if mission is active
		if (missionActive) {
			updateMissionLogic(runtime);
		}
	}
}

function updateStatueVisibility(runtime) {
	const statue1 = runtime.objects.Statue1?.getFirstInstance();
	const statue2 = runtime.objects.Statue2?.getFirstInstance();
	const box1 = runtime.objects.StatueBox1?.getFirstInstance();
	const box2 = runtime.objects.StatueBox2?.getFirstInstance();
	
	// Set statue visibility based on saved state
	if (statue1) {
		statue1.isVisible = statue1Built;
	}
	if (statue2) {
		statue2.isVisible = true; // CHANGED: Statue2 always visible
		statue2.animationFrame = statue2Built ? 0 : 1; // Frame 0 = built, Frame 1 = destroyed
	}
	
	// Hide boxes if statues are built
	if (box1) {
		box1.isVisible = !statue1Built;
	}
	if (box2) {
		box2.isVisible = false; // CHANGED: Box2 never shows
	}
}

function updateMissionLogic(runtime) {
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check statue box 1 (only statue that needs building in Mission 2)
	if (!statue1Built) {
		checkStatueBox1(runtime, player, eKeyPressed);
	}
	
	// Check if mission complete (only need Statue1)
	if (statue1Built && !missionCompleteFlag) {
		completeMission(runtime);
	}
	
	eKeyWasPressed = eKeyPressed;
}

function checkStatueBox1(runtime, player, eKeyPressed) {
	const box1 = runtime.objects.StatueBox1?.getFirstInstance();
	if (!box1 || !box1.isVisible) return;
	
	const distance = Math.hypot(player.x - box1.x, player.y - box1.y);
	
	// Show hint when near
	if (distance < 35 && runtime.tickCount % 60 === 0) {
		console.log("Near Statue Base 1 - Press E to build");
	}
	
	// Build statue
	if (distance < 30 && eKeyPressed && !eKeyWasPressed) {
		buildStatue1(runtime);
	}
}

function buildStatue1(runtime) {
	console.log("✓ Building Statue 1...");
	
	statue1Built = true;
	globalThis.statue1Built = true; // SAVE STATE GLOBALLY
	
	updateStatueVisibility(runtime);
	console.log("✓ Statue 1 built!");
}

function completeMission(runtime) {
	console.log("=== MISSION 2 COMPLETE: STATUE 1 BUILT ===");
	console.log("→ Return to forum to continue");
	missionCompleteFlag = true;
	missionActive = false;
	
	// Don't use onMissionComplete for statue mission
	// Instead, forumController checks globalThis.statue1Built
}

export function resetStatueMission() {
	statue1Built = false;
	statue2Built = true; // CHANGED: Statue2 remains built after reset
	globalThis.statue1Built = false;
	globalThis.statue2Built = true; // CHANGED
	missionActive = false;
	missionCompleteFlag = false;
}