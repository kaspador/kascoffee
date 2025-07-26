'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
	address: string;
	size?: number;
	responsive?: boolean;
}

export default function QRCodeDisplay({ address, size = 200, responsive = false }: QRCodeDisplayProps) {
	const [error, setError] = useState<string | null>(null);
	const [kaspaAddress, setKaspaAddress] = useState<string>('');

	useEffect(() => {
		if (!address) {
			setError('No address provided');
			return;
		}

		// Clean the address - remove kaspa: prefix if present, then add it back
		const cleaned = address.replace(/^kaspa:/, '').trim();

		if (!cleaned) {
			setError('Invalid address');
			return;
		}

		setError(null);
		// Always include the kaspa: prefix in the QR code
		setKaspaAddress(`kaspa:${cleaned}`);
	}, [address]);

	if (error) {
		return (
			<div className="flex justify-center items-center bg-red-50 border border-red-200 rounded-lg p-8" style={{ width: responsive ? 'auto' : size, height: responsive ? 'auto' : size }}>
				<div className="text-center">
					<div className="text-red-600 text-sm font-medium">QR Code Error</div>
					<div className="text-red-500 text-xs mt-1">{error}</div>
				</div>
			</div>
		);
	}

	if (!kaspaAddress) {
		return (
			<div className="flex justify-center items-center bg-gray-50 border border-gray-200 rounded-lg" style={{ width: responsive ? 'auto' : size, height: responsive ? 'auto' : size }}>
				<div className="w-8 h-8 border-2 border-[#70C7BA] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (responsive) {
		return (
			<div className="flex justify-center">
				<QRCode
					value={kaspaAddress}
					className="w-40 h-40 sm:w-48 sm:h-48 md:w-50 md:h-50"
					bgColor="#ffffff"
					fgColor="#000000"
					level="M"
					style={{
						borderRadius: '8px',
						maxWidth: '100%',
						height: 'auto'
					}}
				/>
			</div>
		);
	}

	return (
		<div className="flex justify-center">
			<QRCode
				value={kaspaAddress}
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