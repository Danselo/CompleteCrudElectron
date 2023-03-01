const {ipcRenderer} = require('electron');
const nameUser = document.querySelector('#name-user');
const lastnameUser = document.querySelector('#lastname-user');
const emailUser = document.querySelector('#email-user');
const phoneUser = document.querySelector('#phone-user');
const formUser = document.querySelector('#form-users');
const errorMessage = document.querySelector('.error-message');

let sendDataEdit = (id,userObject) => {
    ipcRenderer.send('user-update',{id,userObject});
}


ipcRenderer.on('objects-to-print',(e,data)=>{
    let idUser =  data.id;
    nameUser.value = data.name;
    lastnameUser.value =data.lastname;
    emailUser.value = data.email;
    phoneUser.value = data.phone;
    formUser.addEventListener('submit',(e)=>{
        e.preventDefault()
        if(phoneUser.value.length !==10){
            phoneUser.classList.add('error')
            errorMessage.textContent = "El numero debe tener 10 digitos"
        }else{
            let userUpdate = {

            name: nameUser.value,
            lastname: lastnameUser.value,
            email: emailUser.value,
            phone: phoneUser.value
        }
         phoneUser.classList.remove('error')
        errorMessage.textContent = '';
        sendDataEdit(idUser,userUpdate)
        }
        
    })
})


