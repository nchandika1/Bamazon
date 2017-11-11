-- Delete database if it already exists --
DROP DATABASE IF EXISTS bamazon_db;

-- Create a new database for Bamazon --
CREATE DATABASE bamazon_db;

-- Use this database for the following code --
USE bamazon_db;

-- Create a table called products and define its fields --
CREATE TABLE products(
	id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
	product VARCHAR(20) NOT NULL,
	department VARCHAR(20) NOT NULL,
	price FLOAT(20) DEFAULT 0.00,
	stock_quantity INTEGER(10) DEFAULT 0
);

-- Create products/inventory --
INSERT INTO products (product, department, price, stock_quantity)
VALUES ("Adidas UB Shoes", "Shoe", 150.00, 10);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("Multi Vitamins", "Food", 20.00, 100), ("Quinoa", "Food", 100.00, 20), ("Dark Chocolate Chips", "Food", 5.00, 200);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("Basketball", "Sports", 5.00, 200), ("Baseball Glove", "Sports", 7.50, 200), ("Tennis Racket", "Sports", 15.75, 300);

-- View inventory --
SELECT * FROM products;
