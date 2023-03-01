const { ipcRenderer } = require('electron');
const form_product = document.querySelector('#form_product');
const nameProduct = document.querySelector('#name_product');
const priceProduct = document.querySelector('#price_product');
const photo = document.querySelector('#photo_product');
const description = document.querySelector('#description_product');

function sendDataEdit(id, product){
    ipcRenderer.send('update-new-product',{
        id:id,
        product:product
    })
}

ipcRenderer.on('object-update-product',(e,data)=>{
    console.log(data);
    let id_Product =  data.id;
    nameProduct.value = data.name;
    priceProduct.value =data.price;
    photo.value = data.photo;
    description.value = data.description;
    form_product.addEventListener('submit',(e)=>{
        e.preventDefault()
        
            let productUpdate = {

            name: nameProduct.value,
            price: priceProduct.value,
            description: description.value,
            photo: photo.value
        }
       
        sendDataEdit(id_Product,productUpdate)
        
        
    })
})
