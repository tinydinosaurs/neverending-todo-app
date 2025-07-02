import React, { useEffect } from 'react';

interface ToastProps {
	message: string;
	onClose: () => void;
	duration?: number; // milliseconds
}

export const Toast: React.FC<ToastProps> = ({
	message,
	onClose,
	duration = 3000,
}) => {
	useEffect(() => {
		if (!message) return;
		const timer = setTimeout(onClose, duration);
		return () => clearTimeout(timer);
	}, [message, onClose, duration]);

	if (!message) return null;

	return (
		<div className="toast" role="status" aria-live="polite" tabIndex={0}>
			{message}
		</div>
	);
};
