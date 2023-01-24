const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const crypto = require("crypto");
const morgan = require('morgan');
const mongoose =require('mongoose');

const Fruit = require('./models/fruit.model')
const Storage = require('./models/storage.model')

const app = express()
app.use(morgan("tiny"));


const schema = buildSchema(`
    type Query {
        findFruit: [Fruit!]!
        findStorage: [Storage]!
    }

    type Fruit{
        _id:ID!,
        name: String!,
        description: String!,
        limit: Int!
    }
     
    input CreateFruitInput{
        name: String!,
        description: String!,
        limit:Int!
    }

    input UpdateFruitInput{
        _id:ID!
        name: String,
        description: String,
        limit:Int
    }

    input DeleteFruitInput{
        _id:ID!
    }


    type Storage {
        _id: ID!
        fruit : ID!
        name:String!
        amount: Int!
    }

    input AddStorageInput {
        fruit:ID!
        name:String!
        amount:Int!
    }

    input UpdateStorageInput {
        _id:ID!
        fruit:String
        name:String
        amount:Int!
    }

    type Mutation {
        createFruitForStorage(fruits: CreateFruitInput): Fruit
        updateFruitForStorage(fruits: UpdateFruitInput): Fruit
        deleteFruitForStorage(fruits: DeleteFruitInput): Boolean
        storeFruitToStorage(fruits: AddStorageInput): Storage
        removeFruitFromStorage(fruits: UpdateStorageInput): Storage
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`);

let FruitDB = [];
let storageDB = [];

const resolver = {
    findFruit: async ()=> {
        let fruits = await Fruit.find()
        return fruits
    },
    findStorage : async()=>{
        let storage = await Storage.find()
        return storage;
    },
    storeFruitToStorage: async (input)=> {
        let fruit = await 
        let storage = await Storage.findOneAndUpdate({fruit: input.fruits.fruit},input.fruits,{new:true,upsert:true})
        return storage
    },
    
    createFruitForStorage: async (args)=>{
        let fruit = await Fruit.create(args.fruits)
        return fruit.toObject();
    },

    updateFruitForStorage: async (input)=>{
        let body = input.fruits
        delete body._id;
        let storage = await Fruit.findByIdAndUpdate(input.fruits._id,{$set:{body}},{new:true});
        return storage
    },
    
    deleteFruitForStorage: async (input)=>{
        let fruit = await Fruit.findByIdAndDelete(input.fruits._id);
        return fruit
    },

    removeFruitFromStorage: async (input)=>{
        let fruit = await Storage.findOneAndUpdate({name:input.fruits.name},{$set:{amount:input.fruits.amount}},{new:true})
        return fruit;
    }
}



app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolver
}))

mongoose.connect('mongodb://127.0.0.1:27017/GraphQL').then(()=> console.log('MongoDB Connected on Local')).catch(err=> console.log(err));

app.listen(4000,()=>console.log('server is listening to 4000'))