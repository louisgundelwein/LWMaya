'use client';
import React, { useState } from 'react';
import ButtonMatrix from './util/button-matrix';
import Controls from './util/controls';
import Settings from './util/settings';
import MovementControls from './util/movement-controls'; // Import the new component
import { sendMessageToArduino } from './util/test-message';
import { Color, staticA, staticB, StaticValues } from './util/static-values';

const colors: (Color | 'Off')[] = ['Green', 'Blue', 'Yellow', 'Black', 'Off']; // Add more colors as needed

export default function Home() {
	const [matrixA, setMatrixA] = useState<StaticValues[]>(staticA);
	const [matrixB, setMatrixB] = useState<StaticValues[]>(staticB);
	const [selectedBottle, setSelectedBottle] = useState<{
		boxId: 'A' | 'B';
		index: number;
	} | null>(null);
	const [isBottleStateActive, setIsBottleStateActive] = useState(false);
	const [colorState, setColorState] = useState<Color | 'Off'>('Off');
	const [isColorStateActive, setIsColorStateActive] = useState(false);

	const toggleColorState = () => {
		const nextColorIndex = (colors.indexOf(colorState) + 1) % colors.length;
		const nextColor = colors[nextColorIndex];
		setColorState(nextColor);
		setIsColorStateActive(nextColor !== 'Off');
	};

	const moveBottle = (
		fromBoxId: 'A' | 'B',
		toBoxId: 'A' | 'B',
		fromIndex: number,
		toIndex: number
	) => {
		if (fromBoxId === 'A' && toBoxId === 'A') {
			setMatrixA((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[toIndex] = {
					...updatedMatrix[toIndex],
					bottle: true,
					color: prevMatrix[fromIndex].color,
				};
				updatedMatrix[fromIndex] = {
					...updatedMatrix[fromIndex],
					bottle: false,
					color: 'Black',
				};
				return updatedMatrix;
			});
		} else if (fromBoxId === 'B' && toBoxId === 'B') {
			setMatrixB((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[toIndex] = {
					...updatedMatrix[toIndex],
					bottle: true,
					color: prevMatrix[fromIndex].color,
				};
				updatedMatrix[fromIndex] = {
					...updatedMatrix[fromIndex],
					bottle: false,
					color: 'Black',
				};
				return updatedMatrix;
			});
		} else if (fromBoxId === 'A' && toBoxId === 'B') {
			setMatrixA((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				return updatedMatrix.map((item, index) =>
					index === fromIndex
						? { ...item, bottle: false, color: 'Black' }
						: item
				);
			});
			setMatrixB((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[toIndex] = {
					...updatedMatrix[toIndex],
					bottle: true,
					color: matrixA[fromIndex].color,
				};
				return updatedMatrix;
			});
		} else if (fromBoxId === 'B' && toBoxId === 'A') {
			setMatrixB((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				return updatedMatrix.map((item, index) =>
					index === fromIndex
						? { ...item, bottle: false, color: 'Black' }
						: item
				);
			});
			setMatrixA((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[toIndex] = {
					...updatedMatrix[toIndex],
					bottle: true,
					color: matrixB[fromIndex].color,
				};
				return updatedMatrix;
			});
		}
	};

	const toggleBottleState = () => {
		setIsBottleStateActive(!isBottleStateActive);
	};

	const updateMatrix = (boxId: 'A' | 'B', index: number, value: boolean) => {
		if (boxId === 'A') {
			setMatrixA((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[index] = { ...updatedMatrix[index], bottle: value };
				return updatedMatrix;
			});
		} else if (boxId === 'B') {
			setMatrixB((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[index] = { ...updatedMatrix[index], bottle: value };
				return updatedMatrix;
			});
		}
	};

	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const clearBoxes = async (
		startMatrix: StaticValues[],
		startMatrixName: 'A' | 'B',
		endMatrix: StaticValues[],
		endMatrixName: 'A' | 'B'
	) => {
		let nextFreeIndex = 0;
		for (let i = 0; i < startMatrix.length; i++) {
			if (startMatrix[i].bottle) {
				while (
					nextFreeIndex < endMatrix.length &&
					endMatrix[nextFreeIndex].bottle
				) {
					nextFreeIndex++;
				}
				if (nextFreeIndex < endMatrix.length) {
					const fromValue = startMatrix[i];
					const toValue = endMatrix[nextFreeIndex];
					const posMessage = `POS:${fromValue.angle},${
						((fromValue.distance + 30) / 57) * 360
					},${toValue.angle},${((toValue.distance + 30) / 57) * 360}`;
					sendMessageToArduino(posMessage);
					console.log({ startMatrixName, i, endMatrixName, nextFreeIndex });
					moveBottle(startMatrixName, endMatrixName, i, nextFreeIndex);
					nextFreeIndex++;
					await delay(500); // Verzögerung von einer halben Sekunde
				}
			}
		}
	};

	const clearBoxesByColor = async (
		startMatrix: StaticValues[],
		startMatrixName: 'A' | 'B',
		endMatrix: StaticValues[],
		endMatrixName: 'A' | 'B',
		color: string
	) => {
		let nextFreeIndex = 0;
		for (let i = 0; i < startMatrix.length; i++) {
			if (startMatrix[i].bottle && startMatrix[i].color === color) {
				while (
					nextFreeIndex < endMatrix.length &&
					endMatrix[nextFreeIndex].bottle
				) {
					nextFreeIndex++;
				}
				if (nextFreeIndex < endMatrix.length) {
					const fromValue = startMatrix[i];
					const toValue = endMatrix[nextFreeIndex];
					const posMessage = `POS:${fromValue.angle},${
						((fromValue.distance + 30) / 57) * 360
					},${toValue.angle},${((toValue.distance + 30) / 57) * 360}`;
					sendMessageToArduino(posMessage);
					console.log({ startMatrixName, i, endMatrixName, nextFreeIndex, posMessage });
					moveBottle(startMatrixName, endMatrixName, i, nextFreeIndex);
					nextFreeIndex++;
					await delay(500); // Verzögerung von einer halben Sekunde
				}
			}
		}
	};

	const updateColor = (boxId: 'A' | 'B', index: number, color: Color) => {
		if (boxId === 'A') {
			setMatrixA((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[index] = { ...updatedMatrix[index], color };
				return updatedMatrix;
			});
		} else if (boxId === 'B') {
			setMatrixB((prevMatrix) => {
				const updatedMatrix = [...prevMatrix];
				updatedMatrix[index] = { ...updatedMatrix[index], color };
				return updatedMatrix;
			});
		}
	};

	return (
		<div className="flex flex-col justify-center gap-10 bg-gray-600 h-screen">
			<div className="flex flex-row justify-center gap-10 p-12">
				<Settings
					toggleBottleState={toggleBottleState}
					isBottleStateActive={isBottleStateActive}
					toggleColorState={toggleColorState}
					currentColor={colorState}
					isColorStateActive={isColorStateActive}
				/>
				<ButtonMatrix
					staticValues={matrixA}
					boxId="A"
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
					isBottleStateActive={isBottleStateActive}
					isColorStateActive={isColorStateActive}
					currentColor={colorState}
					updateMatrix={updateMatrix}
					updateColor={updateColor}
					matrixA={matrixA}
					matrixB={matrixB}
					clearBoxes={clearBoxes}
					clearBoxesByColor={clearBoxesByColor}
				/>
				<ButtonMatrix
					staticValues={matrixB}
					boxId="B"
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
					isBottleStateActive={isBottleStateActive}
					isColorStateActive={isColorStateActive}
					currentColor={colorState}
					updateMatrix={updateMatrix}
					updateColor={updateColor}
					matrixA={matrixA}
					matrixB={matrixB}
					clearBoxes={clearBoxes}
					clearBoxesByColor={clearBoxesByColor}
				/>
			</div>
			<MovementControls />
			<Controls />
		</div>
	);
}
