'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
	address: string;
	size?: number;
}

export default function QRCodeDisplay({ address, size = 200 }: QRCodeDisplayProps) {
	const [error, setError] = useState<string | null>(null);
	const [cleanAddress, setCleanAddress] = useState<string>('');

	useEffect(() => {
		if (!address) {
			setError('No address provided');
			return;
		}

		// Clean the address - remove kaspa: prefix if present
		const cleaned = address.replace(/^kaspa:/, '').trim();

		if (!cleaned) {
			setError('Invalid address');
			return;
		}

		setError(null);
		setCleanAddress(cleaned);
	}, [address]);

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

	if (!cleanAddress) {
		return (
			<div className="flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg" style={{ width: size, height: size }}>
				<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<QRCode
				value={cleanAddress}
				size={size}
				bgColor="#ffffff"
				fgColor="#000000"
				level="M"
				style={{
					height: size,
					width: size,
					borderRadius: '8px'
				}}
			/>
		</div>
	);
} 