const path = require('path');
const { app, BrowserWindow } = require('electron');
const url = require("url");
const unhandled = require('electron-unhandled');
const updater = require('update-electron-app');

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

if(!isDev) {
  updater({
    repo: 'abenjaminov/payment-tracker',
    notifyUser: true,
    updateInterval: '30 minutes'
  });

  function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
      return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
        spawnedProcess = ChildProcess.spawn(command, args, {
          detached: true
        });
      } catch (error) {}

      return spawnedProcess;
    };

    const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
        // Optionally do things such as:
        // - Add your .exe to the PATH
        // - Write to the registry for things like file associations and
        //   explorer context menus

        // Install desktop and start menu shortcuts
        spawnUpdate(['--createShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

      case '--squirrel-uninstall':
        // Undo anything you did in the --squirrel-install and
        // --squirrel-updated handlers

        // Remove desktop and start menu shortcuts
        spawnUpdate(['--removeShortcut', exeName]);

        setTimeout(application.quit, 1000);
        return true;

      case '--squirrel-obsolete':
        // This is called on the outgoing version of your app before
        // we update to the new version - it's the opposite of
        // --squirrel-updated

        application.quit();
        return true;
    }
  };

// this should be placed at top of main.js to handle setup events quickly
  if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
  }

}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

unhandled({
  logger: () => {
    console.error();
  },
  showDialog: true,
  reportButton: (error) => {
    console.log('Report Button Initialized');
  }
});


async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    icon: path.join(__dirname,"img","icon.png"),
    title: "Shirs' payments",
    webPreferences: {
      nodeIntegration: true
    },
  });

  if(isDev) {
    await mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.toggleDevTools();
  }
  else {
    mainWindow.removeMenu();
    //mainWindow.loadFile(path.join(__dirname, "dist","index.html"));
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist","index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
