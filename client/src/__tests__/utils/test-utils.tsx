import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import {
	MockTaskProvider,
	mockTaskContextValue,
} from '../contexts/MockTaskProvider';
import { system } from '../../components/theme';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	contextValue?: Partial<typeof mockTaskContextValue>;
}

const AllTheProviders = ({
	children,
	contextValue = {},
}: {
	children: React.ReactNode;
	contextValue?: Partial<typeof mockTaskContextValue>;
}) => {
	return (
		<ChakraProvider value={system}>
			<MockTaskProvider value={contextValue}>{children}</MockTaskProvider>
		</ChakraProvider>
	);
};

const customRender = (
	ui: React.ReactElement,
	options: CustomRenderOptions = {}
) => {
	const { contextValue, ...renderOptions } = options;

	return render(ui, {
		wrapper: ({ children }) => (
			<AllTheProviders contextValue={contextValue}>
				{children}
			</AllTheProviders>
		),
		...renderOptions,
	});
};

export * from '@testing-library/react';
export { customRender as render, customRender as renderWithProviders };
