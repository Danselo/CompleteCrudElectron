const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname :{
        type: String,
        required : true
    },
    email :{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

module.exports = model('User',UserSchema);