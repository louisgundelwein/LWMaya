import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
		try {
			const { ... } = await req.json();
			const obj = {
				...
			};

			await dboperation(obj);
			return new Response('Ok', { status: 200 });
		} catch (error) {
			return new Response('Something went wrong', { status: 400 });
		}
}
		
