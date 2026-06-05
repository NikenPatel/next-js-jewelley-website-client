/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                narvik: "#f3ece7",
                gold: "#99775c",
                beige: "#ddd0c8",
                dark: "#0a0a0a",
            },
        },
    },
    plugins: [],
};