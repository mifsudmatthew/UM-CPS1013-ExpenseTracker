const express = require('express'); // importing the ExpressJS module
const MongoClient = require('mongodb').MongoClient; // importing the MongoDB module
const app = express(); // creating an ExpressJS application, by calling the variable express as a function.
const url = "mongodb+srv://SoftwareProject:A1AOQXInd5PHbgkA@cluster0.td6nabi.mongodb.net/?retryWrites=true&w=majority";
const port = 3000; // setting the port on which the server will listen
const path = require('path'); // importing the path module, which provides us with utilities for directories/paths.
const {ObjectId} = require("mongodb"); // getting the type ObjectId from the mongodb module
let expenseList = []; // declaring an array used to store expenses
let deleteExpense; // declaring a variable to store the index of the expense to be deleted
let updateButtonClicked; // declaring a variable to store the index of the update button clicked

app.use(express.urlencoded({extended: true})); // parsing incoming requests with essential data, to send data between client and server
app.use(express.static('public')); // setting the public folder as directory that can be publicly accessed

const mongoConnect = function(callback){ // creating a variable which makes a connection to the MongoDB database.
        MongoClient.connect(url) // connecting to the database URL
          .then(client => {
            callback(client);  // using callback to be able to make use of a single MongoDB connection shared with multiple other functions.
          })
          .catch(error => {
            console.log(error); // printing the error reason in case of an error
            throw new Error('Connection failed');
          })
}
app.post('/removeExpense', function(req, res){
  mongoConnect((client)=>{ // making use of the MongoDB connection created prior
    client.db('SoftwareProjectDB') // accessing/creating database 'SoftwareProjectDB'
      .collection('item-data') // accessing/creating collection 'item-data'
        .find() // getting the contents within the collection
          .toArray() // converting the contents to an array
            .then((MongoData)=>{ // storing the array in variable MongoData
            deleteExpense = JSON.stringify(req.body); // storing the data sent from the client, which contains the ID of the remove button clicked, in the variable deleteExpense
            deleteExpense = deleteExpense.substring(deleteExpense.indexOf('n')+1,deleteExpense.indexOf('}')-1); // separating the index of the button clicked from the rest of the data
            deleteExpense = parseInt(deleteExpense) - 1; // converting the String integer to Int and reducing the value by 1 since the array starts from 0
            client.db('SoftwareProjectDB').collection('item-data').deleteOne({"_id": ObjectId(MongoData[deleteExpense]._id.toString())});}) // deleting the expense in the MongoDB database which has the same ObjectId as the chosen entry in array MongoData
              .catch(err => console.log(err));
            setTimeout(() => {client.close()},500); // closing the connection to MongoDB after 500ms
});

});
app.post('/addExpense', function(req, res){
  mongoConnect((client)=>{ // making use of the MongoDB connection created prior
       client.db('SoftwareProjectDB') // accessing/creating database 'SoftwareProjectDB'
          .collection('item-data') // accessing/creating collection 'item-data'
            .insertOne(req.body) // storing expense inside the MongoDB collection
              .catch(err => console.log(err));
       setTimeout(() => {client.close()},500); // closing the connection to MongoDB after 500ms
  })
   res.redirect('/');
  });

app.get('/getList', function(req, res){
  mongoConnect((client)=>{ // making use of the MongoDB connection created prior
    client.db('SoftwareProjectDB') // accessing/creating database 'SoftwareProjectDB'
      .collection('item-data') // accessing/creating collection 'item-data'
        .find() // getting the contents within the collection
          .toArray() // converting the contents to an array
            .then((MongoData)=>{ // storing the array in variable MongoData
              expenseList = MongoData; // updating the expense list on the server with the contents of the MongoDB database
              res.json(expenseList)}) // sending the expense list to the client
                .catch(err => console.log(err));
    setTimeout(() => {client.close()},500); // closing the connection to MongoDB after 500ms
  })
});

app.post('/updateExpense', function(req, res){
  mongoConnect((client)=>{ // making use of the MongoDB connection created prior
    client.db('SoftwareProjectDB') // accessing/creating database 'SoftwareProjectDB'
      .collection('item-data') // accessing/creating collection 'item-data'
        .find() // getting the contents within the collection
          .toArray() // converting the contents to an array
            .then((MongoData)=>{ // storing the array in variable MongoData
              client.db('SoftwareProjectDB').collection('item-data').updateOne({"_id": ObjectId(MongoData[updateButtonClicked]._id.toString())}, {$set: {item_name: req.body.item_name, item_cost: req.body.item_cost}})}) // updating the expense in the MongoDB database which has the same ObjectId as the chosen entry in array MongoData, with the new item name and cost sent from the client
                .catch(err => console.log(err));
    setTimeout(() => {client.close()},500); // closing the connection to MongoDB after 500ms
  })
  res.redirect('/'); // redirecting the user to the main page
});

app.post('/getUpdateButtonClicked', function(req, res){
  updateButtonClicked = JSON.stringify(req.body); // storing the data sent from the client, which contains the ID of the update button clicked, in the variable updateExpense
  updateButtonClicked = updateButtonClicked.substring(updateButtonClicked.indexOf('n')+1,updateButtonClicked.indexOf('}')-1); // separating the index of the button clicked from the rest of the data
  updateButtonClicked = parseInt(updateButtonClicked) - 1; // converting the String integer to Int and reducing the value by 1 since the array starts from 0
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
