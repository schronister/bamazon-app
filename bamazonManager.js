var mysql      = require('mysql');
var inquirer   = require('inquirer');
var Table      = require('cli-table'); 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});
 
connection.connect(function(err) {
	if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	}
});

//create a table to display stock 
var table = new Table({
   head: ['ID', 'Product Name','Department', 'Price','# in Stock'],
   colWidths: [8, 25, 20, 10, 13]
});

//function to display current stock
function displayStock(){
	connection.query('SELECT * FROM products', function(err,response){
		if (err) console.log(err);
		for (var i = 0; i < response.length; i++){
			table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
		}
		console.log(table.toString());
	})
}

//main menu for managers 
function managerMenu(){
	inquirer.prompt([
	{
		type: "list",
		name: "menu",
		message:"Select an option:",
		choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
	}
	]).then(function(answer){
		switch (answer.menu){
			case "View Products for Sale":
				displayStock();
				break;
			case "View Low Inventory":
				lowInventory();
				break;
			case "Add to Inventory":
				addToInventory();
				break;
			case "Add New Product":
				break;
		}
	})
}

//same as display stock but with a WHERE contingency 
function lowInventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, response){
		if (err) throw err;
		for (var i = 0; i < response.length; i++){
			table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
		}
		console.log(table.toString());
	})
}

function addToInventory(){
	displayStock();
	connection.query('SELECT * FROM products', function(err,res){
		inquirer.prompt([
			{
				type:"list",
				name:"item",
				message:"Select an item to restock:",
				choices: function(value) {
			        var choiceArray = [];
			        for (var i = 0; i < res.length; i++) {
			          choiceArray.push(res[i].product_name);
			        }
			        return choiceArray;
			    }
			},
			{
				type:"input",
				name:"num",
				message:"How many to add?"
			}
		]).then(function(answer){
			console.log("Ok, added "+ answer.num + " " + answer.item + " to stock.");
			for (var i= 0; i < res.length; i++){
				if (res[i].product_name === answer.item){
					connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[parseInt(res[i].stock_quantity)+parseInt(answer.num), res[i].item_id]);
				}
			}
		})
	})
}




//program execution begins here
managerMenu();