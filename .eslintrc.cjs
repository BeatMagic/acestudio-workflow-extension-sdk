// Mirrors the lint conventions of the MV and V2M bridge SDK repos so the three
// SDK repos read the same. Legacy (.eslintrc) config, matching those repos.
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: { browser: true, node: true, es2022: true },
  ignorePatterns: ["dist/", "node_modules/", "src/generated/", "docs/api/"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
