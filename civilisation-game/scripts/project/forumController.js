// forumController.js - Add Mission 11 (Statue2 destroy) and MissionText

import { 
	getCurrentMissionNumber, 
	getCurrentMissionData, 
	markMissionComplete,
	advanceToNextMission,
	updateMainSceneText,
	updateMissionText, // NEW
	hideMissionText,  // ADD THIS
	showMissionText,  // ADD THIS
	resetProgressionSystem
} from "./missionProgressionSystem.js";

import { areAllScene2ObjectsActivated } from "./scene2Controller.js";

const SCENE1_LAYOUT = "Scene1";
// At the top with other state variables, add:
let mission11CardShown = false;

// Forum interaction state
let eKeyWasPressed = false;
let playerTouchedForum = false;
let isShowingLoading = false;
let loadingStartTime = 0;
let loadingTargetLayout = null;
let hasRestoredThisSession = false;

// Ending sequence state
let endingState = {
	endingStarted: false,
	endSceneFrame: 0,
	endSceneComplete: false,
	greenhouseVisible: false
};

export function initForumSystem(runtime) {
	console.log("Forum interaction system initialized");
	
	// Initialize forum frame tracking if not set
	if (globalThis.savedForumFrame === undefined) {
		globalThis.savedForumFrame = 0;
	}
	
	// Initialize return flag
	if (globalThis.justReturnedFromMission === undefined) {
		globalThis.justReturnedFromMission = false;
	}
	
	// Initialize ending state
	if (globalThis.endingStarted === undefined) {
		globalThis.endingStarted = false;
	}
	if (globalThis.endSceneComplete === undefined) {
		globalThis.endSceneComplete = false;
	}
	if (globalThis.greenhouseRevealed === undefined) {
		globalThis.greenhouseRevealed = false;
	}
	
	// Initialize game cycle reset flag
	if (globalThis.gameCycleReset === undefined) {
		globalThis.gameCycleReset = false;
	}

	// Initialize ForumBox and StatueBox flags
	if (globalThis.forumBoxHidden === undefined) {
		globalThis.forumBoxHidden = false;
	}
	if (globalThis.statueBoxHidden === undefined) {
		globalThis.statueBoxHidden = false;
	}
	
	// Initialize MissionText on first load (only if greenhouse not revealed)
	setTimeout(() => {
		if (!globalThis.greenhouseRevealed) {
			updateMissionText(runtime);
			showMissionText(runtime);
		} else {
			// Hide MissionText if greenhouse is already revealed
			const missionText = runtime.objects.MissionText?.getFirstInstance();
			const missionTextBox = runtime.objects.MissionTextBox?.getFirstInstance();
			if (missionText) missionText.isVisible = false;
			if (missionTextBox) missionTextBox.isVisible = false;
			console.log("Greenhouse already revealed - MissionText stays hidden");
		}
	}, 100);
}

