var inquirer = require("inquirer"); // User input from the terminal
var mysql = require("mysql"); // MySQL database 
require("console.table"); // Print Tables

var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password:"",
	port: 3306,
	database: "bamazon_db"
});

var menu_options = ["View Departments", "View product Sales by Department", "Create new Department",  "Exit"];

function prettyPrintSalesByDepartment(response) {
	var columns = ["department_id", "department_name", "total_over_head", "total_sales", "total_profits"];

	var rows = [];
	for (var i=0; i< response.length; i++) {
		var items = [];
		items.push(response[i].id);
		items.push(response[i].name);
		items.push(response[i].overhead);
		items.push(response[i].total_sales == null ? 0 : response[i].total_sales);
		items.push(response[i].total_profits == null ? 0 : response[i].total_profits);
		rows.push(items);
	}
	console.table(columns, rows);
}

function productSalesByDept() {
	var query = "SELECT departments.id, departments.name, SUM(products.sales) AS total_sales, departments.overhead, (SUM(products.sales) - departments.overhead) AS total_profits";
	query += " FROM departments LEFT JOIN products";
	query += " ON departments.name = products.department";
	query += " GROUP BY departments.id, products.department, departments.name, departments.overhead";

	connection.query(query, function(error, response) {
		if (error) throw error;
		prettyPrintSalesByDepartment(response);
		runSupervisorOperations();
	});
}

function createNewDept() {
	inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Department Name: "
		},
		{	
			type: "input",
			name: "overhead",
			message: "Over head Costs: "
		}
	])
	.then(function(answers){
		var post = {
			name: answers.name,
			overhead: answers.overhead
		}

		// Send INSERT mySQL query to the database to create a new department
		connection.query("INSERT INTO departments SET ?", post, function(error, response) {
			if (error) throw error;
			console.log("Added department.");
			runSupervisorOperations();
		});
	});
}


// Pretty Print database entries in a table format using console.table 
function prettyPrintAllProducts(response) {
	var columns = ['ID', 'Product', 'Product Sales', 'Department', 'Price ($)', 'Stock'];
	var entries = [];

	for (var i=0; i<response.length; i++) {
		var item = [];
		item.push(response[i].id);
		item.push(response[i].product);
		item.push(response[i].sales);
		item.push(response[i].department);
		item.push(response[i].price);
		item.push(response[i].stock_quantity);
		entries.push(item);
	}
	// Display in a table format
	console.table(columns, entries);
}

// Main Function for Bamazon Supervisor Opeartions
function runSupervisorOperations() {
	// Prints the table format for the responses
	connection.query("SELECT * FROM products", function(error, response) {
		prettyPrintAllProducts(response);
		console.log();
		inquirer.prompt([
			{
				type: "list",
				name: "options",
				message: "What would you like to do? ",
				choices: menu_options
			}
		])
		.then(function(answers){
			switch (answers.options) {
				case menu_options[0]:
					prettyPrintDepartments();
					break;
				case menu_options[1]:
					productSalesByDept();
					break;
				case menu_options[2]:
					createNewDept();
					break;
				case menu_options[3]:
					console.log("Thank you for using Department view! Exiting...")
					connection.end();
					break;
				default:
					console.log("Invalid Option!");
					connection.end();
					break;
			}
		});
	});
}

function prettyPrintDepartments() {
	// Run SELECT * query to the departments table of bamazon_db and print all
	connection.query("SELECT * FROM departments", function(error, response) {
		var columns = ["department_id", "department_name", "over_head_costs"];
		var rows = [];
		for (var i = 0; i<response.length; i++) {
			// Create an array of elements in a given row
			var items = [];
			items.push(response[i].id);
			items.push(response[i].name);
			items.push(response[i].overhead);

			// Add the entire row to the array of rows
			rows.push(items);
		}

		// Pass both columns array and rows array to the console.table package for pretty print
		console.table(columns, rows);

		// Back to the main menu
		runSupervisorOperations();
	});
	
}


// Connect to the DB first so we can start the queries
connection.connect(function(error) {
	console.log("\nWELCOME TO BAMAZON SUPERVISOR VIEW!");
	console.log("-------------------------------------\n");
	
	// Run the main Supervisor operations
	runSupervisorOperations();
});