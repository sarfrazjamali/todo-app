const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authJwt');
const {createTodo,getAllTodos,updateTodo,deleteTodo} = require('../controllers/todoController');

router.post('/create-todo',authenticateToken,createTodo);
router.get('/get-all-todos/:userId', authenticateToken,getAllTodos);
router.post('/update-todo/:id', authenticateToken,updateTodo);
router.post('/delete-todo/:id',authenticateToken,deleteTodo);

module.exports = router;