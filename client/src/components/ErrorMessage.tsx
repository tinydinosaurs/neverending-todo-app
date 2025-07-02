interface ErrorMessageProps {
	message: string;
	onRetry?: () => void;
	ariaLabel?: string;
}

export const ErrorMessage = ({
	message,
	onRetry,
	ariaLabel = 'Error occurred',
}: ErrorMessageProps) => {
	return (
		<div
			role="alert"
			aria-live="assertive"
			aria-label={ariaLabel}
			className="error-message"
		>
			<div style={{ marginBottom: '10px' }} aria-hidden="true">
				❌
			</div>
			<div>Error: {message}</div>
			{onRetry && (
				<button
					onClick={onRetry}
					style={{ marginTop: '10px' }}
					aria-label="Retry loading content"
				>
					Retry
				</button>
			)}
		</div>
	);
};
