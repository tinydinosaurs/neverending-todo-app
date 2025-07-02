interface LoadingSpinnerProps {
	message?: string;
	ariaLabel?: string;
}

export const LoadingSpinner = ({
	message = 'Loading...',
	ariaLabel = 'Loading content',
}: LoadingSpinnerProps) => {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={ariaLabel}
			className="loading-spinner"
		>
			<div style={{ marginBottom: '10px' }} aria-hidden="true">
				⏳
			</div>
			<div>{message}</div>
		</div>
	);
};
