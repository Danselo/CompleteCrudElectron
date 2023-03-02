const {ipcRenderer} = require('electron');
const formCategory = document.querySelector('#form-categories');
const nameCategory = document.querySelector('#category-name');
const listCategories = document.querySelector('#categories-list');
const optionsProducts = document.querySelector('.click-open-options');
const subList = document.querySelector('.sublistProduct1');
const subList2 = document.querySelector('.sublistProduct2');


let arrayCategories =[];

let  loadCategories = (array)=> {
    listCategories.innerHTML = "";
    array.map(category => {
        listCategories.innerHTML += `
        <tr>
            <td>${category.name}</td>
            <td>${category.status}</td>
            <td >
            <button class="button-delete"><img src="https://cdn-icons-png.flaticon.com/512/3178/3178384.png" alt="delete-buttom" class="delete-buttom" ></button>
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
    let category = JSON.parse(data);
    arrayCategories.push(data);
    loadCategories(arrayCategories);

})

ipcRenderer.send('get-categories');
ipcRenderer.on('get-categories-succes',(e,data)=>{
    let categories = JSON.parse(data);
    loadCategories(categories);
})
