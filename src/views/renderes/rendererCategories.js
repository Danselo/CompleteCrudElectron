const {ipcRenderer} = require('electron');
const Swal = require('sweetalert2');
const formCategory = document.querySelector('#form-categories');
const nameCategory = document.querySelector('#category-name');
const listCategories = document.querySelector('#categories-list');
const optionsProducts = document.querySelector('.click-open-options');
const subList = document.querySelector('.sublistProduct1');
const subList2 = document.querySelector('.sublistProduct2');
const statusCategory = document.querySelector('.color-status-category');
let arrayCategories =[];

let changeStatus = (id,status) =>{
    let objectCategory = {
        id: id,
        status: status
    }
    Swal.fire({
        title: '¿Estas seguro que quieres cambiar  el  estado de la categoria a:   ' + !status ,
        text: "No puedes revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff405c',
        cancelButtonColor: 'rgb(2, 101, 207)',
        confirmButtonText: 'Cambiar estado'
    }).then((result) => {
        if (result.isConfirmed) {
            ipcRenderer.send('change-status',objectCategory);
        }
    })
   
} 
let deleteCategory= (id, name) =>{
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
            ipcRenderer.send('delete-category',id);

        }
    })
}
let  loadCategories = (array)=> {
    listCategories.innerHTML = "";
    array.map(category => {
        listCategories.innerHTML += `
        <tr>
            <td>${category.name}</td>
            <td ><button onclick ="changeStatus('${category._id}',${category.status})" class="color-status-category"><img src="${category.status ? 'https://cdn-icons-png.flaticon.com/512/2550/2550322.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828595.png'}" class="dashboard-icon-categories"></button></td>
            <td >
            <button class="button-delete" onclick="deleteCategory('${category._id}','${category.name}')"><img src="https://cdn-icons-png.flaticon.com/512/3178/3178384.png" alt="delete-buttom" class="delete-buttom" ></button>
            
            </td>
        </tr>
        
        `
    })
}
optionsProducts.addEventListener('click',(e)=>{
    subList.classList.toggle('inactive');
    subList2.classList.toggle('inactive');
     if(subList.classList.contains('inactive')) {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-29-xxl.png');
    } else {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-208-xxl.png');
    }

})
formCategory.addEventListener('submit',(e)=>{
    e.preventDefault()
    let category = {
        name : nameCategory.value,
        status: true,
    }
    console.log(category);
    ipcRenderer.send('create-category',category);

    formCategory.reset();
    nameCategory.focus();

})


//listen 

ipcRenderer.on('create-category-success',(e,data)=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha creado  la categoria correctamente!!',
        showConfirmButton: false,
        timer: 2000
      })
    let category = JSON.parse(data);
    arrayCategories.push(category);
    loadCategories(arrayCategories);


})

ipcRenderer.send('get-categories');
ipcRenderer.on('get-categories-success',(e,data)=>{
    let categories = JSON.parse(data);
    arrayCategories = categories;
    loadCategories(categories);
})

ipcRenderer.on('delete-category-success',(e,data)=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha eliminado la categoria correctamente!!',
        showConfirmButton: false,
        timer: 2000
      })
    let categoryD = JSON.parse(data);
    console.log(categoryD);
    let categoryDeleted = arrayCategories.filter(category => {
        return category._id !== categoryD._id;
    })
    arrayCategories = categoryDeleted
    loadCategories(arrayCategories);
})

ipcRenderer.on('change-status-success',(e,data)=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha  cambiado el estado correctamente!!',
        showConfirmButton: false,
        timer: 2000
      })
    let categoryStatus = JSON.parse(data);

    arrayCategories = arrayCategories.map(category => {
        if (category._id === categoryStatus._id){
            category.status = categoryStatus.status
        }
        return category
    })
    loadCategories(arrayCategories);
})