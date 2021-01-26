const { app, BrowserWindow, ipcMain } = require('electron');
const term = require('terminal-kit').terminal;
const path = require('path');

const { getFileInfo, formatFileSize } = require('./file')

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const start = () => {
  // Check the command line to see if there is a directory 
  // to display
  if (app.commandLine.hasSwitch("dir")) {
    let data;
    try {
      data = getFileInfo(app.commandLine.getSwitchValue("dir"))
    } catch (error) {
      console.log("Invalid directory")
      app.exit()
    }

    const { details, totalFiles, totalSize } = data

    details.sort((a, b) => b.size - a.size)

    console.log(`Total Files: ${totalFiles}  Total Size: ${formatFileSize(totalSize)}`)
    const rows = details.map(detail => [detail.isDirectory ? `^+^b${detail.name}^` : detail.name, formatFileSize(detail.size), 
      detail.lastModified.toISOString().replace(/T/, ' ').replace(/\..+/, '')]) 

    const table = [["", "", ""]].concat(rows)     
    term.table(table, {
      hasBorder: false ,
      contentHasMarkup: true ,
      borderChars: 'lightRounded' ,
      textAttr: { bgColor: 'default' } ,
      width: 80 ,
      fit: true   // Activate all expand/shrink + wordWrap
    })

    app.exit()
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('get-files', (event, arg) => {
  let info;
  try {
    info = getFileInfo(arg)
  } catch (error) {
    mainWindow.webContents.send("file-response", { error });
    return
  }

  mainWindow.webContents.send("file-response", info);
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', start);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    start();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
