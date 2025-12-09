// remoteController.js - Remote control system for LabRobot

const ROBOT_SPEED = 2;
const REMOTE_OFFSET_Y = -10; // Remote follows above player

// Remote state
let isCarryingRemote = false;
let remoteX = 0;
let remoteY = 0;
let eKeyWasPressed = false;

// Robot state - persistent position
let robotX = 160;
let robotY = 192;
let robotScene = "Lab5"; // Robot starts in Lab5

export function initRemoteSystem(runtime) {
	console.log("Remote control system initialized");
	
	isCarryingRemote = false;
	eKeyWasPressed = false;
	
	// Restore positions on layout start
	runtime.addEventListener("beforelayoutstart", () => {
		setTimeout(() => {
			restoreRemotePosition(runtime);
			restoreRobotPosition(runtime);
		}, 50);
	});
}

function restoreRemotePosition(runtime) {
	const remote = runtime.objects.Remote?.getFirstInstance();
	if (!remote) return;
	
	const currentLayout = runtime.layout.name;
	
	// If player is carrying remote, it will be positioned by update function
	if (isCarryingRemote) {
		remote.isVisible = true;
		console.log("Remote is being carried");
	} else {
		// Remote is on ground at saved position
		remote.x = remoteX;
		remote.y = remoteY;
		remote.isVisible = true;
		console.log("Remote restored at", Math.round(remoteX), Math.round(remoteY));
	}
}

function restoreRobotPosition(runtime) {
	const robot = runtime.objects.LabRobot?.getFirstInstance();
	if (!robot) return;
	
	const currentLayout = runtime.layout.name;
	
	// Only show robot if it's in the current scene
	if (robotScene === currentLayout) {
		robot.x = robotX;
		robot.y = robotY;
		robot.isVisible = true;
		console.log("Robot restored at", Math.round(robotX), Math.round(robotY), "in", robotScene);
	} else {
		robot.isVisible = false;
		console.log("Robot not in current scene (in", robotScene + ")");
	}
}

export function updateRemoteSystem(runtime, player, keyboard) {
	const currentLayout = runtime.layout.name;
	
	// Update robot visibility based on scene
	updateRobotVisibility(runtime);
	
	// Handle remote pickup/drop
	handleRemoteInteraction(runtime, player, keyboard);
	
	// If carrying remote, update its position to follow player
	if (isCarryingRemote) {
		updateRemotePosition(runtime, player);
		
		// Control robot with W/A/S/D keys
		handleRobotControl(runtime, keyboard);
	}
}

function updateRobotVisibility(runtime) {
	const currentLayout = runtime.layout.name;
	const robot = runtime.objects.LabRobot?.getFirstInstance();
	
	if (!robot) return;
	
	// Robot is only visible if it's in the current scene
	const shouldBeVisible = (robotScene === currentLayout);
	robot.isVisible = shouldBeVisible;
}

function handleRemoteInteraction(runtime, player, keyboard) {
	const remote = runtime.objects.Remote?.getFirstInstance();
	if (!remote) return;
	
	const eKeyPressed = keyboard.isKeyDown("KeyE");
	
	// Check if player is near remote (only if not carrying it)
	if (!isCarryingRemote) {
		const distance = Math.hypot(player.x - remote.x, player.y - remote.y);
		
		// Pick up remote with E key
		if (distance < 30 && eKeyPressed && !eKeyWasPressed) {
			pickupRemote(runtime, player, remote);
		}
	} else {
		// Drop remote with E key
		if (eKeyPressed && !eKeyWasPressed) {
			dropRemote(runtime, player, remote);
		}
	}
	
	eKeyWasPressed = eKeyPressed;
}

function pickupRemote(runtime, player, remote) {
	isCarryingRemote = true;
	console.log("✓ Picked up remote");
}

function dropRemote(runtime, player, remote) {
	isCarryingRemote = false;
	
	// Save remote position where it was dropped
	remoteX = remote.x;
	remoteY = remote.y;
	
	console.log("✓ Dropped remote at", Math.round(remoteX), Math.round(remoteY));
}

function updateRemotePosition(runtime, player) {
	const remote = runtime.objects.Remote?.getFirstInstance();
	if (!remote) return;
	
	// Position remote above player
	remote.x = player.x;
	remote.y = player.y + REMOTE_OFFSET_Y;
	remote.isVisible = true;
	
	// Update saved position
	remoteX = remote.x;
	remoteY = remote.y;
}

function handleRobotControl(runtime, keyboard) {
	const robot = runtime.objects.LabRobot?.getFirstInstance();
	if (!robot) return;
	
	const currentLayout = runtime.layout.name;
	
	// Only control robot if it's in the current scene
	if (robotScene !== currentLayout) {
		console.log("Cannot control robot - it's in", robotScene, "but you're in", currentLayout);
		return;
	}
	
	let moved = false;
	
	// W = Up
	if (keyboard.isKeyDown("KeyW")) {
		robot.y -= ROBOT_SPEED;
		moved = true;
	}
	
	// A = Left
	if (keyboard.isKeyDown("KeyA")) {
		robot.x -= ROBOT_SPEED;
		moved = true;
	}
	
	// S = Down
	if (keyboard.isKeyDown("KeyS")) {
		robot.y += ROBOT_SPEED;
		moved = true;
	}
	
	// D = Right
	if (keyboard.isKeyDown("KeyD")) {
		robot.x += ROBOT_SPEED;
		moved = true;
	}
	
	// Save robot position
	if (moved) {
		robotX = robot.x;
		robotY = robot.y;
	}
}

export function isPlayerCarryingRemote() {
	return isCarryingRemote;
}

// Update robot's scene (for potential future use)
export function updateRobotScene(newScene) {
	robotScene = newScene;
	console.log("🤖 Robot moved to", newScene);
}

// Debug info
export function debugRemoteInfo(runtime) {
	const remote = runtime.objects.Remote?.getFirstInstance();
	const robot = runtime.objects.LabRobot?.getFirstInstance();
	
	console.log("=== REMOTE/ROBOT DEBUG INFO ===");
	console.log("Current scene:", runtime.layout.name);
	console.log("Carrying remote:", isCarryingRemote);
	
	if (remote) {
		console.log("Remote:", {
			position: `(${Math.round(remote.x)}, ${Math.round(remote.y)})`,
			visible: remote.isVisible,
			beingCarried: isCarryingRemote
		});
	}
	
	if (robot) {
		console.log("Robot:", {
			position: `(${Math.round(robot.x)}, ${Math.round(robot.y)})`,
			scene: robotScene,
			visible: robot.isVisible
		});
	}
	console.log("===================");
}