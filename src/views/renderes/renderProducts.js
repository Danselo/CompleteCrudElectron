const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const form_product = document.querySelector('#form_product');
const nameProduct = document.querySelector('#name_product');
const priceProduct = document.querySelector('#price_product');
const photo = document.querySelector('#photo_product');
const description = document.querySelector('#description_product');
const ListProduct = document.querySelector('#product_list');
const optionsProducts = document.querySelector('.click-open-options');
const arrowProductsOptions = document.querySelector('#arrow-option');
const subList = document.querySelector('.sublistProduct1');
const subList2 = document.querySelector('.sublistProduct2');
const categoriesList = document.querySelector('#categoriesList');
let arrayProduct = [];
let arrayCategories = [];




function loadCategoriesInForm(array){
    console.log(array);
    array.map(c => {
        categoriesList.innerHTML += `
        <option value="${c._id}" >${c.name}</option>
        `
    })
}
function updateProduct(id, name, price, description, photo,category_id){
let product= {
    id: id,
    name: name,
    price: price,
    description: description,
    photo: photo,
    category_id: category_id

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
        // console.log(product.category_id);
        ListProduct.innerHTML += `
        <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td>${product.category_id.name}</td>
        <td><img src='${product.photo}' class="image-pro"></td>
        <td>
        <button class="button-delete" onclick="deleteProduct('${product._id}', '${product.name}')"><img src="https://cdn-icons-png.flaticon.com/512/3178/3178384.png" alt="delete-buttom" class="delete-buttom" ></button>
        <button class="button-edit" onclick="updateProduct('${product._id}', '${product.name}','${product.price}','${product.description}', '${product.photo}','${product.category_id._id}')"><img src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" alt="delete-buttom" class="edit-buttom" ></button>
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
        description: description.value,
        category_id : categoriesList.value
    }



    //Envio objeto al main
    ipcRenderer.send('create-product', product);
    form_product.reset();
    nameProduct.focus();

})

// escuchar boton de el sidebar para mostrar opciones de usuario

optionsProducts.addEventListener('click',(e)=>{
    subList.classList.toggle('inactive');
    subList2.classList.toggle('inactive');
     if(subList.classList.contains('inactive')) {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-29-xxl.png');
    } else {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-208-xxl.png');
    }

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
    // console.log(product);

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
    console.log(producto);
    arrayProduct = arrayProduct.map(product=>{
        if(product._id === producto._id) {
            product.name = producto.name;
            product.price = producto.price;
            product.category_id = producto.category_id,
            product.description = producto.description;
            product.photo = producto.photo;

            

        }
        return product;
    })

    loadProduct(arrayProduct);
})



ipcRenderer.send('get-categories-product')
ipcRenderer.on('get-categories-product-success',(e,data)=>{
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





