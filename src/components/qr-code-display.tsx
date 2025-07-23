'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
	address: string;
	size?: number;
}

export default function QRCodeDisplay({ address, size = 200 }: QRCodeDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current && address) {
			QRCode.toCanvas(canvasRef.current, address, {
				width: size,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			}).catch(console.error);
		}
	}, [address, size]);

	return (
		<div className="flex justify-center">
			<canvas ref={canvasRef} className="border rounded-lg" />
		</div>
	);
} 