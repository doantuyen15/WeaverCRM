/** @type {import("tailwindcss").Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: [
		"./src/**/*.{js,jsx,ts,tsx}", 
		"./public/index.html",
		"./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    	"./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'primary': '#fd5f00',
			'white': '#FFF'
		}
	},
	plugins: [],
	darkMode: "media",
});
