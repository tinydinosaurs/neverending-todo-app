import { defineConfig, createSystem, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
	globalCss: {
		html: {
			colorPalette: 'pink', // Change this to any color palette you prefer
		},
	},
});

export const system = createSystem(defaultConfig, config);
