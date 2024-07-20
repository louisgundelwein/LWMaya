import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3001;
const SERIAL_PORT = '/dev/tty.usbmodemF412FA9F4F402';
const BAUD_RATE = 9600;

app.use(bodyParser.json()); // Middleware zum Parsen von JSON

let serialPort = new SerialPort({
	path: SERIAL_PORT,
	baudRate: BAUD_RATE,
	autoOpen: false,
});

// Open serial connection
serialPort.open((err) => {
	if (err) {
		console.error('Error opening serial port:', err.message);
	} else {
		console.log('Serial port opened');
	}
});

// Handling incoming data from serial port
serialPort.on('data', (data) => {
	console.log('Data received from Arduino:', data.toString());
	io.emit('fromSerial', data.toString());
});

// POST route to receive data from the frontend to send to Arduino
app.post('/send', (req, res) => {
	const { message } = req.body;
	if (serialPort.isOpen) {
		serialPort.write(message + '\n', (err) => {
			if (err) {
				console.error('Error sending message to Arduino:', err.message);
				res.status(500).json({ error: 'Failed to send message to Arduino' });
			} else {
				res.status(200).json({ success: true });
			}
		});
	} else {
		res.status(500).json({ error: 'Serial port not open' });
	}
});

// Add this route to handle search requests
app.post('/search', (req, res) => {
	if (serialPort.isOpen) {
		serialPort.write('SEARCH\n', (err) => {
			if (err) {
				console.error('Error sending search command to Arduino:', err.message);
				res
					.status(500)
					.json({ error: 'Failed to send search command to Arduino' });
			} else {
				res.status(200).json({ success: true });
			}
		});
	} else {
		res.status(500).json({ error: 'Serial port not open' });
	}
});

// Socket connection to send data to the frontend
io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
