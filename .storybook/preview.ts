import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import theme from './theme';
import '@/styles/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [{ name: 'Dark', value: '#1B1919' }],
      default: 'Dark',
      docs: { theme },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: { dark: 'dark' },
    defaultTheme: 'dark',
  }),
];

export default preview;
