const {Schema, model} = require('mongoose');

const ProductSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    price :{
        type: Number,
        required : true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    category_id:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})

module.exports = model('Product',ProductSchema);