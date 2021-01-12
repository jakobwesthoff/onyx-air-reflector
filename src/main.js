const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const execa = require("execa");
const path = require("path");
const which = require("which");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const sendToWindows = (channel, ...args) => {
  readyWindows.forEach((win) => win.send(channel, ...args));
};

const showStatus = (msg) => sendToWindows("show-status", msg);
const showImage = (image) => sendToWindows("show-image", image);

const loop = async () => {
  let result = undefined;
  try {
    result = await execa(adb, ["shell", "screencap -p"], {encoding: null});
  } catch (error) {
    switch (true) {
      case error.code === "ENOENT":
        showStatus(
          `No <b>adb</b> executable found. Please install the Android Development Tools and restart this Application.`
        );
        // No further loop
        break;
      case error.stderr !== undefined && error.stderr.toString('utf-8').match(`no devices/emulators found`) !== false:
        showStatus(
          `<h3>Device not connected</h3>
           <p>Please connect the Onyx Boox Note Air via USB to your system and enable USB-Debugging on the Device.</p>`
        );
        await sleep(1000);
        loop();
        break;
      default:
        showStatus(
          `<h3>Unknown Error occured:</h3><code>${JSON.stringify(
            error,
            undefined,
            2
          )}</code>`
        );
      // No further loop
    }
  }

  if (result === undefined) {
    // Error occured and was handled
    return;
  }

  if (result.exitCode !== 0) {
      showStatus(
        `<h3>Unknown Error occured:</h3><code>${JSON.stringify(
          result,
          undefined,
          2
        )}</code>`
      );
      await sleep(2500);
      loop();
      return;
  }
  showImage(result.stdout.toString('base64'));
  loop();
};

const readyWindows = [];
let adb = undefined;
ipcMain.on("window-ready", async (event) => {
  readyWindows.push(event.sender);
  showStatus("<h3>Searching for <b>adb</b>...</h3>")
  let searchPath = process.env.PATH || "";
  if (process.platform === 'darwin') {
    searchPath += `:/usr/local/bin`; // Add default homebrew location to search path
  }
  try {

    adb = await which('adb', {path: searchPath});
  } catch(error) {
      showStatus(
        `No <b>adb</b> executable found in <i>PATH</i>. Please install the Android Development Tools and restart this Application.`
      );
      return;
  }

  showStatus("<h3>Connecting to Onyx Note...</h3>");
  loop();
});
