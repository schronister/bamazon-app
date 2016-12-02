CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(200),
department_name VARCHAR(200),
price FLOAT,
stock_quantity INTEGER,
PRIMARY KEY (item_id));

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Space Suit","Clothing",499.99,5),
("Rocket Ship","Vehicles",5000000.00,2),
("Dippin Dots","Food",5.00,25),
("Oxygen Tank","Misc",50.00,10),
("Extra Fuel","Misc",500.00,5),
("Lunar Rover","Vehicles",40000.00,3),
("Ipod","Entertainment",200.00,6),
("Improbability Drive", "Misc", 60000, 1)