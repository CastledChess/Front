import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, React: 'writable' } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/prop-types': 'off',
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
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
