const {ipcRenderer} = require('electron');
const form_product = document.querySelector('#form_product');
const nameProduct = document.querySelector('#name_product');
const priceProduct = document.querySelector('#price_product');
const photo=  document.querySelector('#photo_product');
const description= document.querySelector('#description_product');
const ListProduct = document.querySelector('#product_list');

let arrayProduct = [];


function loadProduct(data){
    ListProduct.innerHTML='';
    data.map(product=>{
        ListProduct.innerHTML+= `
        <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><img src='${product.photo}' class="image-pro"></td>
        <td>Eliminar/ editar</td>
       
        </tr>
        ` 
    })

    
    


}
//Llamado a los del formulario y creacion de l objeto para almacernarlos
form_product.addEventListener('submit',(e)=>{
e.preventDefault();
const product ={
    name:nameProduct.value,
    price:priceProduct.value,
    photo:photo.value,
    description:description.value
}



//Envio objeto al main
ipcRenderer.send('create-product', product);
form_product.reset();
nameProduct.focus();

})

ipcRenderer.on('create-product-success', (e, data)=>{
    const product = JSON.parse(data);
    arrayProduct.push(product);
    loadProduct(arrayProduct);

})

ipcRenderer.send('get-products')

ipcRenderer.on('get-product-success', (e, data)=>{
 const products = JSON.parse(data);
 arrayProduct= products


loadProduct(arrayProduct);

})





