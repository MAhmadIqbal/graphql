const mongoose = require('mongoose');

const fruitSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:(true,'Fruit Already Exist')
    },
    description:String,
    limit:Number  
},
{
    timestamps:true
})

module.exports = mongoose.model('Fruit',fruitSchema)