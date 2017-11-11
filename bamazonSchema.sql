--
--	PRODUCTS DATABASE
--

-- Delete database if it already exists --
DROP DATABASE IF EXISTS bamazon_db;

-- Create a new database for Bamazon --
CREATE DATABASE bamazon_db;

-- Use this database for the following code --
USE bamazon_db;

-- DROP TABLE if an old one exists --
DROP TABLE IF EXISTS products;

-- Create a table called products and define its fields --
CREATE TABLE products(
	id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
	product VARCHAR(20) NOT NULL,
	department VARCHAR(20) NOT NULL,
	price DECIMAL(10, 2) DEFAULT 0,
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

SELECT * FROM products WHERE (stock_quantity <= 20);

SELECT * FROM products WHERE (product = "Quinoa");

UPDATE products SET stock_quantity=50 WHERE product="Quinoa";

--
--	DEPARTMENT DATABASE
--

-- DROP TABLE if an old one exists --
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
	id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
	name VARCHAR(20) NOT NULL,
	overhead INTEGER(20) DEFAULT 0
);

INSERT INTO departments (name, overhead)
VALUES ("Shoe", 10000), ("Food", 5000), ("Apparel", 7500), ("Accessories", 2000), ("Sports", 5000), ("Pantry", 10000);

INSERT INTO departments (name)
VALUES ("Books");

SELECT * FROM departments;

-- EXAMPLE OF LEFT JOIN WITH DEPARTMENTS WITH AGGREGATED SALES FROM ALL PRODUCTS FOR THE CORRESPONDING DEPT --

SELECT departments.name, SUM(products.sales) AS total_sales, departments.overhead
FROM departments
LEFT JOIN products
ON departments.name = products.department
GROUP BY products.department, departments.name, departments.overhead;

SELECT departments.name, SUM(products.sales) AS total_sales, departments.overhead, (SUM(products.sales) - departments.overhead) AS total_profits
FROM departments
LEFT JOIN products
ON departments.name = products.department
GROUP BY products.department, departments.name, departments.overhead;









