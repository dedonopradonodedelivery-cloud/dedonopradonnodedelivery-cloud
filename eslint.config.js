import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  { plugins: { react: pluginReact } },
  {
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
