// Beispiel: pages/api/command.js in deinem Next.js-Projekt

export default function handler(req: any, res: any) {
	if (req.method === 'POST') {
		// Verarbeite den Robotersteuerbefehl
		console.log(req.body); // Logge den empfangenen Befehl
		// Füge Logik hinzu, um Befehle an den Arduino zu senden
		res.status(200).json({ message: 'Befehl erhalten' });
	} else {
		res.status(405).json({ error: 'Methode nicht erlaubt' });
	}
}
