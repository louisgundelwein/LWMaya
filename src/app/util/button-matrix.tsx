import React, { useState } from 'react';
import { sendMessageToArduino } from './test-message';

// Typen für die Komponente
interface ButtonMatrixProps {
	startRow: number;
	startCol: number;
	rows?: number;
	cols?: number;
}

// Typ für die Matrix-Zustände
type MatrixState = boolean[][];

// Hilfsfunktion zur Initialisierung der Matrix
const createInitialState = (rows: number, cols: number): MatrixState => {
	return Array(rows)
		.fill(null)
		.map(() => Array(cols).fill(false));
};

// ButtonMatrix-Komponente
const ButtonMatrix: React.FC<ButtonMatrixProps> = ({
	startRow,
	startCol,
	rows = 4,
	cols = 3,
}) => {
	const [matrix, setMatrix] = useState<MatrixState>(
		createInitialState(rows, cols)
	);

	// Button-Zustand umschalten und nur die Änderung senden
	const toggleButtonState = (localRow: number, localCol: number) => {
		const updatedStates = matrix.map((row, rIndex) =>
			row.map((col, cIndex) => {
				if (rIndex === localRow && cIndex === localCol) {
					return !col;
				}
				return col;
			})
		);
		setMatrix(updatedStates);

		// Sende nur den einzelnen aktualisierten Button-Status an den Arduino
		const globalRow = startRow + localRow;
		const globalCol = startCol + localCol;
		const value = updatedStates[localRow][localCol] ? 1 : 0;
		const ledMessage = `LED:${globalRow},${globalCol},${value}`;
		console.log('Sending to Arduino:', ledMessage);
		sendMessageToArduino(ledMessage);

		// Generiere zufällige Winkel- und Distanzwerte
		const angle = Math.floor(Math.random() * 360);
		const distance = Math.floor(Math.random() * 100);
		const posMessage = `POS:${angle},${distance}`;
		console.log('Sending to Arduino:', posMessage);
		sendMessageToArduino(posMessage);
	};

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${cols}, 50px)`,
				gap: '10px',
			}}
		>
			{matrix.map((row, rowIndex) =>
				row.map((isActive, colIndex) => (
					<button
						key={`matrix-${rowIndex}-${colIndex}`}
						style={{
							width: '50px',
							height: '50px',
							backgroundColor: isActive ? 'green' : 'grey',
						}}
						onClick={() => toggleButtonState(rowIndex, colIndex)}
					>
						{isActive ? 'On' : 'Off'}
					</button>
				))
			)}
		</div>
	);
};

export default ButtonMatrix;
