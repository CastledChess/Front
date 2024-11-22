import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import react from 'eslint-plugin-react';

export default [
  { files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, React: 'writable' } } },
  {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
