import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    ignores: ["**/*.json"]
  }
];
