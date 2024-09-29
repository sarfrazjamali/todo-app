const ToDo = require('../models/todoList');

exports.createTodo = async(req,res) => {
    try{
    const data = req.body;
    const todo = new ToDo(data);
    const result =  await todo.save();
    console.log(result);
    res.status(201).send({message:"Created New ToDo !"})
    }catch(err){
        console.error(err);
        res.status(500).send({message:"Error creating task",error:err.message})
        
    } ;
};

//get All todos of specific user
exports.getAllTodos = async (req,res) => {
    const{userId} = req.params;
    console.log(userId);
    
    try{
        if(!userId) return res.status(400).send({message:"User ID id required"});
        const result  = await ToDo.find({createdBy:userId});
        res.send(result);

    }catch(err){
        console.log(err);
        res.status(400).send(err);
        
    };
};

//UPDATE A TODO
exports.updateTodo = async (req,res) => {
    try{
        const{id} = req.params;
        const data  = req.body;
        const result =  await ToDo.findByIdAndUpdate(id,{$set:data},{returnOriginal:false});
        console.log(result);
        res.send({message:'Todo List Updated!'});
    }catch(err){
        console.log(err);
        res.status(400).send(err);  
    };
};

//DELETE TODO
exports.deleteTodo = async (req,res) => {
    try{
        const {id} = req.params;
        const result = await ToDo.findByIdAndDelete(id);
        console.log(result);
        res.send({message:'ToDo Task Deleted !'}); 
    }catch(err){
        console.log(err);
        res.status(400).send(err);    
    };
};