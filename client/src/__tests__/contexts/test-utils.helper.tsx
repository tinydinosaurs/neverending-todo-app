import React from 'react';
import { render } from '@testing-library/react';
import { TaskProvider } from '@components/../contexts/TaskContext';

export * from '@testing-library/react';

export function renderWithTaskProvider(ui: React.ReactElement) {
	return render(<TaskProvider>{ui}</TaskProvider>);
}
