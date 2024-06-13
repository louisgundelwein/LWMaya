'use client';
import React, { useState } from 'react';
import ButtonMatrix, { BoxDetails } from './util/button-matrix';

export default function Home() {
	const boxADetails: BoxDetails = {
		boxId: 'A',
		x: -250,
		y: 200,
		z: 0,
		width: 150,
		height: 200,
		depth: 100,
		rows: 4,
		cols: 3,
		segmentWidth: 50,
		segmentHeight: 50,
		segmentDepth: 50,
	};

	const boxBDetails: BoxDetails = {
		boxId: 'B',
		x: 100,
		y: 200,
		z: 0,
		width: 150,
		height: 200,
		depth: 100,
		rows: 4,
		cols: 3,
		segmentWidth: 50,
		segmentHeight: 50,
		segmentDepth: 50,
	};

	const initialOccupiedA = [
		[true, false, false],
		[false, false, false],
		[false, true, false],
		[false, false, false],
	];

	const initialOccupiedB = [
		[false, false, true],
		[false, false, false],
		[false, false, false],
		[true, false, false],
	];

	const [matrixA, setMatrixA] = useState(initialOccupiedA);
	const [matrixB, setMatrixB] = useState(initialOccupiedB);
	const [selectedBottle, setSelectedBottle] = useState<{
		boxId: 'A' | 'B';
		row: number;
		col: number;
	} | null>(null);

	const moveBottle = (
		fromBoxId: 'A' | 'B',
		toBoxId: 'A' | 'B',
		fromRow: number,
		fromCol: number,
		toRow: number,
		toCol: number
	) => {
		console.log(
			`Moving bottle from (${fromRow}, ${fromCol}) in box ${fromBoxId} to (${toRow}, ${toCol}) in box ${toBoxId}`
		);

		if (fromBoxId === 'A') {
			setMatrixA((prevMatrix) =>
				prevMatrix.map((row, rIndex) =>
					row.map((col, cIndex) => {
						if (rIndex === fromRow && cIndex === fromCol) {
							return false;
						}
						return col;
					})
				)
			);
		} else if (fromBoxId === 'B') {
			setMatrixB((prevMatrix) =>
				prevMatrix.map((row, rIndex) =>
					row.map((col, cIndex) => {
						if (rIndex === fromRow && cIndex === fromCol) {
							return false;
						}
						return col;
					})
				)
			);
		}

		if (toBoxId === 'A') {
			setMatrixA((prevMatrix) =>
				prevMatrix.map((row, rIndex) =>
					row.map((col, cIndex) => {
						if (rIndex === toRow && cIndex === toCol) {
							return true;
						}
						return col;
					})
				)
			);
		} else if (toBoxId === 'B') {
			setMatrixB((prevMatrix) =>
				prevMatrix.map((row, rIndex) =>
					row.map((col, cIndex) => {
						if (rIndex === toRow && cIndex === toCol) {
							return true;
						}
						return col;
					})
				)
			);
		}

		// Log the current state of both matrices after the move
		console.log('State of matrixA after move:', matrixA);
		console.log('State of matrixB after move:', matrixB);

		setSelectedBottle(null);
	};

	return (
		<div className="flex flex-col justify-center gap-10 bg-gray-600">
			<div className="flex flex-row justify-center gap-20 p-24">
				<ButtonMatrix
					startRow={2}
					startCol={2}
					rows={4}
					cols={3}
					boxDetails={boxADetails}
					matrix={matrixA}
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
				/>
				<ButtonMatrix
					startRow={2}
					startCol={7}
					rows={4}
					cols={3}
					boxDetails={boxBDetails}
					matrix={matrixB}
					moveBottle={moveBottle}
					selectedBottle={selectedBottle}
					setSelectedBottle={setSelectedBottle}
				/>
			</div>
		</div>
	);
}
