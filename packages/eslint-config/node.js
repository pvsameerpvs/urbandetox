import globals from "globals";
import js from "@eslint/js";

export const nodeJsConfig = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];

export default nodeJsConfig;
