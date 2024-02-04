const { join } = require("path");
const isDev = require("electron-is-dev");

let config = {
	appName: "Weaver CRM",
	icon: join(__dirname, "..", "/favicon.ico"),
	tray: null,
	isQuiting: false,
	mainWindow: null,
	splash: null,
	popupWindow: null,
	isDev,
};

module.exports = config;
