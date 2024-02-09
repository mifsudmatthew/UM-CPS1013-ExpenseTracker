const express = require('express'); // importing the ExpressJS module
const app = express(); // creating an ExpressJS application, by calling the variable express as a function.
const port = 3000; // setting the port on which the server will listen
const path = require('path'); // importing the path module, which provides us with utilities for directories/paths.
let expenseList = []; // declaring an array used to store expenses
let newExpense; // declaring a variable to store the data of a new expense
let deleteExpense; // declaring a variable to store the index of the expense to be deleted
let updateExpense; // declaring a variable to store the new data to update an expense
let updateButtonClicked; // declaring a variable to store the index of the update button clicked

app.use(express.urlencoded({extended: true})); // parsing incoming requests with essential data, to send data between client and server
app.use(express.static('public')); // setting the public folder as directory that can be publicly accessed

app.post('/addExpense', function(req, res){
  newExpense = JSON.stringify(req.body); // storing the data of a new expense sent from the client in the variable newExpense
  expenseList.push(newExpense); // storing the new expense in the array expenseList
  res.redirect('/'); // redirecting the user to the main page
});

app.post('/updateExpense', function(req, res){
  updateExpense = JSON.stringify(req.body); // storing the new data to update the expense sent from the client in the variable updateExpense
  expenseList[updateButtonClicked] = updateExpense; // updating the expense which corresponds to the update button clicked, with the new data in the variable updateExpense
  res.redirect('/'); // redirecting the user to the main page
});

app.post('/removeExpense', function(req, res){
  deleteExpense = JSON.stringify(req.body); // storing the data sent from the client, which contains the ID of the remove button clicked, in the variable deleteExpense
  deleteExpense = deleteExpense.substring(deleteExpense.indexOf('n')+1,deleteExpense.indexOf('}')-1); // separating the index of the button clicked from the rest of the data
  deleteExpense = parseInt(deleteExpense) - 1; // converting the String integer to Int and reducing the value by 1 since the array starts from 0
  expenseList.splice(deleteExpense,1); // deleting the chosen expense from the array
});

app.post('/getUpdateButtonClicked', function(req, res){
  updateButtonClicked = JSON.stringify(req.body); // storing the data sent from the client, which contains the ID of the update button clicked, in the variable updateExpense
  updateButtonClicked = updateButtonClicked.substring(updateButtonClicked.indexOf('n')+1,updateButtonClicked.indexOf('}')-1); // separating the index of the button clicked from the rest of the data
  updateButtonClicked = parseInt(updateButtonClicked) - 1; // converting the String integer to Int and reducing the value by 1 since the array starts from 0
});

app.get('/getList', function(req, res){
    res.json(expenseList); // sending expenseList as a JSON back to client
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html')); // sending the main page 'index.html' back to client
});

app.get('/create', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/create.html')); // sending the main page 'create.html' back to client
});

app.get('/update', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/update.html')); // sending the main page 'update.html' back to client
});

app.listen(port, () => { // application listening on specified port (3000)
  console.log(`Server is active and listening on port ${port}`);
});
