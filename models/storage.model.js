const mongoose = require('mongoose');

const storageSchema = mongoose.Schema({
    fruit:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Fruit'
    },
    name:{
        type:String,
        ref:'Fruit'
    },
    amount:Number  
},
{
    timestamps:true
})

module.exports = mongoose.model('Storage',storageSchema)