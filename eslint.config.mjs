// Flat config (ESLint 10). Mirrors the lint conventions of the MV and V2M bridge
// SDK repos so the three SDK repos read the same, using the unified
// typescript-eslint package rather than the separate plugin + parser.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  { ignores: ["**/dist/", "**/src/generated/", "docs/api/"] },
  {
    files: ["packages/*/src/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
);
