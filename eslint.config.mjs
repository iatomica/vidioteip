import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    rules: {
      "@remotion/non-pure-animation": "off",
    },
  },
];
