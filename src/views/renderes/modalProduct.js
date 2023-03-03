const { ipcRenderer } = require('electron');
const form_product = document.querySelector('#form_product');
const nameProduct = document.querySelector('#name_product');
const priceProduct = document.querySelector('#price_product');
const photo = document.querySelector('#photo_product');
const description = document.querySelector('#description_product');
const categoriesList = document.querySelector('#categoriesList');
let arrayCategories = [];

function loadCategoriesInForm(array){
    array.map(c => {
        categoriesList.innerHTML += `
        <option value="${c._id}" >${c.name}</option>
        `
    })
}
function sendDataEdit(id, product){
    ipcRenderer.send('update-new-product',{
        id:id,
        product:product
    })
}

ipcRenderer.on('object-update-product',(e,data)=>{

    let id_Product =  data.id;
    nameProduct.value = data.name;
    priceProduct.value =data.price;
    photo.value = data.photo;
    description.value = data.description;
    categoriesList.value =data.category_id
    form_product.addEventListener('submit',(e)=>{
        e.preventDefault()
        
            let productUpdate = {

            name: nameProduct.value,
            price: priceProduct.value,
            description: description.value,
            category_id: categoriesList.value,
            photo: photo.value
        }
       
        sendDataEdit(id_Product,productUpdate)
        
        
    })
})

ipcRenderer.send('get-categories-edit');
ipcRenderer.on('get-categories-product-success-edit',(e,data)=>{
    let categories = JSON.parse(data);
    let arrayTrue = [];
    console.log(categories);
    categories.map(categories => {
        if(categories.status === true){
            arrayTrue.push(categories);
        }
    })

    arrayCategories = arrayTrue;
    loadCategoriesInForm(arrayCategories);
});

