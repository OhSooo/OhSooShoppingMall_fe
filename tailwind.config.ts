import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        point: {
          main: "var(--color-point-main)",
          sub: "var(--color-point-sub)",
          back: "var(--color-point-back)",
        },
        gray: {
          1: "var(--color-gray-1)",
          2: "var(--color-gray-2)",
          3: "var(--color-gray-3)",
          4: "var(--color-gray-4)",
          5: "var(--color-gray-5)",
        },
        white: "var(--color-white)",
        black: "var(--color-black)",
      },
      spacing: {
        header: "var(--header-h)",
      },
    },
  },
  plugins: [],
} satisfies Config;
