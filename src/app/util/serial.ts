'use server';

import { SerialPort } from 'serialport';

// Funktion zum Öffnen eines seriellen Ports und Rückgabe des offenen Ports als Promise
export function openSerialPort(
	path: string,
	baudRate: number
): Promise<SerialPort> {
	return new Promise((resolve, reject) => {
		// Erstellen Sie das SerialPort-Objekt mit angegebenem Pfad und Baudrate
		const port = new SerialPort({
			path,
			baudRate,
			autoOpen: false,
		});

		// Öffnen des Ports
		port.open((err) => {
			if (err) {
				reject(`Fehler beim Öffnen des Ports: ${err.message}`);
			} else {
				resolve(port);
			}
		});

		// Fehler-Event behandeln, um eventuelle Laufzeitfehler zu erfassen
		port.on('error', (err) => {
			reject(`Fehler: ${err.message}`);
		});
	});
}

// Beispiel-Aufruf der Funktion
openSerialPort('/dev/tty.usbmodemF412FA9F4F402', 9600)
	.then((port) => {
		// Datenempfang über Event-Listener
		port.on('data', (data) => {
			console.log('Daten empfangen: ' + data.toString());
		});

		console.log('Port erfolgreich geöffnet.');
	})
	.catch((error) => {
		console.error('Port konnte nicht geöffnet werden:', error);
	});
