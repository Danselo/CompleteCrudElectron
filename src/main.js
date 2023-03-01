const {app,BrowserWindow,ipcMain} = require('electron');
const User = require('./model/User');
const Product = require('./model/Product')


let mainWindow
let newWindow
function createWindow(){
    app.on('ready', ()=> {
        mainWindow = new BrowserWindow({
            width: 1500,
            height: 1000,
            webPreferences:{
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        mainWindow.loadFile('src/views/index.html')
    })

}

//? create new window
function createNewWindow(objectToPrint){

    //? Verificar si la pestaña esta abierda

    if(newWindow != null){
        newWindow.close();
        return;
    }
    //?
    newWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    newWindow.loadFile('src/views/edit.html');

    
      // Emite cuando la ventana está cerrada.
    newWindow.on('closed', () => {
        newWindow = null;
    });

    // ? Send Object to new Window
    newWindow.webContents.on('did-finish-load',()=>{
        newWindow.webContents.send('objects-to-print',objectToPrint)
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

ipcMain.on('delete-user',async(e,data) =>{
    const deleteUser = await User.findByIdAndDelete(data);
    e.reply('delete-user-success',JSON.stringify(deleteUser));
})

//? Listen event for open new window

ipcMain.on('open-new-window',(e,data)=>{
     createNewWindow(data);
})

//? take the petition for edit
ipcMain.on('user-update',async(e,data)=>{
    newWindow.close();
    const userUpdate = await User.findByIdAndUpdate(data.id,{
        name: data.userObject.name,
        lastname: data.userObject.lastname,
        email: data.userObject.email,
        phone: data.userObject.phone
    },{new: true})

    // ipcMain.send('user-update-success',JSON.stringify(userUpdate))
    // e.reply('user-update-success',JSON.stringify(userUpdate))
    mainWindow.webContents.send('user-update-success',JSON.stringify(userUpdate));
    
})


//******** Productoss *********
ipcMain.on('create-product', async(e, data)=>{
    const product = new Product(data);
    const productDate = await product.save();
 //Envio la confirmacion desde el back
    e.reply('create-product-success',JSON.stringify(productDate));

})

ipcMain.on('get-products', async(e)=>{
const product = await Product.find();
console.log(product);
e.reply('get-product-success', JSON.stringify(product))
})
exports.createWindow = createWindow();