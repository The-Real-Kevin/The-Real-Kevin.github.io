// lighterController.js - Debug version to see what's happening

const LIGHTER_OFFSET_Y = -10; // Lighter floats above player when carried

// Track lighter state per layout
let lighterStates = {};

function getLayoutState(layoutName) {
	if (!lighterStates[layoutName]) {
		lighterStates[layoutName] = {
			isCarrying: false,
			lighterX: 0,
			lighterY: 0,
			eKeyWasPressed: false,
			fKeyWasPressed: false,
			initialized: false
		};
	}
	return lighterStates[layoutName];
}

export function initLighterSystem(runtime) {
	console.log("Lighter system initialized (works in any layout with Lighter + FireDrop)");
}

export function updateLighterSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	const player = runtime.objects.Player?.getFirstInstance();
	if (!player) return;
	
	const lighter = runtime.objects.Lighter?.getFirstInstance();
	const fireDropType = runtime.objects.FireDrop;
	
	// Only run if this layout has both Lighter and FireDrop objects
	if (!lighter || !fireDropType) {
		// Debug: Check what's missing
		if (!lighter && runtime.tickCount % 120 === 0) {
			console.log("Lighter not found in", currentLayout);
		}
		if (!fireDropType && runtime.tickCount % 120 === 0) {
			console.log("FireDrop not found in", currentLayout);
		}
		return;
	}
	
	const state = getLayoutState(currentLayout);
	
	// Initialize lighter position on first run
	if (!state.initialized) {
		state.lighterX = lighter.x;
		state.lighterY = lighter.y;
		state.initialized = true;
		console.log("Lighter initialized in", currentLayout, "at", state.lighterX, state.lighterY);
	}
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	const fKeyPressed = keyboard.isKeyDown("KeyF");
	
	// Debug: Log when F is pressed
	if (fKeyPressed && !state.fKeyWasPressed) {
		console.log("F key pressed! Carrying:", state.isCarrying);
	}
	
	// Handle lighter
	if (state.isCarrying) {
		// Lighter follows player
		lighter.x = player.x;
		lighter.y = player.y + LIGHTER_OFFSET_Y;
		lighter.isVisible = true;
		
		// Debug logging
		if (runtime.tickCount % 60 === 0) {
			console.log("Carrying Lighter in", currentLayout, "- Press F to create fire drop");
		}
		
		// Drop lighter with E
		if (eKeyPressed && !state.eKeyWasPressed) {
			dropLighter(player, lighter, state);
		}
		
		// Create fire drop with F
		if (fKeyPressed && !state.fKeyWasPressed) {
			console.log("Attempting to create fire drop...");
			createFireDrop(runtime, player, currentLayout);
		}
	} else {
		// Lighter is on ground
		lighter.x = state.lighterX;
		lighter.y = state.lighterY;
		lighter.isVisible = true;
		
		// Pick up lighter
		const distance = Math.hypot(player.x - lighter.x, player.y - lighter.y);
		
		if (distance < 35 && runtime.tickCount % 60 === 0) {
			console.log("Press E to pick up Lighter");
		}
		
		if (distance < 30 && eKeyPressed && !state.eKeyWasPressed) {
			pickUpLighter(lighter, state, currentLayout);
		}
	}
	
	state.eKeyWasPressed = eKeyPressed;
	state.fKeyWasPressed = fKeyPressed;
}

function pickUpLighter(lighter, state, layoutName) {
	console.log("✓ Picked up Lighter in", layoutName);
	state.isCarrying = true;
	state.lighterX = lighter.x;
	state.lighterY = lighter.y;
}

function dropLighter(player, lighter, state) {
	console.log("✓ Dropped Lighter");
	state.isCarrying = false;
	state.lighterX = player.x;
	state.lighterY = player.y;
	
	// Position lighter at player location
	lighter.x = player.x;
	lighter.y = player.y;
}

function createFireDrop(runtime, player, layoutName) {
	console.log("createFireDrop called!");
	
	const fireDropType = runtime.objects.FireDrop;
	if (!fireDropType) {
		console.error("FireDrop object not found!");
		return;
	}
	
	console.log("FireDrop type found, creating instance...");
	
	try {
		// Create new fire drop at player position on layer 0
		const newFireDrop = fireDropType.createInstance(0, player.x, player.y);
		
		console.log("Fire drop instance created!");
		
		// Set random rotation
		const randomAngle = Math.random() * 360;
		newFireDrop.angle = randomAngle;
		newFireDrop.isVisible = true;
		
		console.log("✓ Created fire drop in", layoutName, "at:", Math.round(player.x), Math.round(player.y), "angle:", Math.round(randomAngle));
	} catch (error) {
		console.error("Error creating fire drop in", layoutName, ":", error);
	}
}

export function getLighterStates() {
	return { ...lighterStates };
}