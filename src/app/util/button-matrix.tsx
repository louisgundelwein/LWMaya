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
	isBottleStateActive: boolean;
	updateMatrix: (
		boxId: 'A' | 'B',
		row: number,
		col: number,
		value: boolean
	) => void;
	boxADetails: BoxDetails;
	boxBDetails: BoxDetails;
};

// Typ für die Matrix-Zustände
type MatrixState = 'occupied' | 'empty' | 'selectable';

// Hilfsfunktion zur Initialisierung der Matrix
const createInitialState = (
	rows: number,
	cols: number,
	initialOccupied: boolean[][]
): MatrixState[][] => {
	return initialOccupied.map((row) =>
		row.map((occupied) => (occupied ? 'occupied' : 'empty'))
	);
};

// Hilfsfunktion zur Berechnung der Koordinaten relativ zur unteren linken Ecke
const getSquareCoords = (
	nRows,
	nCols,
	boxHeight,
	boxWidth,
	squareHeight,
	squareWidth,
	leftBottomCornerX,
	leftBottomCornerY
) => {
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

	const coords = [];
	for (let j = 0; j < nRows; j++) {
		const row = [];
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

// Hilfsfunktion zur Berechnung des Winkels relativ zur mittigen Position
const getAngleToCoords = (x, y, middleX) => {
	const adjustedX = x - middleX;
	if (adjustedX === 0) {
		if (y > 0) return 90;
		if (y < 0) return -90;
		console.warn('x and y are both 0... Defaulting to 0 angle');
		return 0;
	}

	const angle = Math.atan2(y, adjustedX) * (180 / Math.PI);
	return angle;
};

// Hilfsfunktion zur Berechnung der Entfernung relativ zur mittigen Position
const getDistanceToCoords = (x, y, middleX) => {
	console.log({ x, y, value: (Math.sqrt(x * x + y * y) / 16) * 360 });
	return (Math.sqrt(x * x + y * y) / 34.5) * 360;
};

// Hilfsfunktion zur Berechnung von Winkel und Entfernung relativ zum Index
const getAngleAndDistanceToIndex = (i, j, squareCoords, middleX) => {
	const [x, y] = squareCoords[i][j];
	return [getAngleToCoords(x, y, middleX), getDistanceToCoords(x, y, middleX)];
};

// ButtonMatrix-Komponente
const ButtonMatrix = ({
	startRow,
	startCol,
	rows = 4,
	cols = 3,
	boxDetails,
	matrix,
	moveBottle,
	selectedBottle,
	setSelectedBottle,
	isBottleStateActive,
	updateMatrix,
	boxADetails,
	boxBDetails,
}) => {
	const [matrixState, setMatrixState] = useState(
		createInitialState(rows, cols, matrix)
	);

	useEffect(() => {
		if (selectedBottle) {
			setMatrixState((prevMatrix) =>
				prevMatrix.map((row) =>
					row.map((state) =>
						state === 'empty' || state === 'selectable' ? 'selectable' : state
					)
				)
			);
		} else {
			setMatrixState(createInitialState(rows, cols, matrix));
		}
	}, [selectedBottle, matrix, rows, cols]);

	const handleClick = (localRow, localCol) => {
		const currentState = matrixState[localRow][localCol];

		if (isBottleStateActive) {
			updateMatrix(
				boxDetails.boxId,
				localRow,
				localCol,
				currentState === 'empty'
			);
		} else {
			if (currentState === 'occupied') {
				setSelectedBottle({
					boxId: boxDetails.boxId,
					row: localRow,
					col: localCol,
				});
			} else if (currentState === 'selectable' && selectedBottle) {
				const {
					row: selectedRow,
					col: selectedCol,
					boxId: fromBoxId,
				} = selectedBottle;

				const fromBoxCoords = getSquareCoords(
					boxDetails.rows,
					boxDetails.cols,
					boxDetails.height,
					boxDetails.width,
					boxDetails.segmentHeight,
					boxDetails.segmentWidth,
					fromBoxId === 'A' ? boxADetails.x : boxBDetails.x,
					fromBoxId === 'A' ? boxADetails.y : boxBDetails.y
				);

				const toBoxCoords = getSquareCoords(
					boxDetails.rows,
					boxDetails.cols,
					boxDetails.height,
					boxDetails.width,
					boxDetails.segmentHeight,
					boxDetails.segmentWidth,
					boxDetails.x,
					boxDetails.y
				);

				const middleX =
					(boxADetails.x +
						boxADetails.width / 2 +
						boxBDetails.x +
						boxBDetails.width / 2) /
					2;

				const [angleXYFrom, distanceFrom] = getAngleAndDistanceToIndex(
					selectedRow,
					selectedCol,
					fromBoxCoords,
					middleX
				);
				const [angleXYTo, distanceTo] = getAngleAndDistanceToIndex(
					localRow,
					localCol,
					toBoxCoords,
					middleX
				);

				// Sende die Position der aktuellen und der neuen Flaschenposition an den Arduino
				const posMessage = `POS:${angleXYFrom},${distanceFrom},${angleXYTo},${distanceTo},`;
				console.log({ posMessage });
				sendMessageToArduino(posMessage);

				moveBottle(
					fromBoxId,
					boxDetails.boxId,
					selectedRow,
					selectedCol,
					localRow,
					localCol
				);

				setSelectedBottle(null);
			}
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
