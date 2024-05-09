import React, { useEffect, useState } from 'react';

type Props = {
	serverUrl: string;
};

const WebSocketComponent: React.FC<Props> = ({ serverUrl }) => {
	const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState<string>('');

	useEffect(() => {
		// Verbindung zum WebSocket-Server herstellen
		const ws = new WebSocket(serverUrl);

		ws.onopen = () => {
			console.log('Connected to WebSocket');
			setWebSocket(ws);
		};

		ws.onerror = (error) => {
			console.error('WebSocket Error: ', error);
		};

		ws.onmessage = (event) => {
			console.log('Message from server ', event.data);
			setMessages((prevMessages) => [...prevMessages, event.data]);
		};

		ws.onclose = () => {
			console.log('Disconnected from WebSocket');
			setWebSocket(null);
		};

		// Cleanup-Funktion bei Component-Unmount
		return () => {
			ws.close();
		};
	}, [serverUrl]);

	const sendMessage = () => {
		if (webSocket) {
			webSocket.send(input);
			setInput('');
		}
	};

	return (
		<div>
			<h1>WebSocket Communication</h1>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
			/>
			<button onClick={sendMessage}>Send Message</button>
			<div>
				<h2>Messages</h2>
				{messages.map((message, index) => (
					<p key={index}>{message}</p>
				))}
			</div>
		</div>
	);
};

export default WebSocketComponent;
