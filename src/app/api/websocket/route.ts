// pages/api/websocket.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Server as WebSocketServer } from 'ws';
import { Server as ServerHttp } from 'http';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (res.socket.server.io) {
		console.log('WebSocket is already running');
	} else {
		console.log('Setting up WebSocket');
		const httpServer: ServerHttp = res.socket.server as any;
		const wss = new WebSocketServer({ server: httpServer });

		wss.on('connection', (ws) => {
			ws.on('message', (message: string) => {
				console.log('Received:', message);
				ws.send(`Hello, you sent -> ${message}`);
			});
			ws.send('Connected to WebSocket server');
		});

		res.socket.server.io = wss;
	}
	res.end();
}
