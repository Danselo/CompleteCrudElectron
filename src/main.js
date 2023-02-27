const {app,BrowserWindow, contextBridge} = require('electron');

let mainWindow

function createWindow(){
    app.on('ready', ()=> {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences:{
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        mainWindow.loadFile('src/views/index.html')
    })
}

exports.createWindow = createWindow();