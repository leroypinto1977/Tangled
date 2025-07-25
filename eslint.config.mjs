import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable Next.js img element warning - we're using regular img tags intentionally
      "@next/next/no-img-element": "off",

      // Allow unused variables with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",

      // Allow comments inside JSX children
      "react/jsx-no-comment-textnodes": "off",
    },
  },
];

export default eslintConfig;
