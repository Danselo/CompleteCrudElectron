const {ipcRenderer} = require('electron');
const nameUser = document.querySelector('#name-user');
const lastnameUser = document.querySelector('#lastname-user');
const emailUser = document.querySelector('#email-user');
const phoneUser = document.querySelector('#phone-user');
const formUser = document.querySelector('#form-users');

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
        let userUpdate = {

            name: nameUser.value,
            lastname: lastnameUser.value,
            email: emailUser.value,
            phone: phoneUser.value
        }
        sendDataEdit(idUser,userUpdate)
    })
})


