'use client';
import React, { useEffect } from 'react';
import { sendMessageToArduino } from './test-message';

const MovementControls: React.FC = () => {
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'w':
				console.log('LOL');
				sendMessageToArduino('SPEED:2,3500');
				break;
			case 's':
				sendMessageToArduino('SPEED:2,-3500');
				break;
			case 'a':
				sendMessageToArduino('SPEED:1,50');
				break;
			case 'd':
				sendMessageToArduino('SPEED:1,-50');
				break;
			case 'q':
				sendMessageToArduino('SPEED:3,4000');
				break;
			case 'e':
				sendMessageToArduino('SPEED:3,-4000');
				break;
			case 'c':
				sendMessageToArduino('GRIPPER:CLOSE');
				break;
			case 'o':
				sendMessageToArduino('GRIPPER:OPEN');
				break;
			default:
				break;
		}
	};

	const handleKeyUp = (event: KeyboardEvent) => {
		switch (event.key) {
      case 'w':
        sendMessageToArduino('SPEED:2,0');
				break;
			case 's':
				sendMessageToArduino('SPEED:2,0');
				break;
      case 'a':
        sendMessageToArduino('SPEED:1,0');
				break;
			case 'd':
				sendMessageToArduino('SPEED:1,0');
				break;
      case 'q':
        sendMessageToArduino('SPEED:3,0');
				break;
			case 'e':
				sendMessageToArduino('SPEED:3,0');
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return (
		<div className="flex flex-row justify-center">
			Click here and use W/A/S/D/Q/E to move the robot and C/O to control the gripper.
		</div>
	);
};

export default MovementControls;
