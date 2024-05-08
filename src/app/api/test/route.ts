// src/pages/api/test/route.ts

import { NextRequest, NextResponse } from 'next/server';

function middleware(req: NextRequest) {
	if (req.method !== 'POST') {
		return new NextResponse('Method Not Allowed', { status: 405 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		// Führe hier die gewünschten Operationen durch, z.B. Datenbankoperationen
		// await dboperation(data);

		return new NextResponse('Ok', { status: 200 });
	} catch (error) {
		return new NextResponse('Something went wrong', { status: 400 });
	}
}
