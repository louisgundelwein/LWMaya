'use client';
import { useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
	useEffect(() => {
		const socket = io();

		socket.on('connect', () => {
			console.log('Connected to WebSocket server');
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return <div>WebSocket Test Page</div>;
}
