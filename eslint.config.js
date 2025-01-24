import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import react from 'eslint-plugin-react';

export default [
  { files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
    languageOptions: {
      globals: { ...globals.browser, React: 'writable' },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      plugins: {
        // Add the react plugin
        pluginReact,
      },
    },
  },
];
