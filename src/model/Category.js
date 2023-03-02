const {Schema, model} = require('mongoose');

const CategorySchema= new Schema({
    name: {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
    }

})

module.exports = model('Category',CategorySchema);