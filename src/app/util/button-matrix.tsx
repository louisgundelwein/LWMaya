'use client';
import React, { useState, useEffect } from 'react';
import { sendMessageToArduino } from './test-message';

// Typen für die Komponente
export type BoxDetails = {
	boxId: 'A' | 'B';
	x: number;
	y: number;
	z: number;
	width: number;
	height: number;
	depth: number;
	rows: number;
	cols: number;
	segmentWidth: number;
	segmentHeight: number;
	segmentDepth: number;
};

type ButtonMatrixProps = {
	startRow: number;
	startCol: number;
	rows?: number;
	cols?: number;
	boxDetails: BoxDetails; // Prop für Box-Details
	matrix: boolean[][]; // Aktuelle belegte Positionen
	moveBottle: (
		fromBoxId: 'A' | 'B',
		toBoxId: 'A' | 'B',
		fromRow: number,
		fromCol: number,
		toRow: number,
		toCol: number
	) => void; // Funktion zum Bewegen der Flaschen zwischen den Kästen
	selectedBottle: { boxId: 'A' | 'B'; row: number; col: number } | null;
	setSelectedBottle: React.Dispatch<
		React.SetStateAction<{ boxId: 'A' | 'B'; row: number; col: number } | null>
	>;
};

// Typ für die Matrix-Zustände
type MatrixState = 'occupied' | 'empty' | 'selectable';

// Hilfsfunktion zur Initialisierung der Matrix
const createInitialState = (
	rows: number,
	cols: number,
	initialOccupied: boolean[][]
): MatrixState[][] => {
	return initialOccupied.map((row, rIndex) =>
		row.map((occupied, cIndex) => (occupied ? 'occupied' : 'empty'))
	);
};

// Hilfsfunktion zur Berechnung der Koordinaten
const getSquareCoords = (
	nRows: number,
	nCols: number,
	boxHeight: number,
	boxWidth: number,
	squareHeight: number,
	squareWidth: number,
	leftBottomCornerX: number,
	leftBottomCornerY: number
): [number, number][][] => {
	const thicknessSpaceBetweenSquaresVert =
		(boxHeight - squareHeight * nRows) / (nRows + 1);
	const thicknessSpaceBetweenSquaresHor =
		(boxWidth - squareWidth * nCols) / (nCols + 1);

	if (thicknessSpaceBetweenSquaresVert < 0) {
		throw new Error(
			'Square height + space between squares is greater than the height of the box'
		);
	}

	if (thicknessSpaceBetweenSquaresHor < 0) {
		throw new Error(
			'Square width + space between squares is greater than the width of the box'
		);
	}

	const coords: [number, number][][] = [];
	for (let j = 0; j < nRows; j++) {
		const row: [number, number][] = [];
		for (let i = 0; i < nCols; i++) {
			const x =
				leftBottomCornerX +
				thicknessSpaceBetweenSquaresHor +
				i * (squareWidth + thicknessSpaceBetweenSquaresHor) +
				squareWidth / 2;
			const y =
				leftBottomCornerY +
				thicknessSpaceBetweenSquaresVert +
				j * (squareHeight + thicknessSpaceBetweenSquaresVert) +
				squareHeight / 2;
			row.push([x, y]);
		}
		coords.push(row);
	}
	return coords;
};

const getAngleToCoords = (x: number, y: number): number => {
	if (x === 0) {
		if (y > 0) return 90;
		if (y < 0) return 270;
		console.warn('x and y are both 0... Defaulting to 0 angle');
		return 0;
	}

	const angle = Math.atan2(y, x) * (180 / Math.PI); // Convert radians to degrees
	return (angle + 360) % 360; // Normalize angle to be between 0 and 360
};

const getDistanceToCoords = (x: number, y: number): number => {
	return Math.sqrt(x * x + y * y);
};

