'use client';
import React, { useState, useEffect } from 'react';
import ButtonMatrix, { BoxDetails } from './util/button-matrix';
import Controls from './util/controls';
import Settings from './util/settings';
import { sendMessageToArduino } from './util/test-message';
import io from 'socket.io-client';

const boxADetails: BoxDetails = {
	boxId: 'A',
	x: -400,
	y: 300,
	z: 0,
	width: 300,
	height: 320,
	depth: 400,
	rows: 4,
	cols: 3,
	segmentWidth: 80,
	segmentHeight: 80,
	segmentDepth: 80,
};

const boxBDetails: BoxDetails = {
	boxId: 'B',
	x: 100,
	y: 300,
	z: 0,
	width: 300,
	height: 320,
	depth: 400,
	rows: 4,
	cols: 3,
	segmentWidth: 80,
	segmentHeight: 80,
	segmentDepth: 80,
};

export default function Home() {
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
	const [isBottleStateActive, setIsBottleStateActive] = useState(false);

	useEffect(() => {
		const socket = io();
		socket.on('fromSerial', (data) => {
			const parsedData = data.split(',');
			const command = parsedData[0];
			const boxId = parsedData[1];
			const row = parseInt(parsedData[2]);
			const col = parseInt(parsedData[3]);

			if (command === 'BOTTLE:ADD') {
				updateMatrix(boxId, row, col, true);
			} else if (command === 'BOTTLE:REMOVE') {
				updateMatrix(boxId, row, col, false);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const moveBottle = (
		fromBoxId: 'A' | 'B',
		toBoxId: 'A' | 'B',
		fromRow: number,
		fromCol: number,
		toRow: number,
		toCol: number
	) => {
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

		setSelectedBottle(null);
	};

	const toggleBottleState = () => {
		setIsBottleStateActive(!isBottleStateActive);
	};

	const updateMatrix = (boxId, row, col, value) => {
		if (boxId === 'A') {
			setMatrixA((prevMatrix) =>
				prevMatrix.map((r, rIndex) =>
					r.map((c, cIndex) => {
						if (rIndex === row && cIndex === col) {
							return value;
						}
						return c;
					})
				)
			);
		} else if (boxId === 'B') {
			setMatrixB((prevMatrix) =>
				prevMatrix.map((r, rIndex) =>
					r.map((c, cIndex) => {
						if (rIndex === row && cIndex === col) {
							return value;
						}
						return c;
					})
				)
			);
		}
	};

	const startSearch = async () => {
		try {
			await sendMessageToArduino('SEARCH');
		} catch (error) {
			console.error('Failed to start search:', error);
		}
	};

	return (
		<div className="flex flex-col justify-center gap-10 bg-gray-600 h-screen">
			<div className="flex flex-row justify-center gap-20 p-24">
				<Settings
					toggleBottleState={toggleBottleState}
					isBottleStateActive={isBottleStateActive}
					startSearch={startSearch}
				/>

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
					isBottleStateActive={isBottleStateActive}
					updateMatrix={updateMatrix}
					boxADetails={boxADetails}
					boxBDetails={boxBDetails}
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
					isBottleStateActive={isBottleStateActive}
					updateMatrix={updateMatrix}
					boxADetails={boxADetails}
					boxBDetails={boxBDetails}
				/>
			</div>
			<Controls />
		</div>
	);
}
