import globals from 'globals';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  { languageOptions: { globals: globals.browser } },
  ...compat.extends('airbnb'),
  pluginReactConfig,
  {
    rules: {
      'comma-dangle': [
        'error', // Уровень ошибки
        {
          objects: 'always-multiline', // Запятая после последнего элемента в многострочном объекте
          arrays: 'always-multiline', // Запятая после последнего элемента в многострочном массиве
          functions: 'never', // Запятая не требуется в параметрах функции
        },
      ],
    },
  },
];
