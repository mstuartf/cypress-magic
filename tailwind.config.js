/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      visibility: ["group-hover"],
    },
  },
  plugins: [],
  prefix: "cyw-",
};
