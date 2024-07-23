'use client';
import React from 'react';
import { sendMessageToArduino } from './test-message';

const Controls: React.FC = () => {
	const handleAngleChange = (direction: 'left' | 'right', amount: number) => {
		const angleChange = direction === 'left' ? amount : -amount;
		const angleMessage = `ANGLE:${angleChange}`;
		sendMessageToArduino(angleMessage);
	};

	const handleDistanceChange = (
		direction: 'increase' | 'decrease',
		amount: number
	) => {
		const distanceChange = direction === 'increase' ? amount : -amount;
		const distanceMessage = `DISTANCE:${distanceChange}`;
		sendMessageToArduino(distanceMessage);
	};

	const handleHeightChange = (direction: 'up' | 'down', amount: number) => {
		const heightChange = direction === 'up' ? amount : -amount;
		const heightMessage = `HEIGHT:${heightChange}`;
		sendMessageToArduino(heightMessage);
	};

	const handleGripperChange = (action: 'open' | 'close') => {
		const gripperMessage = action === 'open' ? 'GRIPPER:OPEN' : 'GRIPPER:CLOSE';
		sendMessageToArduino(gripperMessage);
	};

	const handleDemo = () => {
		sendMessageToArduino('DEMO:START');
	};

	return (
		<div className="flex flex-row justify-center w-full">
			<div className="flex flex-row justify-between w-[60%]">
				<div className="flex flex-col justify-center">
					<div className="flex flex-col items-center gap-2">
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleHeightChange('up', 3100)}
						>
							↑↑
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleHeightChange('up', 100)}
						>
							↑
						</button>

						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleHeightChange('down', 100)}
						>
							↓
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleHeightChange('down', 3100)}
						>
							↓↓
						</button>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row justify-center ">
						<div className="flex flex-col justify-center gap-2">
							<button
								className="bg-orange-400 rounded-lg w-14 h-8"
								onClick={() => handleDistanceChange('increase', 3000)}
							>
								↑↑
							</button>
							<button
								className="bg-orange-400 rounded-lg w-14 h-8"
								onClick={() => handleDistanceChange('increase', 100)}
							>
								↑
							</button>
						</div>
					</div>

					<div className="flex flex-row justify-center p-2 gap-2">
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleAngleChange('left', 40)}
						>
							{'<<'}
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleAngleChange('left', 1)}
						>
							{'<'}
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={handleDemo}
						>
							Demo
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleAngleChange('right', 1)}
						>
							{'>'}
						</button>
						<button
							className="bg-orange-400 rounded-lg w-14 h-8"
							onClick={() => handleAngleChange('right', 10)}
						>
							{'>>'}
						</button>
					</div>
					<div className="flex flex-row justify-center">
						<div className="flex flex-col justify-center gap-2">
							<button
								className="bg-orange-400 rounded-lg w-14 h-8"
								onClick={() => handleDistanceChange('decrease', 100)}
							>
								↓
							</button>
							<button
								className="bg-orange-400 rounded-lg w-14 h-8"
								onClick={() => handleDistanceChange('decrease', 2800)}
							>
								↓↓
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center gap-10">
					<button
						className="bg-orange-400 rounded-lg w-14 h-8"
						onClick={() => handleGripperChange('open')}
					>
						Open
					</button>
					<button
						className="bg-orange-400 rounded-lg w-14 h-8"
						onClick={() => handleGripperChange('close')}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Controls;
