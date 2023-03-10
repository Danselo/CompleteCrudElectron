const { ipcRenderer } = require("electron");
const Swal =  require('sweetalert2');
const nameUser = document.querySelector('#name-user');
const lastnameUser = document.querySelector('#lastname-user');
const emailUser = document.querySelector('#email-user');
const phoneUser = document.querySelector('#phone-user');
const formUser = document.querySelector('#form-users');
const userList = document.querySelector('#users-list')
const subList = document.querySelector('.sublistProduct1');
const optionsProducts = document.querySelector('.click-open-options');
const subList2 = document.querySelector('.sublistProduct2');
//? this is for validation 
const errorMessage = document.querySelector('.error-message');
//?

let arrayUsers = [];



let openModalEdit = (id,name,lastname,email,phone)=>{
    let Object = {
        id,
        name,
        lastname,
        email,
        phone
    }
        ipcRenderer.send('open-new-window',Object);
}
let deleteUser =(id,name)=>{
    Swal.fire({
        title: '¿Estas seguro que quieres eliminar a ' +name + '?',
        text: "No puedes revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff405c',
        cancelButtonColor: 'rgb(2, 101, 207)',
        confirmButtonText: 'Si, Eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
         ipcRenderer.send('delete-user',id);
          Swal.fire(
            'Eliminado!',
            'El usuario ha sido eliminado',
            'success'
          )
        }
      })
} 
let getUsers =  (id)=>{
    userList.innerHTML = '';
    arrayUsers.map(user => {
        userList.innerHTML += `
        <tr>
            <td>${user.name}</td>
            <td>${user.lastname}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
            <button class="button-delete" onclick="deleteUser('${user._id}', '${user.name}')"><img src="https://cdn-icons-png.flaticon.com/512/3178/3178384.png" alt="delete-buttom" class="delete-buttom" ></button>
            <button class="button-edit" onclick="openModalEdit('${user._id}', '${user.name}','${user.lastname}','${user.email}','${user.phone}' )"><img src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" alt="delete-buttom" class="edit-buttom" ></button>
            </td>

        </tr>
     
        ` 
    })
}
//? Listener Form 
formUser.addEventListener('submit',(e)=>{
    e.preventDefault();

    if(phoneUser.value.length !== 10 ){
        phoneUser.classList.add('error')
        errorMessage.textContent = 'El numero de teléfono debe tener 10 dígitos. ';

    }else{
        const user = {
            name : nameUser.value,
            lastname : lastnameUser.value,
            email: emailUser.value,
            phone : phoneUser.value
        }
    
        phoneUser.classList.remove('error')
        errorMessage.textContent = '';
        ipcRenderer.send('create-user',user);
        formUser.reset();
        nameUser.focus();
    }
   
})
optionsProducts.addEventListener('click',(e)=>{
    subList.classList.toggle('inactive');
    subList2.classList.toggle('inactive');
     if(subList.classList.contains('inactive')) {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-29-xxl.png');
    } else {
        arrowProductsOptions.setAttribute("src", 'https://www.iconsdb.com/icons/preview/white/arrow-208-xxl.png');
    }

})
//?
ipcRenderer.on('create-success',(e,data)=>{
    
    const user = JSON.parse(data);
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Se ha creado  el usuario ${user.name}  correctamente!!`,
        showConfirmButton: false,
        timer: 2000
      })
    const usersUpdated = arrayUsers.push(user)
    getUsers(usersUpdated)

})
ipcRenderer.send('get-users');

ipcRenderer.on('get-user-success',(e,data)=>{
    arrayUsers = JSON.parse(data);
    getUsers(arrayUsers)
})
ipcRenderer.on('delete-user-success',(e,data)=>{
    const deleteUser = JSON.parse(data);
    const newUser = arrayUsers.filter(user => {
        return user._id !== deleteUser._id
    } )
    arrayUsers = newUser
    getUsers(arrayUsers);
})

ipcRenderer.on('user-update-success',(e,data)=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha actualizado el usuario correctamente!!',
        showConfirmButton: false,
        timer: 2000
      });
    const userUpdated = JSON.parse(data);
    console.log(userUpdated);
    arrayUsers = arrayUsers.map(user => {
        if(user._id === userUpdated._id){
            user.name = userUpdated.name;
            user.lastname = userUpdated.lastname;
            user.email = userUpdated.email;
            user.phone = userUpdated.phone;
        }
        return user 
      })
    getUsers(arrayUsers);
})


//? Create other window for edit
