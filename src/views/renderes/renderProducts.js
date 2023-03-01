const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const form_product = document.querySelector('#form_product');
const nameProduct = document.querySelector('#name_product');
const priceProduct = document.querySelector('#price_product');
const photo = document.querySelector('#photo_product');
const description = document.querySelector('#description_product');
const ListProduct = document.querySelector('#product_list');

let arrayProduct = [];


function updateProduct(id, name, price, description, photo){
let product= {
    id: id,
    name: name,
    price: price,
    description: description,
    photo: photo


}
ipcRenderer.send('update-product', product);

}

function deleteProduct(id, name) {
    Swal.fire({
        title: '¿Estas seguro que quieres eliminar el producto:  ' + name + '?',
        text: "No puedes revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff405c',
        cancelButtonColor: 'rgb(2, 101, 207)',
        confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            ipcRenderer.send('delete-product', id);

            Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado',
                'success'
            )
        }
    })
}

function loadProduct(data) {
    ListProduct.innerHTML = '';
    data.map(product => {
        ListProduct.innerHTML += `
        <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><img src='${product.photo}' class="image-pro"></td>
        <td>
        <button class="button-delete" onclick="deleteProduct('${product._id}', '${product.name}')"><img src="https://cdn-icons-png.flaticon.com/512/3178/3178384.png" alt="delete-buttom" class="delete-buttom" ></button>
        <button class="button-edit" onclick="updateProduct('${product._id}', '${product.name}','${product.price}','${product.description}', '${product.photo}')"><img src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" alt="delete-buttom" class="edit-buttom" ></button>
        </td>

       
        </tr>
        `
    })





}
//Llamado a los del formulario y creacion de l objeto para almacernarlos
form_product.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: nameProduct.value,
        price: priceProduct.value,
        photo: photo.value,
        description: description.value
    }



    //Envio objeto al main
    ipcRenderer.send('create-product', product);
    form_product.reset();
    nameProduct.focus();

})

ipcRenderer.on('create-product-success', (e, data) => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha creado el producto correctamente!!',
        showConfirmButton: false,
        timer: 2000
      })
    const product = JSON.parse(data);
    arrayProduct.push(product);
    loadProduct(arrayProduct);

})

ipcRenderer.send('get-products')

ipcRenderer.on('get-product-success', (e, data) => {
    const products = JSON.parse(data);
    arrayProduct = products


    loadProduct(arrayProduct);

})


ipcRenderer.on('delete-product-success', (e, data) => {
    const producto = JSON.parse(data);
    const deleteProduct = arrayProduct.filter(product => {
        return product._id !== producto._id;
    })
    arrayProduct = deleteProduct;
    loadProduct(arrayProduct);
})


ipcRenderer.on('product-update-success', (e, data)=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha editado el producto correctamente!!',
        showConfirmButton: false,
        timer: 2000
      })
    const producto =JSON.parse(data);
    arrayProduct = arrayProduct.map(product=>{
        if(product._id === producto._id) {
            product.name = producto.name;
            product.price = producto.price;
            product.description = producto.description;
            product.photo = producto.photo;

            

        }
        return product;
    })

    loadProduct(arrayProduct);
})







