'use client';
import React, { useState, useEffect } from 'react';
import { sendMessageToArduino } from './test-message';
import { StaticValues } from './static-values';

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
	updateMatrix: (boxId: 'A' | 'B', index: number, value: boolean) => void;
	matrixA: StaticValues[];
	matrixB: StaticValues[];
};

type MatrixState = 'occupied' | 'empty' | 'selectable';

const ButtonMatrix: React.FC<ButtonMatrixProps> = ({
	staticValues,
	boxId,
	moveBottle,
	selectedBottle,
	setSelectedBottle,
	isBottleStateActive,
	updateMatrix,
	matrixA,
	matrixB,
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

	return (
		<div className="p-4 rounded-2xl bg-red-500">
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(3, 50px)`,
					gap: '10px',
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
	);
};

export default ButtonMatrix;
