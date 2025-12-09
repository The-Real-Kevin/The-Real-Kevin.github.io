// scene3MinigameController.js - FIXED to match other controller patterns

const MONEYBAG_SPEED = 4;
const MIN_X = 10;
const MAX_X = 310;
const MIN_Y = 138;
const MAX_Y = 246;

let nKeyWasPressed = false;
let activeMoneyBags = [];

export function initScene3Minigame(runtime) {
	console.log("Scene3 minigame system initialized");
	nKeyWasPressed = false;
	activeMoneyBags = [];
}

export function updateScene3Minigame(runtime, player, keyboard) {
	const currentLayout = runtime.layout?.name;
	
	// Only run in Scene3
	if (currentLayout !== "Scene3") {
		// Clean up if we left Scene3
		if (activeMoneyBags.length > 0) {
			cleanupMoneyBags(runtime);
		}
		return;
	}
	
	// We're in Scene3 - manage targets
	updateTargets(runtime);
	
	// Handle N key press to throw money bag
	const nKeyPressed = keyboard.isKeyDown("KeyN");
	
	if (nKeyPressed && !nKeyWasPressed) {
		console.log("N key pressed in Scene3!");
		throwMoneyBag(runtime, player);
	}
	
	nKeyWasPressed = nKeyPressed;
	
	// Update all active money bags
	updateMoneyBags(runtime);
	
	// Check collisions with targets
	checkTargetCollisions(runtime);
}

function updateTargets(runtime) {
	const targetNPC1 = runtime.objects.TargetNPC1?.getFirstInstance();
	const targetNPC2 = runtime.objects.TargetNPC2?.getFirstInstance();
	
	// Make sure targets are visible and positioned
	if (targetNPC1 && !targetNPC1.isVisible) {
		randomizeTargetPosition(targetNPC1);
		targetNPC1.isVisible = true;
		console.log("✓ TargetNPC1 spawned at", Math.round(targetNPC1.x), Math.round(targetNPC1.y));
	}
	
	if (targetNPC2 && !targetNPC2.isVisible) {
		randomizeTargetPosition(targetNPC2);
		targetNPC2.isVisible = true;
		console.log("✓ TargetNPC2 spawned at", Math.round(targetNPC2.x), Math.round(targetNPC2.y));
	}
	
	if (!targetNPC1) {
		console.warn("❌ TargetNPC1 not found!");
	}
	if (!targetNPC2) {
		console.warn("❌ TargetNPC2 not found!");
	}
}

function randomizeTargetPosition(target) {
	target.x = MIN_X + Math.random() * (MAX_X - MIN_X);
	target.y = MIN_Y + Math.random() * (MAX_Y - MIN_Y);
	console.log("  → Randomized to:", Math.round(target.x), Math.round(target.y));
}

function throwMoneyBag(runtime, player) {
	const moneyBagType = runtime.objects.MoneyBag;
	if (!moneyBagType) {
		console.error("❌ MoneyBag object type not found!");
		return;
	}
	
	console.log("Creating MoneyBag at player position:", Math.round(player.x), Math.round(player.y));
	
	// Create new money bag at player position
	const moneyBag = moneyBagType.createInstance(0, player.x, player.y);
	moneyBag.isVisible = true;
	
	console.log("✓ MoneyBag created successfully");
	
	// Determine direction based on player's animation frame
	// 0 = Down, 1 = Left, 2 = Up, 3 = Right
	let direction = { dx: 0, dy: 0 };
	
	switch (player.animationFrame) {
		case 0: // Down
			direction = { dx: 0, dy: 1 };
			break;
		case 1: // Left
			direction = { dx: -1, dy: 0 };
			break;
		case 2: // Up
			direction = { dx: 0, dy: -1 };
			break;
		case 3: // Right
			direction = { dx: 1, dy: 0 };
			break;
	}
	
	// Store money bag with its direction
	activeMoneyBags.push({
		instance: moneyBag,
		dx: direction.dx,
		dy: direction.dy
	});
	
	console.log("💰 Money bag thrown! Direction:", direction, "Player frame:", player.animationFrame);
}

function updateMoneyBags(runtime) {
	// Update positions and check if out of bounds
	for (let i = activeMoneyBags.length - 1; i >= 0; i--) {
		const bagData = activeMoneyBags[i];
		const bag = bagData.instance;
		
		// Move money bag
		bag.x += bagData.dx * MONEYBAG_SPEED;
		bag.y += bagData.dy * MONEYBAG_SPEED;
		
		// Check if out of bounds (outside 320x256 scene)
		if (bag.x < 0 || bag.x > 320 || bag.y < 128 || bag.y > 256) {
			// Destroy money bag
			bag.destroy();
			activeMoneyBags.splice(i, 1);
			console.log("💰 Money bag left scene and was destroyed");
		}
	}
}

function checkTargetCollisions(runtime) {
	const targetNPC1 = runtime.objects.TargetNPC1?.getFirstInstance();
	const targetNPC2 = runtime.objects.TargetNPC2?.getFirstInstance();
	
	// Check each money bag against each target
	for (let i = activeMoneyBags.length - 1; i >= 0; i--) {
		const bagData = activeMoneyBags[i];
		const bag = bagData.instance;
		
		// Check collision with TargetNPC1
		if (targetNPC1 && targetNPC1.isVisible) {
			const distance1 = Math.hypot(bag.x - targetNPC1.x, bag.y - targetNPC1.y);
			if (distance1 < 20) {
				console.log("🎯 HIT TargetNPC1!");
				randomizeTargetPosition(targetNPC1);
				
				// Destroy the money bag
				bag.destroy();
				activeMoneyBags.splice(i, 1);
				continue;
			}
		}
		
		// Check collision with TargetNPC2
		if (targetNPC2 && targetNPC2.isVisible) {
			const distance2 = Math.hypot(bag.x - targetNPC2.x, bag.y - targetNPC2.y);
			if (distance2 < 20) {
				console.log("🎯 HIT TargetNPC2!");
				randomizeTargetPosition(targetNPC2);
				
				// Destroy the money bag
				bag.destroy();
				activeMoneyBags.splice(i, 1);
			}
		}
	}
}

function cleanupMoneyBags(runtime) {
	// Destroy all active money bags when leaving Scene3
	for (const bagData of activeMoneyBags) {
		if (bagData.instance) {
			bagData.instance.destroy();
		}
	}
	activeMoneyBags = [];
	console.log("Cleaned up all money bags");
}