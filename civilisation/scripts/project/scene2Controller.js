// scene2Controller.js - Fixed state preservation

import { getCurrentMissionNumber, isMissionCompleted } from "./missionProgressionSystem.js";

const SCENE2_LAYOUT = "Scene2";

// Add to the initialization section at the top:
let mission6CardState = {
    card1Shown: false,  // First card (frame 0)
    card2Shown: false   // Second card (frame 1)
};

// Track which objects have been activated
let scene2State = {
	fountainActivated: false,
	fire1Activated: false,
	fire2Activated: false
};

let eKeyWasPressed = false;
let hasRestoredThisSession = false;

// Add to initScene2System():
export function initScene2System(runtime) {
    console.log("Scene2 interaction system initialized");
    
    // Initialize global flags if needed
    if (globalThis.fountainActivated === undefined) {
        globalThis.fountainActivated = false;
    }
    if (globalThis.fire1Activated === undefined) {
        globalThis.fire1Activated = false;
    }
    if (globalThis.fire2Activated === undefined) {
        globalThis.fire2Activated = false;
    }
    
    // Initialize Mission6Card flags - NEW
    if (globalThis.mission6Card1Dismissed === undefined) {
        globalThis.mission6Card1Dismissed = false;
    }
    if (globalThis.mission6Card2Dismissed === undefined) {
        globalThis.mission6Card2Dismissed = false;
    }
    
    // Sync with global state
    scene2State.fountainActivated = globalThis.fountainActivated;
    scene2State.fire1Activated = globalThis.fire1Activated;
    scene2State.fire2Activated = globalThis.fire2Activated;
}


export function isScene2MissionActive() {
	const currentMission = getCurrentMissionNumber();
	// Mission is active if we're on mission 6 and haven't completed all objects
	return currentMission === 6 && 
	       !(globalThis.fountainActivated && globalThis.fire1Activated && globalThis.fire2Activated);
}

// Replace the entire updateScene2System function:
export function updateScene2System(runtime) {
    const currentLayout = runtime.layout?.name;
    
    // Reset restoration flag when leaving Scene2
    if (currentLayout !== SCENE2_LAYOUT) {
        hasRestoredThisSession = false;
        return;
    }
    
    // CRITICAL: Restore state every frame
    restoreScene2StateEveryFrame(runtime);
    
    const currentMission = getCurrentMissionNumber();
    const player = runtime.objects.Player?.getFirstInstance();
    if (!player) return;
    
    const keyboard = runtime.keyboard;
    const eKeyPressed = keyboard.isKeyDown("KeyE");
    
    // Handle Mission6Card - NEW
    handleMission6Card(runtime, currentMission, eKeyPressed);
    
    // Mission 6 can only be done when we're on mission 6
    if (currentMission !== 6) {
        eKeyWasPressed = eKeyPressed;
        return;
    }
    
    // Check interactions with objects
    checkFountainInteraction(runtime, player, eKeyPressed);
    checkFire1Interaction(runtime, player, eKeyPressed);
    checkFire2Interaction(runtime, player, eKeyPressed);
    
    eKeyWasPressed = eKeyPressed;
}


function restoreScene2StateEveryFrame(runtime) {
	// Restore Fountain
	const fountain = runtime.objects.Fountain?.getFirstInstance();
	if (fountain && globalThis.fountainActivated) {
		if (fountain.animationFrame !== 1) {
			fountain.animationFrame = 1;
			if (!hasRestoredThisSession) {
				console.log("Fountain restored to frame 1");
			}
		}
	}
	
	// Restore Fire1
	const fire1 = runtime.objects.Fire1?.getFirstInstance();
	if (fire1 && globalThis.fire1Activated) {
		if (fire1.animationFrame !== 1) {
			fire1.animationFrame = 1;
			if (!hasRestoredThisSession) {
				console.log("Fire1 restored to frame 1");
			}
		}
	}
	
	// Restore Fire2
	const fire2 = runtime.objects.Fire2?.getFirstInstance();
	if (fire2 && globalThis.fire2Activated) {
		if (fire2.animationFrame !== 1) {
			fire2.animationFrame = 1;
			if (!hasRestoredThisSession) {
				console.log("Fire2 restored to frame 1");
			}
		}
	}
	
	// Mark as restored this session
	if (!hasRestoredThisSession && 
	    (globalThis.fountainActivated || globalThis.fire1Activated || globalThis.fire2Activated)) {
		hasRestoredThisSession = true;
		console.log("Scene2 state restoration complete");
	}
}


