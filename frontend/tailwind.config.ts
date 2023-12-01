import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                background: "#FBFBFB",
                lightgray: "#F5F5F5",
                gray: "#CDCDCD",
                brand: "#1BB258",
                "brand-light": "rgba(27, 178, 88, 0.20)",
            },
        },
    },
    plugins: [],
};
export default config;
