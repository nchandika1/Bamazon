var inquirer = require("inquirer"); // User input from the terminal
var mysql = require("mysql"); // MySQL database 
require("console.table"); // Print Tables

// Connection parameteres for the bamazon_db
var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
	port: 3306,
	database: "bamazon_db"
});

// Store menu options in an array so we can use them later on instead of hard coding in the switch statement
var menu_options = ["View products for sale", "View low inventory", "Add inventory", "Add a new product", "Exit"];

// Pretty Print database entries in a table format using console.table 
function prettyPrintAllProducts(response) {
	var columns = ['ID', 'Product', 'Department', 'Price ($)', 'Stock'];
	var entries = [];

	for (var i=0; i<response.length; i++) {
		var item = [];
		item.push(response[i].id);
		item.push(response[i].product);
		item.push(response[i].department);
		item.push(response[i].price);
		item.push(response[i].stock_quantity);
		entries.push(item);
	}
	// Display in a table format
	console.table(columns, entries);
}

// Print database entries in a table format using console.table 
function viewInventoryForSale() {
	// Get all the entries from the table and pretty print the values
	var query = connection.query("SELECT * from products", function(error, response) {
		if (error) throw error;
		// Prints the table format for the responses
		prettyPrintAllProducts(response);

		// Go back to the menu
		bamazonManager();
	});
}

// Print database entries with low inventory only in a table format using console.table 
function viewLowInventory() {
	var query = connection.query("SELECT * FROM products WHERE (stock_quantity < 5)", function(error, response) {
		if (error) throw error;
		if (response.length > 0) {
			// Prints the table format for the responses
			prettyPrintAllProducts(response);
		} else {
			console.log("No inventory below 5.");
		}
		console.log(); // Add an extra line
		// Go back to the menu
		bamazonManager();
	});
}

// Update a specific product with the amount entered by the user
function updateInventory() {
	inquirer.prompt([
		{
			type: "prompt",
			name: "product_id",
			message: "Which product would you like to update? "
		},
		{
			type: "prompt",
			name: "quantity",
			message: "Enter the amount to be updated: ",
			validate: function(values) {
				if (isNaN(parseInt(values))) {
					return false;
				}
				return true;
			}
		}
	])
	.then(function(answers) {
		var newQuantity = 
		// Send update mySQL query for the given product and quantity
		connection.query("UPDATE products SET stock_quantity = ? WHERE product = ?", [answers.quantity, answers.product_id], 
			function(error, response) {
			if (error) throw error;
			if (response.changedRows == 0) {
				console.log("Update Failed!");
			} else {
				console.log("Update complete!");
				bamazonManager();
			}
		});

	});
}

// Add a new product into the database
function addNewProduct() {
	inquirer.prompt([
		{	
			type: "input",
			name: "product",
			message: "Product Name: "
		},
		{
			type: "input",
			name: "department",
			message: "Department Name: "
		},
		{
			type: "input",
			name: "price",
			message: "Price per item: ",
			validate: function(values) {
				if (isNaN(parseFloat(values))) {
					return false;
				}
				return true;
			}
		},
		{
			type: "input",
			name: "stock",
			message: "Quantity: ",
			validate: function(values) {
				if (isNaN(parseInt(values))){
					return false;
				}
				return true;
			}
		}
	])
	.then(function(answers) {
		console.log(answers);
		var post = { 
			product: answers.product,
			department: answers.department,
			price: answers.price,
			stock_quantity: answers.stock
		};

		// Send INSERT mySQL query to add a new product into the database
		connection.query("INSERT INTO products SET ?", post, function(error, response) {
				if (error) throw error;
				console.log("Success: Added product " + response.product + ".");
				bamazonManager();
		});
	});
}

function bamazonManager() {
	// First display all inventory
	inquirer.prompt([
		{
			type: "list",
			name: "option",
			message: "What would you like to do? ",
			choices: menu_options
		}
	])
	.then(function(answers) {
		switch (answers.option) {
			case menu_options[0]:
				viewInventoryForSale();
				break;
			case menu_options[1]:
				viewLowInventory();
				break;
			case menu_options[2]:
				updateInventory();
				break;
			case menu_options[3]:
				addNewProduct();
				break;
			case menu_options[4]:
				console.log("Thank you for visiting Bamazon! Bye.");
				connection.end();
				break;
			default:
				console.log("Invalid Option!");
				connection.end();
				break;
		}
	});
}

// Connect to the database before starting anything
connection.connect(function(err) {
	if (err) throw err;
		// Ready to perform Bamazon Manager functions
		bamazonManager();
});
