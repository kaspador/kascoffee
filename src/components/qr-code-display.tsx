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
	
		
		if (!address) {
	
			setError('No address provided');
			setLoading(false);
			return;
		}

		// Clean the address - remove kaspa: prefix if present
		const cleanAddress = address.replace(/^kaspa:/, '').trim();
	

		if (!cleanAddress) {
			setError('Invalid address');
			setLoading(false);
			return;
		}

		if (canvasRef.current) {
			setLoading(true);
			setError(null);
			
			// Generate QR code with the clean address
			QRCode.toCanvas(canvasRef.current, cleanAddress, {
				width: size,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				},
				errorCorrectionLevel: 'M'
			})
			.then(() => {
		
				setLoading(false);
			})
			.catch(() => {
				setError('Failed to generate QR code');
				setLoading(false);
			});
		}
	}, [address, size]);

	if (error) {
		return (
			<div className="flex justify-center items-center bg-red-50 border border-red-200 rounded-lg p-8" style={{ width: size, height: size }}>
				<div className="text-center">
					<div className="text-red-600 text-sm font-medium">QR Code Error</div>
					<div className="text-red-500 text-xs mt-1">{error}</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg" style={{ width: size, height: size }}>
				<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<canvas ref={canvasRef} className="rounded-lg shadow-sm" />
		</div>
	);
} 