const getAngleAndDistanceToIndex = (
	i: number,
	j: number,
	squareCoords: [number, number][][]
): [number, number] => {
	const [x, y] = squareCoords[i][j];
	return [getAngleToCoords(x, y), getDistanceToCoords(x, y)];
};

// ButtonMatrix-Komponente
const ButtonMatrix: React.FC<ButtonMatrixProps> = ({
	startRow,
	startCol,
	rows = 4,
	cols = 3,
	boxDetails,
	matrix,
	moveBottle,
	selectedBottle,
	setSelectedBottle,
}) => {
	const [matrixState, setMatrixState] = useState<MatrixState[][]>(
		createInitialState(rows, cols, matrix)
	);

	useEffect(() => {
		console.log(`Selected bottle: ${JSON.stringify(selectedBottle)}`);
		if (selectedBottle) {
			setMatrixState((prevMatrix) =>
				prevMatrix.map((row) =>
					row.map((state, colIndex) =>
						state === 'empty' || state === 'selectable' ? 'selectable' : state
					)
				)
			);
		} else {
			setMatrixState(createInitialState(rows, cols, matrix));
		}
	}, [selectedBottle, matrix, rows, cols]);

	const handleClick = (localRow: number, localCol: number) => {
		const currentState = matrixState[localRow][localCol];
		console.log(
			`Clicked position: (${localRow}, ${localCol}) with state: ${currentState}`
		);

		// Log the entire matrix state
		console.log(
			'Current matrix state:',
			matrixState.map((row, rowIndex) =>
				row.map((state, colIndex) => `(${rowIndex}, ${colIndex}): ${state}`)
			)
		);

		if (currentState === 'occupied') {
			setSelectedBottle({
				boxId: boxDetails.boxId,
				row: localRow,
				col: localCol,
			});
			console.log(
				`Selected bottle set to: (${localRow}, ${localCol}) in box ${boxDetails.boxId}`
			);
		} else if (currentState === 'selectable' && selectedBottle) {
			const {
				row: selectedRow,
				col: selectedCol,
				boxId: fromBoxId,
			} = selectedBottle;

			const squareCoords = getSquareCoords(
				boxDetails.rows,
				boxDetails.cols,
				boxDetails.height,
				boxDetails.width,
				boxDetails.segmentHeight,
				boxDetails.segmentWidth,
				boxDetails.x,
				boxDetails.y
			);

			const [angleXY, distance] = getAngleAndDistanceToIndex(
				localRow,
				localCol,
				squareCoords
			);

			console.log(`Angle: ${angleXY}, Distance: ${distance}`);

			// Sende die Position des Knopfs an den Arduino
			const posMessage = `POS:${angleXY},${distance}`;
			console.log('Sending to Arduino:', posMessage);
			sendMessageToArduino(posMessage);

			// Flasche bewegen
			moveBottle(
				fromBoxId,
				boxDetails.boxId,
				selectedRow,
				selectedCol,
				localRow,
				localCol
			);

			console.log(
				`Bottle moved from (${selectedRow}, ${selectedCol}) in box ${fromBoxId} to (${localRow}, ${localCol}) in box ${boxDetails.boxId}`
			);

			setSelectedBottle(null);
		}
	};

	return (
		<div className="p-4 rounded-2xl bg-red-500">
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${cols}, 50px)`,
					gap: '10px',
				}}
			>
				{matrixState.map((row, rowIndex) =>
					row.map((state, colIndex) => (
						<button
							key={`matrix-${rowIndex}-${colIndex}`}
							style={{
								width: '50px',
								height: '50px',
								backgroundColor:
									state === 'occupied'
										? 'blue'
										: state === 'selectable'
										? 'lightgreen'
										: 'grey',
							}}
							onClick={() => handleClick(rowIndex, colIndex)}
						>
							{state === 'occupied'
								? 'Bottle'
								: state === 'selectable'
								? 'Move'
								: 'Empty'}
						</button>
					))
				)}
			</div>
		</div>
	);
};

export default ButtonMatrix;
