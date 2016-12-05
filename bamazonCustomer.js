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
})

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
		promptBuy();
	})
}


function promptBuy(){
	connection.query('SELECT * FROM products', function(err,res){
		inquirer.prompt([
		{
			type:"list",
			name:"id",
			message:"Select an item to purchase:",
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
			message:"How many?"
		}
		]).then(function(answer){
			//check that stock is sufficient for the item chosen
			for (var i = 0; i < res.length; i++){
				if (answer.id === res[i].product_name){
					if (answer.num <= res[i].stock_quantity){
					console.log("Your total is " + answer.num * res[i].price);
					console.log("Congratulations on your purchase!");
					//subtract from stock
					connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[res[i].stock_quantity-answer.num,res[i].item_id])
					}
					else{
						console.log("Sorry, we don't have enough in stock for your purchase.")
					}
				}
			}
			
		})


	})
	
}






displayStock();