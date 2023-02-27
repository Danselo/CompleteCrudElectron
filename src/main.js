const {app,BrowserWindow, contextBridge,ipcMain} = require('electron');
const User = require('./model/User');
const Product = require('./model/Product')

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

ipcMain.on('create-user',async(e,data)=>{
    const user = new User(data);
    const userData = await user.save();
    e.reply('create-success',JSON.stringify(userData))
})

ipcMain.on('get-users', async(e)=>{
    const users = await User.find();
    e.reply('get-user-success',JSON.stringify(users))
})
exports.createWindow = createWindow();