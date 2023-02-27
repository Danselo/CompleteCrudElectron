const { ipcRenderer, ipcMain } = require("electron");


const nameUser = document.querySelector('#name-user');
const lastnameUser = document.querySelector('#lastname-user');
const emailUser = document.querySelector('#email-user');
const phoneUser = document.querySelector('#phone-user');
const formUser = document.querySelector('#form-users');
console.log(nameUser.value);

formUser.addEventListener('submit',(e)=>{
    e.preventDefault();
    const user = {
        name : nameUser.value,
        lastname : lastnameUser.value,
        email: emailUser.value,
        phone : phoneUser.value
    }
    ipcRenderer.send('create-user',user);
    formUser.reset();
    lastnameUser.focus();
})

ipcRenderer.on('create-success',(e,data)=>{
    console.log(JSON.parse(data));
})