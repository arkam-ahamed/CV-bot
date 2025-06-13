/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		// This line tells Tailwind CSS to scan all .js, .jsx, .ts, .tsx files
		// inside your src directory for Tailwind classes.
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				// Define a custom font family for 'Inter'
				inter: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [
		// This plugin provides a set of `prose` classes that style Markdown content nicely.
		require("@tailwindcss/typography"),
	],
};
