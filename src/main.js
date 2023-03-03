const {app,BrowserWindow,ipcMain} = require('electron');
const User = require('./model/User');
const Product = require('./model/Product');
const Category = require('./model/Category')



let mainWindow
let newWindow
let newWindowP;
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
        mainWindow.setIcon(app.getAppPath() + '/src/imgs/DAFLOGO.png')
        console.log(app.getAppPath());
        
    })

}

//Crear ventana de edicion de product
function createNewWindowP(ObjectUpdate){
        //? Verificar si la pestaña esta abierta

        if(newWindowP != null){
            newWindowP.close();
            return;
        }
        //?
    newWindowP = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newWindowP.loadFile('src/views/editProduct.html');

          // Emite cuando la ventana está cerrada.
          newWindowP.on('closed', () => {
            newWindowP = null;
        });
    
        // ? Send Object to new Window
        newWindowP.webContents.on('did-finish-load',()=>{
            newWindowP.webContents.send('object-update-product',ObjectUpdate)
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
const product = await Product.find();  //find agregate with other model 
e.reply('get-product-success', JSON.stringify(product))
})


ipcMain.on('delete-product', async(e, data)=>{
const product = await Product.findByIdAndDelete(data);
e.reply('delete-product-success', JSON.stringify(product));
})
exports.createWindow = createWindow();



//update product
ipcMain.on('update-product',(e,data)=>{
    createNewWindowP(data);
})


ipcMain.on('update-new-product', async(e, data)=>{
newWindowP.close();
    const product = await Product.findByIdAndUpdate(data.id, {
        name: data.product.name,
        price: data.product.price,
        photo: data.product.photo,
    description: data.product.description

    },{new: true});

    mainWindow.webContents.send('product-update-success',JSON.stringify(product));

    
})




// ? CATEGORIEEEEEEEEEEEEEEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSSS

ipcMain.on('create-category',async (e,data)=>{
    let category = new Category(data);
    let saveCategory = await category.save();
    console.log(saveCategory);
    e.reply('create-category-success', JSON.stringify(saveCategory))
})
ipcMain.on('get-categories',async (e,data)=>{
    let getCategories = await Category.find();
    e.reply('get-categories-success',JSON.stringify(getCategories))
})

ipcMain.on('delete-category',async(e,data)=>{
    let category = await Category.findByIdAndDelete(data);
    e.reply('delete-category-success',JSON.stringify(category))

})

ipcMain.on('change-status',async(e,data)=>{
    let newStatus
    if (data.status == true) {
        newStatus = false;
      } else {
        newStatus = true;
      }
    console.log(newStatus);
    let categories = await Category.findByIdAndUpdate(data.id,{
        status: newStatus
    },{new:true});
    
    e.reply('change-status-success',JSON.stringify(categories))


})
