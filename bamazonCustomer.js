var inquirer = require("inquirer"); // User input from the terminal
var mysql = require("mysql"); // MySQL database 
require("console.table"); // Print Tables


// Connection parameters for the MySQL database
var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db"
});

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

// Process order given product id and the quantity as entered by the user
// Print success or out of stock based on the quantity from the Inventory entry
// Also update the stock in the database for the product ID after it is sold
function processOrder(productId, quantity) {
	console.log("\nChecking for Product ID: " + productId + " for Quantity: " + quantity);

	var query = connection.query("SELECT * FROM products", function(err, resp) {
		if (err) throw err;
		var product = resp[productId-1];
		if (quantity <= product.stock_quantity) {

			// Calculate the new Quantity to be saved after this purchase
			var newQuantity = product.stock_quantity-quantity;

			// Add quantity * purchase price to the product sales field
			var totalSales = product.sales + quantity * product.price;

			console.log("Product is in stock!");
			connection.query(
			"UPDATE products SET ? WHERE ?",
			[
				{
					stock_quantity: newQuantity,
					sales: totalSales
				},
				{
					id: productId
				}
			],
			function(err) {
				if (err) throw err;
				console.log("Success! Thank you for placing the order!")
				bamazon();				
			});
		} else {
			console.log("Sorry! Not in stock.");
			bamazon();
		}
	});
}

// Get the product Id and the quantity information from the user using "inquirer"
function getOrderInformation() {
	// Get which product the customer would like to purchase
	inquirer.prompt([
		{
			type: "input",
			name: "product_id",
			message: "Enter ID of the product to buy: [Q for quit] ",
			validate: function(value) {
				if (value.toUpperCase() == 'Q') {
					return true;
				}
				if (isNaN(parseInt(value)))
					return false;
				return true;
			}
		},
		{
			type: "input",
			name: "quantity",
			message: "Enter Quantity: [Q for Quit] ",
			when: function(answers) {
				// This prompt is displayed only if the previous one goes through
				if (answers.product_id == 'Q' || answers.product_id == 'q' ) {
					return false;
				}
				return true;
			},
			validate: function(value) {
				if (value.toUpperCase() == 'Q') {
					return true;
				}
				if (isNaN(parseInt(value)))
					return false;
				return true;
			}
		}
	])
	.then(function(resp){
		if (resp.product_id.toUpperCase() == 'Q' || resp.quantity.toUpperCase() == 'Q') {
			// User chose to exit!
			console.log("Exiting...");
			connection.end();  // End connection to the database now
			return;
		}

		// Process the order now that all conditions have been checked
		processOrder(resp.product_id, resp.quantity);	
	});
}

// Main Function for Bamazon  
// First display all existing inventory so the user can choose.
function bamazon() {
	console.log("\nWELCOME TO BAMAZON!");
	console.log("-------------------\n");
	// Get all the entries from the table and pretty print the values
	var query = connection.query("SELECT * from products", function(error, response) {
		if (error) throw error;
		// Prints the table format for the responses
		prettyPrintAllProducts(response);
		getOrderInformation();
	});
}

// Connect to the DB first so we can start the queries
connection.connect(function(err) {
	if (err) throw err;
	// Run Bamazon
	bamazon();
});


