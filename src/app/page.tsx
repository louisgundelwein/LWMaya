'use client';
import React, { useState } from 'react';
import ButtonMatrix from './util/button-matrix';
import Controls from './util/controls';
import Settings from './util/settings';
import MovementControls from './util/movement-controls'; // Import the new component
import { sendMessageToArduino } from './util/test-message';
import { staticA, staticB, StaticValues } from './util/static-values';

export default function Home() {
	const [matrixA, setMatrixA] = useState<StaticValues[]>(staticA);
	const [matrixB, setMatrixB] = useState<StaticValues[]>(staticB);
	const [selectedBottle, setSelectedBottle] = useState<{
		boxId: 'A' | 'B';
		index: number;
	} | null>(null);
	const [isBottleStateActive, setIsBottleStateActive] = useState(false);

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

	return (
		<div className="flex flex-col justify-center gap-10 bg-gray-600 h-screen">
			<div className="flex flex-row justify-center gap-20 p-24">
				<Settings
					toggleBottleState={toggleBottleState}
					isBottleStateActive={isBottleStateActive}
					startSearch={async () => {
						try {
							await sendMessageToArduino('SEARCH');
						} catch (error) {
							console.error('Failed to start search:', error);
						}
					}}
				/>
				<ButtonMatrix
					staticValues={matrixA}
					boxId="A"
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
					isBottleStateActive={isBottleStateActive}
					updateMatrix={updateMatrix}
					matrixA={matrixA}
					matrixB={matrixB}
				/>
				<ButtonMatrix
					staticValues={matrixB}
					boxId="B"
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
					isBottleStateActive={isBottleStateActive}
					updateMatrix={updateMatrix}
					matrixA={matrixA}
					matrixB={matrixB}
				/>
			</div>
			<MovementControls />
			<Controls />
		</div>
	);
}
