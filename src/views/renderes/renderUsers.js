const { ipcRenderer, ipcMain } = require("electron");

const nameUser = document.querySelector('#name-user');
const lastnameUser = document.querySelector('#lastname-user');
const emailUser = document.querySelector('#email-user');
const phoneUser = document.querySelector('#phone-user');
const formUser = document.querySelector('#form-users');
const userList = document.querySelector('#users-list')
let arrayUsers = [];


let getUsers =  (users)=>{
    userList.innerHTML = '';
    arrayUsers.map(user => {
        userList.innerHTML += `
        <tr>
            <td>${user.name}</td>
            <td>${user.lastname}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
            <button>Delete</button>
            <button>Edit</button>
            </td>

        </tr>
     
        ` 
    })
}
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
    const user = JSON.parse(data);
    const usersUpdated = arrayUsers.push(user)
    getUsers(usersUpdated)

})
ipcRenderer.send('get-users');

ipcRenderer.on('get-user-success',(e,data)=>{
    arrayUsers = JSON.parse(data);
    console.log(arrayUsers);
    getUsers(arrayUsers)
})



