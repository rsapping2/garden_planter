import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["**/*.test.{js,jsx}", "**/tests/**/*.{js,jsx}", "**/__tests__/**/*.{js,jsx}", "**/setupTests.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node
      }
    }
  }
];
