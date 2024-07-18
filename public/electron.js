const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require("electron");
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
const path = require('path');
const {google} = require('googleapis');
let stream = require('stream');

// const dotenv = require('dotenv');
// dotenv.config({ path: '../../.env' });

remote.initialize();

if (!config.isDev) {
	const autoStart = new AutoLaunch({
		name: config.appName,
	});
	autoStart.enable();
}

autoUpdater.allowPrerelease = false
app.commandLine.appendSwitch("lang", "vi-VI");

if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(app.getName(), process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient(app.getName())
  }

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.quit()
} else {
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
}



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
	if(config.mainWindow?.isEnable()) return
	config.mainWindow = await createMainWindow();
	setTimeout(() => {
		config.splash.close()
		if (!config.isDev) {
			config.tray = createTray();
			config.tray.on('double-click', () => {
				if (!config.mainWindow.isVisible())
					config.mainWindow.show();
			})
		}
		config.mainWindow.maximize()
	}, 1500);
});

ipcMain.on("google_api", async (event, msg) => {
	try {
		let bufferStream = new stream.PassThrough();
		bufferStream.end(msg.buffer);
		const auth = new google.auth.GoogleAuth({
			// keyFile: './public/driveapi.json',
			credentials: msg.credentials,
			scopes: 'https://www.googleapis.com/auth/drive'
		})
		const drive = google.drive({
			version: 'v3',
			auth
		})
		var fileMetadata = {
			name: msg.fileName,
			mimeType: "application/vnd.google-apps.spreadsheet",
			parents: [`${msg.credentials.folderId}`]
			// parents: ['1F8-Y4OmlJ1AD9cwSpGdc5hYYBZDuDdvW']
		};
		var media = {
			mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  // Modified
			body: bufferStream,  // Modified
		};
		
		drive.files.create(
			{
				resource: fileMetadata,
				media: media,
				fields: "id",
			},
			function (err, file) {
				if (err) {
					config.mainWindow.webContents.send("google_api", { error: err, type: 'error' });
				} else {
					config.mainWindow.webContents.send("google_api", { type: 'success', sheetId: file.data.id });
				}
			}
		);
	} catch (error) {
		config.mainWindow.webContents.send("google_api", { error: error, type: 'error' });
	}
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
