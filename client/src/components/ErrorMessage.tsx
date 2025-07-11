import { BUTTON_LABELS, ARIA_LABELS } from '../constants/ui';

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
			<div>{message}</div>
			{onRetry && (
				<button
					onClick={onRetry}
					style={{ marginTop: '10px' }}
					aria-label={ARIA_LABELS.RETRY_LOADING}
				>
					{BUTTON_LABELS.RETRY}
				</button>
			)}
		</div>
	);
};
