import React from 'react';
import { sendMessageToArduino } from './test-message';
import { staticA } from './static-values';

type SettingsProps = {
	toggleBottleState: () => void;
	isBottleStateActive: boolean;
	toggleColorState: () => void;
	currentColor: string;
	isColorStateActive: boolean;
};

export default function Settings({
	toggleBottleState,
	isBottleStateActive,
	toggleColorState,
	currentColor,
	isColorStateActive,
}: SettingsProps) {
	const handleGoHome = () => {
		sendMessageToArduino('goHome');
	};

	const handleSetHome = () => {
		console.log('setHome');
		sendMessageToArduino('HOME');
	};

	const handleToggleBottleState = () => {
		toggleBottleState();
	};

	const sendAbort = () => {
		sendMessageToArduino('ABORT');
  };
  
  const sendCalibrate = () => {
		sendMessageToArduino(
			`CALIBRATE:${staticA[0].angle},${((staticA[0].distance + 30) / 57) * 360}`
		);
	};

	return (
		<div className="flex flex-col justify-center gap-2 border-orange-600 bg-orange-200 rounded-lg w-64">
			<button
				className="m-4 p-2 bg-blue-500 rounded-lg"
				onClick={sendCalibrate}
			>
				Calibrate
			</button>
			<button
				className="m-4 p-2 bg-blue-500 rounded-lg"
				onClick={handleSetHome}
			>
				Set Home
			</button>
			<button className="m-4 p-2 bg-blue-500 rounded-lg" onClick={handleGoHome}>
				Go Home
			</button>
			<button
				className="m-4 p-2 bg-blue-500 rounded-lg"
				onClick={handleToggleBottleState}
			>
				{isBottleStateActive
					? 'Deactivate Bottle Mode'
					: 'Activate Bottle Mode'}
			</button>
			<button
				className={`m-4 p-2 rounded ${
					isColorStateActive
						? currentColor === 'Green'
							? 'bg-green-500'
							: currentColor === 'Blue'
							? 'bg-blue-500'
							: currentColor === 'Yellow'
							? 'bg-yellow-500'
							: currentColor === 'Black'
							? 'bg-black'
							: 'bg-gray-500'
						: 'bg-gray-500'
				}`}
				onClick={toggleColorState}
			>
				Color State: {currentColor}
			</button>
			<button className="m-4 p-2 bg-red-500 rounded-lg" onClick={sendAbort}>
				Abort
			</button>
		</div>
	);
}
