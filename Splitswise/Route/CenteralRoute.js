const express=require("express")
const { Signup, Login } = require('../Controller/User_Controller');
const { addEqualExpense,getExpensesByUserId} = require('../Controller/Expense_Controller');
const JWT=require('../Utlities/util');
const { mailSender } = require("../Utlities/mail_Helper");
const AuthRoute=express.Router();

AuthRoute.post('/signup',Signup)
AuthRoute.get('/login',Login)
// AuthRoute.post('/expenses',JWT.validateToken,addNewExpense)
AuthRoute.post('/users/expenses',addEqualExpense,mailSender)
AuthRoute.get('/users/expenses',getExpensesByUserId)

AuthRoute.use((req, res) => {
    res.status(404).send('Not Found');
  });
module.exports=AuthRoute



