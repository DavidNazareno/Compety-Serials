const { BrowserWindow, remote, Menu } = require("electron");
let window;

function createWindow() {
  window = new BrowserWindow({
    width: 600,
    height: 600,
    maxHeight:600,
    minHeight:600,
    maxWidth:600,
    minWidth:600,
    icon: __dirname + './favicon.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });
 
  window.loadFile("src/ui/index.html");
  Menu.setApplicationMenu(null);
}

module.exports = {

  createWindow
};
