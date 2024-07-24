'use client';
import React, { useState, useEffect } from 'react';
import { sendMessageToArduino } from './test-message';
import { Color, StaticValues } from './static-values';

type ButtonMatrixProps = {
	staticValues: StaticValues[];
	boxId: 'A' | 'B';
	moveBottle: (
		fromBoxId: 'A' | 'B',
		toBoxId: 'A' | 'B',
		fromIndex: number,
		toIndex: number
	) => void;
	selectedBottle: { boxId: 'A' | 'B'; index: number } | null;
	setSelectedBottle: React.Dispatch<
		React.SetStateAction<{ boxId: 'A' | 'B'; index: number } | null>
	>;
	isBottleStateActive: boolean;
	isColorStateActive: boolean;
	currentColor: Color | 'Off';
	updateMatrix: (boxId: 'A' | 'B', index: number, value: boolean) => void;
	updateColor: (boxId: 'A' | 'B', index: number, color: Color) => void;
	matrixA: StaticValues[];
	matrixB: StaticValues[];
	clearBoxes: (
		startMatrix: StaticValues[],
		startMatrixName: 'A' | 'B',
		endMatrix: StaticValues[],
		endMatrixName: 'A' | 'B'
	) => void;
	clearBoxesByColor: (
		startMatrix: StaticValues[],
		startMatrixName: 'A' | 'B',
		endMatrix: StaticValues[],
		endMatrixName: 'A' | 'B',
		color: string
	) => void;
};

type MatrixState = 'occupied' | 'empty' | 'selectable';

const ButtonMatrix: React.FC<ButtonMatrixProps> = ({
	staticValues,
	boxId,
	moveBottle,
	selectedBottle,
	setSelectedBottle,
	isBottleStateActive,
	isColorStateActive,
	currentColor,
	updateMatrix,
	updateColor,
	matrixA,
	matrixB,
	clearBoxes,
	clearBoxesByColor,
}) => {
	const [matrixState, setMatrixState] = useState<MatrixState[]>([]);

	useEffect(() => {
		const initialState = staticValues.map((value) =>
			value.bottle ? 'occupied' : 'empty'
		);
		setMatrixState(initialState);
	}, [staticValues]);

	useEffect(() => {
		if (selectedBottle) {
			setMatrixState((prevMatrix) =>
				prevMatrix.map((state) => (state === 'empty' ? 'selectable' : state))
			);
		} else {
			setMatrixState(
				staticValues.map((value) => (value.bottle ? 'occupied' : 'empty'))
			);
		}
	}, [selectedBottle, staticValues]);

	const handleClick = (index: number) => {
		const currentState = matrixState[index];

		if (isBottleStateActive) {
			updateMatrix(boxId, index, currentState === 'empty');
		} else if (isColorStateActive && currentState === 'occupied' && currentColor !== 'Off') {
			updateColor(boxId, index, currentColor);
		} else {
			if (currentState === 'occupied') {
				setSelectedBottle({ boxId, index });
			} else if (currentState === 'selectable' && selectedBottle) {
				const fromIndex = selectedBottle.index;
				const toIndex = index;

				// Get the correct values from matrix A or B
				const fromValue =
					selectedBottle.boxId === 'A'
						? matrixA[fromIndex]
						: matrixB[fromIndex];
				const toValue = boxId === 'A' ? matrixA[toIndex] : matrixB[toIndex];

				// Send the position of the current and new bottle position to the Arduino
				const posMessage = `POS:${fromValue.angle},${
					((fromValue.distance + 30) / 57) * 360
				},${toValue.angle},${((toValue.distance + 30) / 57) * 360}`;
				console.log({ posMessage, fromValue, toValue });
				sendMessageToArduino(posMessage);

				moveBottle(selectedBottle.boxId, boxId, fromIndex, toIndex);
				setSelectedBottle(null);
			}
		}
	};

	const colors: Color[] = ['Black', 'Blue', 'Yellow', 'Green', 'Red']; // example colors

	return (
		<div className=" flex flex-row p-4 rounded-2xl bg-red-400 justify-center">
			<div className="flex flex-col justify-between">
				<div className="flex flex-row justify-center">
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: `repeat(3, 50px)`,
							gap: '30px',
						}}
					>
						{staticValues.map((value, index) => (
							<button
								key={index}
								style={{
									width: '50px',
									height: '50px',
									backgroundColor:
										matrixState[index] === 'occupied'
											? value.color.toLowerCase()
											: matrixState[index] === 'selectable'
											? 'lightgreen'
											: 'grey',
								}}
								onClick={() => handleClick(index)}
							>
								{matrixState[index] === 'occupied'
									? 'Bottle'
									: matrixState[index] === 'selectable'
									? 'Move'
									: 'Empty'}
							</button>
						))}
					</div>
				</div>

				<div className="flex gap-1">
					<button
						className="mt-4 p-2 bg-orange-500 rounded-lg"
						onClick={() =>
							clearBoxes(
								boxId === 'A' ? matrixA : matrixB,
								boxId === 'A' ? 'A' : 'B',
								boxId === 'A' ? matrixB : matrixA,
								boxId === 'A' ? 'B' : 'A'
							)
						}
					>
						Clear
					</button>
					{colors.map((color) => (
						<button
							key={color}
							className={`mt-4 p-2 bg-${color.toLocaleLowerCase()}${(color === 'Black') ? '' : '-500'} rounded-lg`}
							onClick={() =>
								clearBoxesByColor(
									boxId === 'A' ? matrixA : matrixB,
									boxId === 'A' ? 'A' : 'B',
									boxId === 'A' ? matrixB : matrixA,
									boxId === 'A' ? 'B' : 'A',
									color
								)
							}
						>
							{color}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default ButtonMatrix;
