import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginFunctional from "eslint-plugin-functional";
import pluginReactHooks from "eslint-plugin-react-hooks";
import airbnb from "eslint-config-airbnb";

export default [
  // Базовые настройки
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        __filename: "readonly",
        __dirname: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Настройки Airbnb
  ...airbnb,

  // Настройки плагинов
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
  pluginFunctional.configs.recommended,
  pluginReactHooks.configs.recommended,

  // Кастомные правила
  {
    rules: {
      "import/extensions": 0,
      "import/no-unresolved": 0,
      "react/prop-types": 0,
      "no-console": 0,
      "react/react-in-jsx-scope": 0,
      "functional/no-conditional-statements": 0,
      "functional/no-expression-statements": 0,
      "functional/immutable-data": 0,
      "functional/functional-parameters": 0,
      "functional/no-try-statements": 0,
      "functional/no-throw-statements": 0,
      "functional/no-return-void": 0,
      "no-underscore-dangle": ["error", { 
        "allow": ["__filename", "__dirname"] 
      }],
      "react/function-component-definition": ["error", { 
        "namedComponents": "arrow-function" 
      }],
      "testing-library/no-debug": 0,
      "react/jsx-filename-extension": ["warn", { 
        "extensions": [".js", ".jsx"] 
      }],
    },
  },
];
