import { useEffect, useRef } from 'react';

interface UsePerformanceMonitorOptions {
	componentName: string;
	enabled?: boolean;
}

export const usePerformanceMonitor = ({
	componentName,
	enabled = process.env.NODE_ENV === 'development',
}: UsePerformanceMonitorOptions) => {
	const renderCount = useRef(0);
	const lastRenderTime = useRef(performance.now());

	useEffect(() => {
		if (!enabled) return;

		renderCount.current += 1;
		const currentTime = performance.now();
		const timeSinceLastRender = currentTime - lastRenderTime.current;
		lastRenderTime.current = currentTime;

		console.log(
			`🔄 ${componentName} rendered #${
				renderCount.current
			} (${timeSinceLastRender.toFixed(2)}ms since last render)`
		);
	});

	// Log when component mounts/unmounts
	useEffect(() => {
		if (!enabled) return;

		console.log(`🚀 ${componentName} mounted`);

		return () => {
			console.log(
				`💀 ${componentName} unmounted after ${renderCount.current} renders`
			);
		};
	}, [componentName, enabled]);
};
