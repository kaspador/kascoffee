'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
	address: string;
	size?: number;
}

export default function QRCodeDisplay({ address, size = 200 }: QRCodeDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log('QRCodeDisplay: Rendering QR code for address:', address);
		
		if (!address) {
			console.error('QRCodeDisplay: No address provided');
			setError('No address provided');
			setLoading(false);
			return;
		}

		if (canvasRef.current) {
			setLoading(true);
			setError(null);
			
			QRCode.toCanvas(canvasRef.current, address, {
				width: size,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			})
			.then(() => {
				console.log('QRCodeDisplay: QR code rendered successfully');
				setLoading(false);
			})
			.catch((err) => {
				console.error('QRCodeDisplay: Error rendering QR code:', err);
				setError('Failed to generate QR code');
				setLoading(false);
			});
		}
	}, [address, size]);

	if (error) {
		return (
			<div className="flex justify-center items-center h-48 text-red-400 text-sm">
				{error}
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center h-48">
				<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<canvas ref={canvasRef} className="border rounded-lg" />
		</div>
	);
} 