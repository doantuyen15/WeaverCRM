const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const { autoUpdater } = require("electron-updater");
const { createTray } = require("./utils/createTray");
const { createMainWindow } = require("./utils/createMainWindow");
const { createSplashScreen } = require("./utils/createSplashScreen");
const { createPopupWindow } = require("./utils/createPopupWindow");
const { showNotification } = require("./utils/showNotification");
const AutoLaunch = require("auto-launch");
const remote = require("@electron/remote/main");
const config = require("./utils/configElectron");
const fs = require('fs');
if (config.isDev) require("electron-reloader")(module);

remote.initialize();

if (!config.isDev) {
	const autoStart = new AutoLaunch({
		name: config.appName,
	});
	autoStart.enable();
}

autoUpdater.allowPrerelease = false
app.commandLine.appendSwitch("lang", "vi-VI");

app.on("ready", async () => {
	config.splash = await createSplashScreen();
	console.log(app.getLocale());
	// config.mainWindow.openDevTools()
	// globalShortcut.register('F11', () => {
	// 	config.mainWindow.webContents.openDevTools()
	// })  
	// config.popupWindow = await createPopupWindow();

	// showNotification(
	// 	config.appName,
	// 	app.getLocale(),
	// );
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	// if (BrowserWindow.getAllWindows().length === 0)
	// 	config.mainWindow = createMainWindow();
});

ipcMain.on("app_version", (event) => {
	event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("check_update", (event, arg) => {
	if (config.isDev) {
		event.sender.send("update_not_available");
	}
	else autoUpdater.checkForUpdates()
});

ipcMain.on("finish_init_app", async (event, arg) => {
	config.mainWindow = await createMainWindow();
	setTimeout(() => {
		config.splash.close()
		config.tray = createTray();
		config.tray.on('double-click', () => {
			if (!config.mainWindow.isVisible())
				config.mainWindow.show();
		})
		config.mainWindow.maximize()
	}, 1500);
});

autoUpdater.on('update-not-available', (event, arg) => {
	config.splash.webContents.send("update_not_available");
});

autoUpdater.on("update-available", () => {
	showNotification(
		config.appName,
		"update_available",
	);
	config.splash.webContents.send("update_available");
});

autoUpdater.on('download-progress', (event, args) => {
	config.splash.webContents.send("download_progress", { args, event });
})

autoUpdater.on("update-downloaded", () => {
	// autoUpdater.quitAndInstall()
	config.splash.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
	setTimeout(() => {
		autoUpdater.quitAndInstall();
	}, 2000);
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
