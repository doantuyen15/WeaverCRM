const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const { createTray } = require("./utils/createTray");
const { createMainWindow } = require("./utils/createMainWindow");
const { createPopupWindow } = require("./utils/createPopupWindow");
const { showNotification } = require("./utils/showNotification");
const AutoLaunch = require("auto-launch");
const remote = require("@electron/remote/main");
const config = require("./utils/configElectron");
const fs = require('fs')
if (config.isDev) require("electron-reloader")(module);

remote.initialize();

if (!config.isDev) {
	const autoStart = new AutoLaunch({
		name: config.appName,
	});
	autoStart.enable();
}

app.on("ready", async () => {
	config.mainWindow = await createMainWindow();
	// config.tray = createTray();
	// config.popupWindow = await createPopupWindow();
	
	showNotification(
		config.appName,
		"Application running on background! See application tray.",
	);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0)
		config.mainWindow = createMainWindow();
});

ipcMain.on("app_version", (event) => {
	event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
	config.mainWindow.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
	config.mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
	autoUpdater.quitAndInstall();
});
// ipcMain.on("ipc_event", (event, msg) => {
// 	if (msg.type === 'update_config') {
// 		try {
// 			fs.writeFileSync(__dirname + '/assets/config/config.json', msg.value)
// 			join(__dirname, "..", '/assets/config/config.json')
// 		} catch (error) {
// 			console.log('writeFile err:', error);
// 		}
// 	}
// });
app.on('window-all-closed', function (e) {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()

})