// Add new function after restoreScene2StateEveryFrame():
function handleMission6Card(runtime, currentMission, eKeyPressed) {
    const mission6Card = runtime.objects.Mission6Card?.getFirstInstance();
    if (!mission6Card) {
        console.warn("Mission6Card not found in Scene2!");
        return;
    }
    
    // Check if Mission 6 is active
    const isMission6Active = currentMission === 6;
    const allObjectsActivated = globalThis.fountainActivated && 
                                globalThis.fire1Activated && 
                                globalThis.fire2Activated;
    
    // CARD 1 (Frame 0): Show when Mission 6 starts
    if (isMission6Active && !globalThis.mission6Card1Dismissed && !allObjectsActivated) {
        if (!mission6CardState.card1Shown) {
            // Show card 1 for the first time
            mission6Card.isVisible = true;
            mission6Card.animationFrame = 0;
            mission6CardState.card1Shown = true;
            console.log("Mission6Card shown (frame 0)");
        } else {
            // Card 1 is showing, check for dismiss
            if (eKeyPressed && !eKeyWasPressed) {
                mission6Card.isVisible = false;
                globalThis.mission6Card1Dismissed = true;
                console.log("Mission6Card dismissed (frame 0)");
            }
        }
        return;
    }
    
    // CARD 2 (Frame 1): Show when all objects activated
    if (isMission6Active && allObjectsActivated && !globalThis.mission6Card2Dismissed) {
        if (!mission6CardState.card2Shown) {
            // Show card 2 for the first time
            mission6Card.isVisible = true;
            mission6Card.animationFrame = 1;
            mission6CardState.card2Shown = true;
            console.log("Mission6Card shown (frame 1)");
        } else {
            // Card 2 is showing, check for dismiss
            if (eKeyPressed && !eKeyWasPressed) {
                mission6Card.isVisible = false;
                globalThis.mission6Card2Dismissed = true;
                console.log("Mission6Card dismissed permanently (frame 1)");
            }
        }
        return;
    }
    
    // Hide card if conditions not met
    if (mission6Card.isVisible && 
        (globalThis.mission6Card1Dismissed || globalThis.mission6Card2Dismissed || currentMission !== 6)) {
        mission6Card.isVisible = false;
    }
}

function checkFountainInteraction(runtime, player, eKeyPressed) {
	// Skip if already activated
	if (globalThis.fountainActivated) return;
	
	const fountain = runtime.objects.Fountain?.getFirstInstance();
	if (!fountain) {
		console.warn("Fountain not found in Scene2!");
		return;
	}
	
	const distance = Math.hypot(player.x - fountain.x, player.y - fountain.y);
	
	// Show hint when near
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to activate Fountain");
	}
	
	// Activate if E pressed
	if (distance < 45 && eKeyPressed && !eKeyWasPressed) {
		activateFountain(fountain);
	}
}

function checkFire1Interaction(runtime, player, eKeyPressed) {
	// Skip if already activated
	if (globalThis.fire1Activated) return;
	
	const fire1 = runtime.objects.Fire1?.getFirstInstance();
	if (!fire1) {
		console.warn("Fire1 not found in Scene2!");
		return;
	}
	
	const distance = Math.hypot(player.x - fire1.x, player.y - fire1.y);
	
	// Show hint when near
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to activate Fire1");
	}
	
	// Activate if E pressed
	if (distance < 45 && eKeyPressed && !eKeyWasPressed) {
		activateFire1(fire1);
	}
}

function checkFire2Interaction(runtime, player, eKeyPressed) {
	// Skip if already activated
	if (globalThis.fire2Activated) return;
	
	const fire2 = runtime.objects.Fire2?.getFirstInstance();
	if (!fire2) {
		console.warn("Fire2 not found in Scene2!");
		return;
	}
	
	const distance = Math.hypot(player.x - fire2.x, player.y - fire2.y);
	
	// Show hint when near
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to activate Fire2");
	}
	
	// Activate if E pressed
	if (distance < 45 && eKeyPressed && !eKeyWasPressed) {
		activateFire2(fire2);
	}
}

function activateFountain(fountain) {
	// Advance to next frame
	const currentFrame = fountain.animationFrame;
	const totalFrames = fountain.animation.frameCount;
	
	if (currentFrame < totalFrames - 1) {
		fountain.animationFrame = currentFrame + 1;
		globalThis.fountainActivated = true;
		scene2State.fountainActivated = true;
		console.log("✓ Fountain activated! Frame:", fountain.animationFrame);
		
		checkAllActivated();
	} else {
		console.log("Fountain already at max frame");
	}
}

function activateFire1(fire1) {
	// Advance to next frame
	const currentFrame = fire1.animationFrame;
	const totalFrames = fire1.animation.frameCount;
	
	if (currentFrame < totalFrames - 1) {
		fire1.animationFrame = currentFrame + 1;
		globalThis.fire1Activated = true;
		scene2State.fire1Activated = true;
		console.log("✓ Fire1 activated! Frame:", fire1.animationFrame);
		
		checkAllActivated();
	} else {
		console.log("Fire1 already at max frame");
	}
}

function activateFire2(fire2) {
	// Advance to next frame
	const currentFrame = fire2.animationFrame;
	const totalFrames = fire2.animation.frameCount;
	
	if (currentFrame < totalFrames - 1) {
		fire2.animationFrame = currentFrame + 1;
		globalThis.fire2Activated = true;
		scene2State.fire2Activated = true;
		console.log("✓ Fire2 activated! Frame:", fire2.animationFrame);
		
		checkAllActivated();
	} else {
		console.log("Fire2 already at max frame");
	}
}

function checkAllActivated() {
	if (globalThis.fountainActivated && 
	    globalThis.fire1Activated && 
	    globalThis.fire2Activated) {
		console.log("=== ALL SCENE2 OBJECTS ACTIVATED ===");
		console.log("→ Return to Scene1 and press E on forum to complete mission!");

	}
}

export function getScene2State() {
	return { 
		fountainActivated: globalThis.fountainActivated,
		fire1Activated: globalThis.fire1Activated,
		fire2Activated: globalThis.fire2Activated
	};
}

// Export for forum controller to check completion
export function areAllScene2ObjectsActivated() {
	return globalThis.fountainActivated && 
	       globalThis.fire1Activated && 
	       globalThis.fire2Activated;
}