export function updateForumSystem(runtime) {
	const currentLayout = runtime.layout?.name;
	
	// Handle loading overlay
	if (isShowingLoading) {
		handleLoadingOverlay(runtime);
		return;
	}
	
	// Only run forum logic in Scene1
	if (currentLayout !== SCENE1_LAYOUT) {
		hasRestoredThisSession = false;
		return;
	}
	
	// Restore ending state from global
	syncEndingState();
	
	// Restore visual states
	restoreEndingVisuals(runtime);
	// Handle ForumBox and StatueBox visibility


	
	// CRITICAL: Restore forum state every frame (only if ending hasn't started)
	const forum = runtime.objects.Forum?.getFirstInstance();
	if (forum && !endingState.endingStarted) {
		if (forum.animationFrame !== globalThis.savedForumFrame) {
			forum.animationFrame = globalThis.savedForumFrame;
			
			if (!hasRestoredThisSession) {
				console.log(`Forum restored to frame ${globalThis.savedForumFrame}`);
				updateMainSceneText(runtime);
				updateMissionText(runtime); // NEW
				hasRestoredThisSession = true;
			}
		}
	}
	
	const player = runtime.objects.Player?.getFirstInstance();
	
	if (!player) return;
	
	const keyboard = runtime.keyboard;
	const eKeyPressed = keyboard.isKeyDown("KeyE");

	// Handle Mission11Card dismissal - NEW (before other interactions)
	handleMission11CardDismissal(runtime, eKeyPressed);
	handleInfoBoxes(runtime, player, keyboard);

	
	// If ending is complete (greenhouse visible), do nothing more
	if (endingState.greenhouseVisible) {
		eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// Handle GardenBox interaction after EndScene complete (BEFORE EndScene check!)
	if (endingState.endSceneComplete) {
		handleGardenBox(runtime, player, eKeyPressed);
		eKeyWasPressed = eKeyPressed;
		return;
	}
	
	// Handle ending sequence if active (EndScene frames)
	if (endingState.endingStarted && !endingState.endSceneComplete) {
		handleEndingSequence(runtime, player, eKeyPressed);
		eKeyWasPressed = eKeyPressed;
		return;
	}
	
	if (!forum) return;
	
	// Check if player is touching forum
	const isTouching = checkPlayerTouchingForum(player, forum);
	
	if (isTouching) {
		if (!playerTouchedForum) {
			playerTouchedForum = true;
			
			const currentMission = getCurrentMissionNumber();
			if (currentMission === 1) {
				console.log("Near forum - Press E to cool it (Mission 1)");
			} else if (currentMission > 11) { // CHANGED: Now 11 missions
				console.log("Near forum - Press E to start ending sequence");
			} else if (globalThis.justReturnedFromMission) {
				console.log("Near forum - Press E to cool it (complete mission)");
			} else {
				console.log("Near forum - Press E to start mission");
			}
		}
		
		// Check for E key press
		if (eKeyPressed && !eKeyWasPressed) {
			handleForumInteraction(runtime, forum);
		}
		
		eKeyWasPressed = eKeyPressed;
	} else {
		if (playerTouchedForum) {
			playerTouchedForum = false;
		}
		eKeyWasPressed = false;
	}
}

// Add new function after showMission11Card():
function handleMission11CardDismissal(runtime, eKeyPressed) {
	const mission11Card = runtime.objects.Mission11Card?.getFirstInstance();
	if (!mission11Card) return;
	
	// If card is visible and E is pressed, dismiss it
	if (mission11Card.isVisible && eKeyPressed && !eKeyWasPressed) {
		mission11Card.isVisible = false;
		globalThis.mission11CardDismissed = true;
		mission11CardShown = false;
		console.log("Mission11Card dismissed permanently");
	}
}

function syncEndingState() {
	endingState.endingStarted = globalThis.endingStarted || false;
	endingState.endSceneComplete = globalThis.endSceneComplete || false;
	endingState.greenhouseVisible = globalThis.greenhouseRevealed || false;
}

function restoreEndingVisuals(runtime) {
	const forum = runtime.objects.Forum?.getFirstInstance();
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	const greenhouse = runtime.objects.Greenhouse?.getFirstInstance();
	
	// If ending started, hide forum
	if (forum && endingState.endingStarted) {
		forum.isVisible = false;
	}
	
	// Show/hide EndScene based on state
	if (endScene) {
		if (endingState.endingStarted && !endingState.endSceneComplete) {
			endScene.isVisible = true;
			endScene.animationFrame = endingState.endSceneFrame;
		} else {
			endScene.isVisible = false;
		}
	}
	
	// Show/hide GardenBox based on state
	if (gardenBox) {
		if (endingState.endSceneComplete && !endingState.greenhouseVisible) {
			gardenBox.isVisible = true;
			gardenBox.x = 160;
			gardenBox.y = 128;
		} else {
			gardenBox.isVisible = false;
		}
	}
	
	// Show Greenhouse if revealed
	if (greenhouse) {
		if (endingState.greenhouseVisible) {
			greenhouse.isVisible = true;
		}
	}
}

function checkPlayerTouchingForum(player, forum) {
	const forumLeft = forum.x - 64;
	const forumRight = forum.x + 64;
	const forumTop = forum.y - 64;
	const forumBottom = forum.y + 64;
	const playerSize = 16;
	
	return (
		player.x + playerSize/2 > forumLeft &&
		player.x - playerSize/2 < forumRight &&
		player.y + playerSize/2 > forumTop &&
		player.y - playerSize/2 < forumBottom
	);
}

function handleForumInteraction(runtime, forum) {
	console.log("=== FORUM INTERACTION ===");
	
	const currentMission = getCurrentMissionNumber();
	const missionData = getCurrentMissionData();
	
	// Check if all missions complete - start ending sequence
	if (currentMission > 11) { // CHANGED: Now 11 missions
		console.log("All missions complete - starting ending sequence!");
		startEndingSequence(runtime, forum);
		return;
	}
	
	if (!missionData) {
		console.log("No mission data found!");
		return;
	}
	
	console.log(`Mission ${currentMission}: ${missionData.name}`);
	
	// MISSION 1: Cool the forum
	if (currentMission === 1) {
		coolForum(forum);
		console.log("✓ Mission 1 Complete!");
		
		markMissionComplete(currentMission);
		advanceToNextMission();
		hideMissionText(runtime); // ADD THIS LINE
		
		setTimeout(() => {
			updateMainSceneText(runtime);
			updateMissionText(runtime); // NEW
			console.log("→ Mission 2 ready: Build Statue 1");
			
			// Start statue mission
			import("./statueController.js").then(module => {
				module.startStatueMission(runtime);
			});
		}, 100);
		
		return;
	}
	
	// MISSION 2: Statue building - DO NOT cool forum, just check completion
	if (currentMission === 2) {
		console.log("Checking statue mission status...");
		
		// Check if Statue1 built
		if (globalThis.statue1Built) {
			console.log("✓ Statue 1 complete! Going directly to Mission 3");
			
			// Mark mission complete and advance (NO forum cooling)
			markMissionComplete(currentMission);
			advanceToNextMission();
			hideMissionText(runtime); // ADD THIS LINE
			
			// Update MissionText
			updateMissionText(runtime);
			
			// Go straight to Mission 3 layout
			const nextMissionData = getCurrentMissionData();
			if (nextMissionData && nextMissionData.targetLayout) {
				console.log(`→ Loading ${nextMissionData.targetLayout}...`);
				
				const player = runtime.objects.Player?.getFirstInstance();
				if (player) {
					globalThis.returnSceneName = SCENE1_LAYOUT;
					globalThis.returnPlayerX = player.x;
					globalThis.returnPlayerY = player.y;
					globalThis.currentMissionNumber = currentMission + 1;
				}
				
				showLoadingOverlay(runtime, nextMissionData.targetLayout);
			}
		} else {
			console.log("Build Statue 1 first!");
		}
		
		return;
	}
	
	// MISSION 6: Scene2 objects - DO NOT cool forum, just check completion
	if (currentMission === 6) {
		console.log("Checking Scene2 mission status...");
		
		// Check if all Scene2 objects activated
		if (areAllScene2ObjectsActivated()) {
			console.log("✓ Scene2 objects complete! Cooling forum.");
			
			// Cool forum and mark complete
			coolForum(forum);
			markMissionComplete(currentMission);
			advanceToNextMission();
			hideMissionText(runtime); // ADD THIS LINE
			
			setTimeout(() => {
				updateMainSceneText(runtime);
				updateMissionText(runtime); // NEW
				console.log("→ Mission 7 ready!");
			}, 100);
		} else {
			console.log("Activate Fountain, Fire1, and Fire2 in Scene2 first!");
		}
		
		return;
	}
	
	// Update the MISSION 11 section in handleForumInteraction():
	// MISSION 11: Destroy Statue2 - DO NOT cool forum, just check completion
	if (currentMission === 11) {
		console.log("Checking Statue2 destroy mission status...");
		
		// Check if Statue2 destroyed
		if (globalThis.statue2Destroyed) {
			console.log("✓ Statue 2 destroyed! Cooling forum.");
			
			// Cool forum and mark complete
			coolForum(forum);
			markMissionComplete(currentMission);
			advanceToNextMission();
			hideMissionText(runtime); // ADD THIS LINE
			
			setTimeout(() => {
				updateMainSceneText(runtime);
				updateMissionText(runtime); // NEW
				const nextMission = getCurrentMissionNumber();
				if (nextMission > 11) {
					console.log("🎉 ALL MISSIONS COMPLETE! Press E on forum to start ending!");
				}
			}, 100);
		} else {
			console.log("Destroy Statue 2 first!");
			
			// Show Mission11Card first - NEW
			showMission11Card(runtime);
			
			// Start Statue2 destroy mission
			import("./statue2DestroyController.js").then(module => {
				module.startStatue2DestroyMission(runtime);
			});
		}
		
		return;
	}

	
	// MISSIONS 3, 4, 5, 7, 8, 9, 10: Normal layout-based missions with two-step process
	if (globalThis.justReturnedFromMission) {
		// STEP 2: Just returned - cool the forum and mark complete
		coolForum(forum);
		console.log("✓ Mission complete! Forum cooled.");
		
		globalThis.justReturnedFromMission = false;
		markMissionComplete(currentMission);
		advanceToNextMission();
		hideMissionText(runtime); // ADD THIS LINE
		
		setTimeout(() => {
			updateMainSceneText(runtime);
			updateMissionText(runtime); // NEW
			const nextMission = getCurrentMissionNumber();
			if (nextMission > 11) {
				console.log("🎉 ALL MISSIONS COMPLETE! Press E on forum to start ending!");
			} else {
				console.log(`→ Mission ${nextMission} ready.`);
			}
		}, 100);
	} else {
		// STEP 1: Haven't done mission yet - send to mission (NO cooling)
		console.log(`→ Starting mission (forum stays at frame ${forum.animationFrame})`);
		
		const player = runtime.objects.Player?.getFirstInstance();
		if (player) {
			globalThis.returnSceneName = SCENE1_LAYOUT;
			globalThis.returnPlayerX = player.x;
			globalThis.returnPlayerY = player.y;
			globalThis.currentMissionNumber = currentMission;
		}
		
		showLoadingOverlay(runtime, missionData.targetLayout);
	}
}

// Add new function before handleInfoBoxes():
function showMission11Card(runtime) {
	const mission11Card = runtime.objects.Mission11Card?.getFirstInstance();
	if (!mission11Card) {
		console.warn("Mission11Card not found in Scene1!");
		return;
	}
	
	// Show card if not already dismissed
	if (!globalThis.mission11CardDismissed) {
		mission11Card.isVisible = true;
		mission11CardShown = true;
		console.log("Mission11Card shown");
	}
}


function startEndingSequence(runtime, forum) {
	console.log("=== STARTING ENDING SEQUENCE ===");
	
	endingState.endingStarted = true;
	endingState.endSceneFrame = 0;
	globalThis.endingStarted = true;
	
	// Hide the forum
	forum.isVisible = false;
	console.log("Forum hidden");
	
	// Show EndScene at frame 0
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	if (endScene) {
		endScene.isVisible = true;
		endScene.animationFrame = 0;
		console.log("EndScene visible at frame 0");
	} else {
		console.warn("EndScene sprite not found!");
	}
}

function handleEndingSequence(runtime, player, eKeyPressed) {
	const endScene = runtime.objects.EndScene?.getFirstInstance();
	if (!endScene) return;
	
	// Check if player is near EndScene area
	const distance = Math.hypot(player.x - 160, player.y - 128);
	
	if (distance < 70 && runtime.tickCount % 60 === 0) {
		console.log(`EndScene at frame ${endingState.endSceneFrame} - Press E to continue`);
	}
	
	if (distance < 60 && eKeyPressed && !eKeyWasPressed) {
		if (endingState.endSceneFrame < 9) {
			// Advance to next frame
			endingState.endSceneFrame++;
			endScene.animationFrame = endingState.endSceneFrame;
			console.log(`EndScene advanced to frame ${endingState.endSceneFrame}`);
		} else {
			// Frame 9 reached, pressing E again completes EndScene
			completeEndScene(runtime, endScene);
		}
	}
}

function completeEndScene(runtime, endScene) {
	console.log("=== END SCENE COMPLETE ===");
	
	endingState.endSceneComplete = true;
	globalThis.endSceneComplete = true;
	
	// Hide EndScene
	endScene.isVisible = false;
	console.log("EndScene hidden");
	
	// Show GardenBox at 160, 128
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	if (gardenBox) {
		gardenBox.isVisible = true;
		gardenBox.x = 160;
		gardenBox.y = 128;
		console.log("GardenBox visible at 160, 128");
	} else {
		console.warn("GardenBox sprite not found!");
	}
}

function handleGardenBox(runtime, player, eKeyPressed) {
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	
	if (!gardenBox) {
		console.warn("GardenBox not found in handleGardenBox!");
		return;
	}
	
	const distance = Math.hypot(player.x - gardenBox.x, player.y - gardenBox.y);
	
	// Debug logging
	if (runtime.tickCount % 60 === 0) {
		console.log("handleGardenBox running - distance:", Math.round(distance));
	}
	
	if (distance < 50 && runtime.tickCount % 60 === 0) {
		console.log("Press E to reveal Greenhouse");
	}
	
	if (distance < 45 && eKeyPressed && !eKeyWasPressed) {
		console.log("E pressed on GardenBox!");
		revealGreenhouse(runtime);
	}
}

function revealGreenhouse(runtime) {
	console.log("=== REVEALING GREENHOUSE ===");
	
	endingState.greenhouseVisible = true;
	globalThis.greenhouseRevealed = true;
	
	// Hide GardenBox
	const gardenBox = runtime.objects.GardenBox?.getFirstInstance();
	if (gardenBox) {
		gardenBox.isVisible = false;
		console.log("GardenBox hidden");
	}

	const missionText = runtime.objects.MissionText?.getFirstInstance();
	const missionTextBox = runtime.objects.MissionTextBox?.getFirstInstance();
	
	if (missionText) {
		missionText.isVisible = false;
		console.log("MissionText permanently hidden");
	}
	if (missionTextBox) {
		missionTextBox.isVisible = false;
		console.log("MissionTextBox permanently hidden");
	}
	// Show Greenhouse
	const greenhouse = runtime.objects.Greenhouse?.getFirstInstance();
	if (greenhouse) {
		greenhouse.isVisible = true;
		console.log("Greenhouse is now visible!");
	} else {
		console.warn("Greenhouse sprite not found!");
	}
	
	console.log("🎉 STAGE 1 ENDING COMPLETE! 🎉");
	
	// Reset the game cycle after a short delay
	setTimeout(() => {
		resetGameCycle(runtime);
	}, 1000);
}

function resetGameCycle(runtime) {
	console.log("=== RESETTING GAME CYCLE ===");
	
	// Mark that game cycle has been reset
	globalThis.gameCycleReset = true;
	
	// Reset mission progression system
	resetProgressionSystem();
	
	// Reset Scene2 objects (Fountain, Fire1, Fire2)
	globalThis.fountainActivated = false;
	globalThis.fire1Activated = false;
	globalThis.fire2Activated = false;
	
	// Reset IceCourt visibility
	globalThis.iceCourtRevealed = false;
	
	// Reset IceCity visibility
	globalThis.iceCityRevealed = false;
	
	// Reset forum frame to 0
	globalThis.savedForumFrame = 0;
	
	// Reset Statue2 destroyed flag
	globalThis.statue2Destroyed = false;
	globalThis.statue2Built = true; // Statue2 goes back to built state
	
	// Reset ending mission flags - NEW
	globalThis.endingMission1Complete = false;
	globalThis.endingMission2Complete = false;
	globalThis.npc6DialogueShown = false;
	globalThis.npc7DialogueShown = false;
	globalThis.npc6DialogueComplete = false;
	globalThis.npc7DialogueComplete = false;
	globalThis.greenhouseFrame = 0;
	// Reset info boxes
	globalThis.forumBoxHidden = true;
	globalThis.statueBoxHidden = true;
	
	globalThis.trueEndingComplete = false; // ADD THIS
	globalThis.trueEndFrame = 0; // ADD THIS
	// KEEP Statue1 built
	// globalThis.statue1Built stays true
	
	// KEEP greenhouse visible
	// globalThis.greenhouseRevealed stays true
	
	// KEEP ending started (so forum stays hidden)
	// globalThis.endingStarted stays true
	
	// Reset mission return flag
	globalThis.justReturnedFromMission = false;
	
	console.log("✓ Game cycle reset complete!");
	console.log("→ Ending missions reset");
	
	// Update the main scene text and mission text
	updateMainSceneText(runtime);
	updateMissionText(runtime);
}

function coolForum(forum) {
	const currentFrame = forum.animationFrame;
	const totalFrames = forum.animation.frameCount;
	
	if (currentFrame < totalFrames - 1) {
		forum.animationFrame = currentFrame + 1;
		globalThis.savedForumFrame = forum.animationFrame;
		console.log(`✓ Forum cooled! Frame ${currentFrame} → ${forum.animationFrame}`);
	} else {
		console.log("Forum already at coldest frame!");
	}
}

function showLoadingOverlay(runtime, targetLayout) {
	const loadingScreen = runtime.objects.LoadingScreen?.getFirstInstance();
	if (loadingScreen) {
		loadingScreen.isVisible = true;
	}
	
	isShowingLoading = true;
	loadingStartTime = Date.now();
	loadingTargetLayout = targetLayout;
}

function handleLoadingOverlay(runtime) {
	const elapsedTime = Date.now() - loadingStartTime;
	
	if (elapsedTime >= 1000) {
		console.log(`Loading complete → ${loadingTargetLayout}`);
		
		isShowingLoading = false;
		
		const loadingScreen = runtime.objects.LoadingScreen?.getFirstInstance();
		if (loadingScreen) {
			loadingScreen.isVisible = false;
		}
		
		globalThis.playerSpawnX = 160;
		globalThis.playerSpawnY = 200;
		
		runtime.goToLayout(loadingTargetLayout);
	}
}

function handleInfoBoxes(runtime, player, keyboard) {
    const forumBox = runtime.objects.ForumBox?.getFirstInstance();
    const statueBox = runtime.objects.StatueBox?.getFirstInstance();
    
    // ForumBox - hide when E is pressed
    if (forumBox && !globalThis.forumBoxHidden) {
        forumBox.isVisible = true;
        
        const distanceToForum = Math.hypot(player.x - forumBox.x, player.y - forumBox.y);
        const eKeyPressed = keyboard.isKeyDown("KeyE");
        
        if (distanceToForum < 50 && eKeyPressed && !eKeyWasPressed) {
            globalThis.forumBoxHidden = true;
            forumBox.isVisible = false;
            console.log("ForumBox hidden permanently");
        }
    } else if (forumBox) {
        forumBox.isVisible = false;
    }
    
    // StatueBox - show after Statue1 built, hide when E is pressed
    if (statueBox) {
        if (globalThis.statue1Built && !globalThis.statueBoxHidden) {
            statueBox.isVisible = true;
            
            const distanceToStatue = Math.hypot(player.x - statueBox.x, player.y - statueBox.y);
            const eKeyPressed = keyboard.isKeyDown("KeyE");
            
            if (distanceToStatue < 50 && eKeyPressed && !eKeyWasPressed) {
                globalThis.statueBoxHidden = true;
                statueBox.isVisible = false;
                console.log("StatueBox hidden permanently");
            }
        } else {
            statueBox.isVisible = false;
        }
    }
}

export function isForumSystemActive() {
	return isShowingLoading;
}

// Called by missions when they complete
export function onMissionComplete(runtime, missionNumber) {
	console.log(`✓✓✓ Mission ${missionNumber} Complete! ✓✓✓`);
	
	// Set flag so forum will cool on next interaction (for layout-based missions)
	globalThis.justReturnedFromMission = true;
	console.log("Set justReturnedFromMission flag");
}

// Export function for missions to show loading
export function showLoadingAndGoTo(runtime, targetLayout, spawnX, spawnY) {
	const loadingScreen = runtime.objects.LoadingScreen?.getFirstInstance();
	if (loadingScreen) {
		loadingScreen.isVisible = true;
	}
	
	globalThis.playerSpawnX = spawnX;
	globalThis.playerSpawnY = spawnY;
	
	isShowingLoading = true;
	loadingStartTime = Date.now();
	loadingTargetLayout = targetLayout;
}

globalThis.showLoadingAndGoTo = showLoadingAndGoTo;
globalThis.onMissionComplete = onMissionComplete;