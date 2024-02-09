let count = localStorage.getItem("counter"); // getting the last value of the number of entries from local storage

const input_name = document.getElementById("item_name"); // getting the item name input field HTMLElement
const input_cost = document.getElementById("item_cost"); // getting the item cost input field HTMLElement

const input_name_update = document.getElementById("item_name_update"); // getting the update item name input field HTMLElement
const input_cost_update = document.getElementById("item_cost_update"); // getting the update item cost input field HTMLElement

const table = document.getElementById("expenseTable"); // getting the table HTMLElement

const totalElement = document.getElementById("total"); // getting the HTMLElement of the total output

let total = 0.0; // creating a variable to store the total of all expenses combined

function addEntry() {

    if (input_name.value.length >= 1 && input_cost.value >= 0.01 && input_name.value.length <= 15 && input_cost.value.length <= 15) { // if statement, used to ensure both item name and cost are between 1 - 15 characters long
      if (input_name.value.match('[A-Za-z0-9]')) {
      count++; // increasing the total number of entries by 1

      localStorage.setItem("counter", count); // storing the new total number of entries in local storage

      localStorage.setItem("entry " + count, input_name.value + "," + input_cost.value); // storing the new entry/expense in local storage using ',' as a divider between 2 variables (name and cost)

      location.href = 'index.html'; // redirecting back to the main page

      }else{
        alert("Special characters not allowed")
      }
    } else {
      if (input_name.value.length < 1 || input_cost.value.length < 1) { // checking if at least one input field is empty
        alert("One or more textbox is empty!");
      } else if (input_cost.value <= 0) { // checking if at the cost input field contains a value is less than 0
        alert("You have inputted a negative cost! or 0")
      } else { // if both the previous 2 statements fail, then the character limit was exceeded
        alert("Character limit exceeded (15 characters)");
      }
    }

}
function updateTable() {
  for (let x = 1; x <= count; x++) { // looping for as many times as there are expenses/entries, in order to display each one as a row in the table.

    let localstorage_entry = localStorage.getItem("entry " + x); // getting the value of entry x

    let newRow = table.insertRow(); // inserting a new row in the table
    let cell1 = newRow.insertCell(0); // inserting a cell in the previously created row
    let cell2 = newRow.insertCell(1); // inserting a cell in the previously created row
    let cell3 = newRow.insertCell(2); // inserting a cell in the previously created row
    let cell4 = newRow.insertCell(3); // inserting a cell in the previously created row

    cell1.innerHTML = x.toString(); // updating cell to the current value of x (each row will get a number incrementing each time with the for loop)
    cell2.innerHTML = localstorage_entry.substring(0, localstorage_entry.indexOf(',')); // updating cell to the text in the entry found in local storage ONLY until the comma.
    cell3.innerHTML = "€" + parseFloat(localstorage_entry.substring(localstorage_entry.indexOf(',') + 1)).toFixed(2); // updating cell to the text in the entry found in local storage ONLY after the comma.

    // inserting a 'Update' and 'Delete' button in the 4th cell, making the 'Update' button store the ID of the button pressed in local storage, and a redirect to 'update.html'
    // The 'Delete' button is set to run the removeEntry() function
    cell4.innerHTML = "<button class = \"btn btn-outline-success\" type = \"button\" onclick = \" localStorage.setItem('updateButtonClicked',this.id); location.href = 'update.html'\" id = \"updateButton" + x + "\"" + ">Update</button>" + " " + "<button class = \"btn btn-outline-danger\" type = \"button\" onclick = \"removeEntry(this.id)\" id = \"removeButton" + x + "\">Delete</button>";

    total = total + parseFloat(localstorage_entry.substring(localstorage_entry.indexOf(',') + 1)); // getting the cost value of the current entry being accessed by the for loop and converting it from String to Float, in order to calculate the total
  }
  totalElement.innerHTML = "Total: €" + total.toFixed(2); // displaying the total cost to 2 decimal places
}

function updateEntry() {
  let updateButtonClicked = localStorage.getItem("updateButtonClicked"); // getting the ID from local storage, of the update button which was clicked
  let selectedEntryNo = updateButtonClicked.substring(updateButtonClicked.indexOf('n') + 1); // getting the entry/expense number from the ID of the button clicked (each button is numbered ex; updateButton1,updateButton2,..)
    if (input_name_update.value.length >= 1 && input_cost_update.value.length >= 1 && input_cost_update.value >= 0 && input_name_update.value.length <= 15 && input_cost_update.value.length <= 15) { // if statement, used to ensure both item name and cost are between 1 - 15 characters long
      if (input_name_update.value.match('[A-Za-z0-9]')) {
      localStorage.setItem("entry " + selectedEntryNo, input_name_update.value + "," + input_cost_update.value); // updating the chosen entry/expense with the new values in local storage
      location.href = 'index.html'; // redirecting back to main page
      }else{
        alert("Special characters are not allowed");
      }
    } else {
      if (input_name_update.value.length < 1 || input_cost_update.value.length < 1) { // checking if at least one input field is empty
        alert("One or more textbox is empty!");
      } else if (input_cost_update.value < 0) { // checking if at the cost input field contains a value is less than 0
        alert("You have inputted a negative cost!")
      } else { // if both the previous 2 statements fail, then the character limit was exceeded
        alert("Character limit exceeded (15 characters)");
      }
    }
}

function removeEntry(buttonID) {
  let currentEntryNo = parseInt(buttonID.substring(buttonID.indexOf('n') + 1)); // every update button is called 'updateButton' with a number at the end, this means the number after the letter 'n' indicates entry number.

  let maxCount = count; // creating a variable maxCount to store the total number of entries before removal a certain entry
  let tempEntryContents = ""; // variable used to temporarily store entry/expense contents

  for (let i = currentEntryNo; i <= maxCount; i++) { // looping from the entry/expense deleted until the last entry, in order to number each entry/expense correctly
    if (i === currentEntryNo) { // if i, is equal to the entry chosen to be removed:
      localStorage.removeItem("entry " + currentEntryNo); // the entry/expense is deleted from local storage
      count--; // the total number of entries/expenses is reduced by 1
      localStorage.setItem("counter", count); // the total number of entries/expenses is updated in local storage
    } else { // for all other entries:
      tempEntryContents = localStorage.getItem("entry " + i); // storing entry contents
      localStorage.removeItem("entry " + i); // removing entry
      localStorage.setItem("entry " + (i - 1), tempEntryContents); // adding the same entry once again and setting the entry number to 1 less, in order to re-order to the table
    }
  }
  window.location.reload(); // reloading page so that the table is updated
}
