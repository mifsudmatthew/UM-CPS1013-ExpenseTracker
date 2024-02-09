const input_name = document.getElementById("item_name"); // getting the item name input field, HTMLElement
const input_cost = document.getElementById("item_cost"); // getting the item cost input field, HTMLElement
const input_name_update = document.getElementById("item_name_update"); // getting the update item name input field HTMLElement
const input_cost_update = document.getElementById("item_cost_update"); // getting the update item cost input field HTMLElement
const table = document.getElementById("expenseTable"); // getting the table HTMLElement
const totalElement = document.getElementById("total"); // getting the HTMLElement of the total output

let total = 0.0; // declaring a variable to store the total of all expenses combined
let localList = []; // declaring a variable to store the expenseList obtained from the server
let listSize; // declaring a variable to store the size of the localList array
let request; // declaring a variable to store requests which will be sent to the server.

function updateTable() {

  getList(); // sending a request to the server to return the expense list, and then update the variables localList and listSize accordingly.

  for (let x = 1; x <= listSize; x++) { // looping for as many times as there are expenses/entries, in order to display each one as a row in the table.

    let newRow = table.insertRow(); // inserting a new row in the table
    let cell1 = newRow.insertCell(0); // inserting a cell in the previously created row
    let cell2 = newRow.insertCell(1); // inserting a cell in the previously created row
    let cell3 = newRow.insertCell(2); // inserting a cell in the previously created row
    let cell4 = newRow.insertCell(3); // inserting a cell in the previously created row

    cell1.innerHTML = x.toString(); // updating cell to the current value of x (each row will get a number incrementing each time with the for loop)

    /* updating cell to the contents inside the array, with index x-1, since the array starts from 0
      Since data is sent in JSON format: '{"item_name":"","item_cost":""}'
      We divide the entry contents in substrings to get separate the actual data values from the curly brackets, commas, speech marks etc
    */
    cell2.innerHTML = localList[x-1].substring(14,localList[x-1].indexOf(',')-1);

    /* updating cell to display the total cost of all expenses , using the same method in the previous line
    */
    cell3.innerHTML = "€" + (parseFloat(localList[x-1].substring(localList[x-1].indexOf(',')+14,localList[x-1].indexOf('}')-1))).toFixed(2);

    // inserting a 'Update' and 'Delete' button in the 4th cell with a unique ID and making the 'Update' button run the getUpdateButtonClicked(ID) function
    // The 'Delete' button is set to run the removeExpense(ID) function
     cell4.innerHTML = "<button class = \"btn btn-outline-success\" type = \"button\" onclick = \"getUpdateButtonClicked(this.id)\" id = \"updateButton" + x + "\"" + ">Update</button>" + " " + "<button class = \"btn btn-outline-danger\" type = \"button\" onclick = \"getRemoveButtonClicked(this.id)\" id = \"removeButton" + x + "\">Delete</button>";

     total = total + parseFloat(localList[x-1].substring(localList[x-1].indexOf(',')+14,localList[x-1].indexOf('}')-1)); // adding the cost of all entries in the total variable
  }
     totalElement.innerHTML = "Total: €" + total.toFixed(2); // displaying the total cost to 2 decimal places
}

function getList() {
  request = new XMLHttpRequest(); // creating an XMLHTTPRequest object
  request.open("GET", '/getList', false); // initialising the request as a GET request, setting the request route to /getList, which is a route that returns the expense list back.
  request.send(null); // sending the request to the server
  localList = JSON.parse(request.responseText); // storing the received list in a variable whilst parsing it from a JSON String in order to convert it to an array format.
  listSize = localList.length; // storing the list size/length in a variable
}

function getRemoveButtonClicked(ID){
  request = new XMLHttpRequest(); // creating an XMLHTTPRequest object
  request.open('POST','/removeExpense',true); // initialising the request as a POST request, setting the request route to /removeExpense, which is the route to which the ID of the button clicked will be sent.
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // specifying that data is sent as a single block.
  request.send("ID=" + encodeURIComponent(ID)); // sending the ID in JSON format to the server
  window.location.reload(); // reloading the page to show updated table
}

function getUpdateButtonClicked(ID) {
  request = new XMLHttpRequest(); // creating an XMLHTTPRequest object
  request.open('POST','/getUpdateButtonClicked',true); // initialising the request as a POST request, setting the request route to /getUpdateButtonClicked, which is the route to which the ID of the button clicked will be sent.
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // specifying that data is sent as a single block.
  request.send("ID=" + encodeURIComponent(ID)); // sending the ID in JSON format to the server
  window.location.href = '/update'; // redirecting the user to the 'update.html' page.
}
