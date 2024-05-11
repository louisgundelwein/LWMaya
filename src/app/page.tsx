'use client';

import ButtonMatrix from './util/button-matrix';

export default function Home() {
	return (
		<div className="flex flex-row justify-center gap-10">
			<div className="flex flex-col justify-center">
				<ButtonMatrix startRow={2} startCol={2} rows={4} cols={3} />
			</div>
			<div className="flex flex-col justify-center">
				<ButtonMatrix startRow={2} startCol={7} rows={4} cols={3} />
			</div>
		</div>
	);
}
