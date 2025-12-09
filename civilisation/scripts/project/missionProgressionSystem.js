// missionProgressionSystem.js - Updated with story-based missions

// Mission progression state
let completedMissions = [];
let currentMissionNumber = 1;
let totalMissions = 11;

const MISSION_DATA = {
	1: {
		name: "Cool Down the Forum",
		instruction: 'Mission 1: Deradicalizing\nPress "e" on the forum to cool it down',
		targetLayout: null
	},
	2: {
		name: "Build Ice Hero Statue",
		instruction: 'Mission 2: An Ice Role Model\nBuild a statue for ice people to rally around',
		targetLayout: null
	},
	3: {
		name: "Cooling the City",
		instruction: 'Mission 3: AC Factory\nCarry the AC unit to cool down the city',
		targetLayout: "Mission1"
	},
	4: {
		name: "Ice Research",
		instruction: 'Mission 4: Deliver Science Item\nDeliver computer with ice research data',
		targetLayout: "Mission2"
	},
	5: {
		name: "Promoting Ice Thoughts",
		instruction: 'Mission 5: Deliver Ice Book\nGive the book to the librarian',
		targetLayout: "Mission3"
	},
	6: {
		name: "The Cultural Festival",
		instruction: 'Mission 6: Design the Park\nActivate Fountain, Fire1, and Fire2',
		targetLayout: null
	},
	7: {
		name: "Destroy Fire Research",
		instruction: 'Mission 7: Stop the Project\nPrevent fire hijacking of the heating system',
		targetLayout: "Mission4"
	},
	8: {
		name: "Flooding Fire Books",
		instruction: 'Mission 8: Protect Our People\nFlood the fire books in the library',
		targetLayout: "Mission5"
	},
	9: {
		name: "Ban Fire from Government",
		instruction: 'Mission 9: City Hall\nFlood fire people out of government chambers',
		targetLayout: "Court1"
	},
	10: {
		name: "Deport Fire People",
		instruction: 'Mission 10: Gone Too Far\nRemove fire people from the city',
		targetLayout: "Scene6"
	},
	11: {
		name: "Destroy Fire Hero Statue",
		instruction: 'Mission 11: Remove Fire Reference\nDestroy the extremist fire statue',
		targetLayout: null
	}
};

export function initProgressionSystem() {
	console.log("Mission progression system initialized");
}

export function getCurrentMissionNumber() {
	return currentMissionNumber;
}

export function getCurrentMissionData() {
	return MISSION_DATA[currentMissionNumber];
}

export function isMissionCompleted(missionNumber) {
	return completedMissions.includes(missionNumber);
}

export function markMissionComplete(missionNumber) {
	if (!completedMissions.includes(missionNumber)) {
		completedMissions.push(missionNumber);
		console.log(`Mission ${missionNumber} marked as complete!`);
		console.log("Completed missions:", completedMissions);
	}
}

export function advanceToNextMission() {
	currentMissionNumber++;
	console.log("Advanced to mission", currentMissionNumber);
	
	if (currentMissionNumber > totalMissions) {
		console.log("🎉 ALL MISSIONS COMPLETED! 🎉");
		return false;
	}
	
	return true;
}

export function getProgressionStatus() {
	return {
		currentMission: currentMissionNumber,
		completedMissions: [...completedMissions],
		totalCompleted: completedMissions.length,
		hasMoreMissions: currentMissionNumber <= totalMissions
	};
}

export function updateMainSceneText(runtime) {
	const textObject = runtime.objects.MainSceneText?.getFirstInstance();
	
	if (!textObject) {
		console.warn("MainSceneText not found in Scene1!");
		return;
	}
	
	// Check if all missions complete
	if (completedMissions.length >= 11) {
		textObject.text = '🎉 All missions complete!\nThe city is transformed!';
	} else if (completedMissions.length >= 1) {
		textObject.text = 'Press "e" on the forum to\ncool it down after each mission';
	} else {
		const missionData = MISSION_DATA[currentMissionNumber];
		if (missionData) {
			textObject.text = missionData.instruction;
		}
	}
	
	console.log("MainSceneText updated:", textObject.text);
}

// Update MissionText display
export function updateMissionText(runtime) {
	// Don't show MissionText if greenhouse is revealed
	if (globalThis.greenhouseRevealed) {
		return;
	}
	
	const missionText = runtime.objects.MissionText?.getFirstInstance();
	const missionTextBox = runtime.objects.MissionTextBox?.getFirstInstance();
	
	if (!missionText || !missionTextBox) {
		return;
	}
	
	// Get next mission data
	const nextMissionNumber = currentMissionNumber;
	const nextMissionData = MISSION_DATA[nextMissionNumber];
	
	if (nextMissionData) {
		// Update text
		missionText.text = `Mission ${nextMissionNumber}\n${nextMissionData.name}`;
		
		// Make visible
		missionText.isVisible = true;
		missionTextBox.isVisible = true;
		
		console.log("MissionText updated:", missionText.text);
	} else {
		// No more missions
		missionText.text = "All Missions\nComplete!";
		missionText.isVisible = true;
		missionTextBox.isVisible = true;
	}
}

// Reset function for game cycle
export function resetProgressionSystem() {
	console.log("=== RESETTING MISSION PROGRESSION ===");
	completedMissions = [];
	currentMissionNumber = 1;
	console.log("Mission progression reset to Mission 1");
}

// Hide MissionText
export function hideMissionText(runtime) {
	const missionText = runtime.objects.MissionText?.getFirstInstance();
	const missionTextBox = runtime.objects.MissionTextBox?.getFirstInstance();
	
	if (missionText) {
		missionText.isVisible = false;
	}
	if (missionTextBox) {
		missionTextBox.isVisible = false;
	}
	
	console.log("MissionText hidden");
}

// Show MissionText
export function showMissionText(runtime) {
	// Don't show MissionText if greenhouse is revealed
	if (globalThis.greenhouseRevealed) {
		return;
	}
	
	const missionText = runtime.objects.MissionText?.getFirstInstance();
	const missionTextBox = runtime.objects.MissionTextBox?.getFirstInstance();
	
	if (missionText) {
		missionText.isVisible = true;
	}
	if (missionTextBox) {
		missionTextBox.isVisible = true;
	}
	
	console.log("MissionText shown");
}

globalThis.getMissionProgress = getProgressionStatus;