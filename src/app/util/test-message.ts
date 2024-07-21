export async function sendMessageToArduino(message: string) {
	console.log("SENDSENDSEND")
	const response = await fetch('http://localhost:3001/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ message }),
	});
	return response.json();
}
