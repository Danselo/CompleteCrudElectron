const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

mongoose.connect('mongodb://127.0.0.1:27017/principalShow')
.then(()=> console.log("Connected with database"))
.catch((err)=> console.log(err))