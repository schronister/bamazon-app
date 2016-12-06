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
  head: ['Department ID', 'Department Name','Overhead Costs', 'Product Sales','Total Profit'],
  colWidths: [8, 25, 20, 15, 15]
});


inquirer.prompt([
  {
    type:"list",
    message:"Select an option:",
    choices:["View Product Sales by Department","Create New Department"],
    name:"choice"
  }
  ]).then(function(answer){
    if (answer.choice === "View Product Sales by Department"){
      displaySales();
    } else{
      createNewDepartment();
    }
  })


function displaySales(){
  connection.query('SELECT * FROM departments', function(err,response){
    if (err) console.log(err);
    for (var i = 0; i < response.length; i++){
      table.push([response[i].department_id, response[i].department_name, response[i].over_head_costs, response[i].total_sales, response[i].total_sales-response[i].over_head_costs]);
    }
    console.log(table.toString());
  })
}


function createNewDepartment(){
  inquirer.prompt([
  {
    type:"input",
    message:"What would you like to name the new department?",
    name:"name"
  },
  {
    type:"input",
    message:"How much will the overhead costs be?",
    name:"overhead"
  }
    ]).then(function(answer){
      connection.query("INSERT INTO departments(department_name,over_head_costs,total_sales) VALUES(?,?,0)",[answer.name,answer.overhead]);
      console.log("New department has been created.");
    })
}