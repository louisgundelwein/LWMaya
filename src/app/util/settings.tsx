import React, { useState } from 'react';
import { sendMessageToArduino } from './test-message';

export default function Settings({
	toggleBottleState,
	isBottleStateActive,
	startSearch,
}) {
	const handleGoHome = () => {
		sendMessageToArduino('goHome');
	};

	const handleSetHome = () => {
		sendMessageToArduino('HOME');
	};

	const handleToggleBottleState = () => {
		toggleBottleState();
	};

	const handleStartSearch = () => {
		startSearch();
	};

	return (
		<div className="flex flex-col justify-center gap-10 p-10 border-orange-600 bg-orange-200 rounded-lg w-[15%]">
			<button onClick={handleSetHome}>Set Home</button>
			<button onClick={handleGoHome}>Go Home</button>
			<button onClick={handleToggleBottleState}>
				{isBottleStateActive
					? 'Deactivate Bottle Mode'
					: 'Activate Bottle Mode'}
			</button>
			<button onClick={handleStartSearch}>Start Search</button>
		</div>
	);
}
