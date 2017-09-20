var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Rahul41592",
  database: "bamazon"
});

var shoppingCart = [];
var totalCost = 0;

connection.connect(function(err) {
  if (err) throw err;
  console.log("connection sucessful!");
  Table();
})

var Table = function(){
	connection.query("SELECT * FROM products", function(err, res){
		for(var i=0; i<res.length; i++){
			console.log(res[i].itemid+"||"+res[i].productname+"||"+res[i].departmentname+"||"+res[i].price+"||"+res[i].stockquantity+"\n");
		}
    promptCustomer(res);
	})
}

var promptCustomer = function (res) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'choice',
      message: "What would you like to purchase?"
    }])

  .then(function (answer) {
      var correct = false;
      for (var i = 0; i < res.length; i++) {
        if (res[i].productname === answer.choice) {
          correct = true;
          var product = answer.choice;
          var id = i;

    inquirer.prompt({
          type: "input",
          name: "quantity",
          message: "How many would you like to purchase?",
          validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              } else {
                return false;
              }
            }
          })
    .then(function (answer) {
              if ((res[id].stockquantity - answer.quantity) > 0) {
                connection.query('UPDATE Products SET stockquantity = stockquantity - ? WHERE productname = ?',
                  [answer.quantity, product],
                  function (err, res2) {
                    console.log("Product Bought");  
					console.log("You've just bought " + answer.quantity + " " + answer.choice + " successfully"); 
					Table();
					promptCustomer(res);

                  }
                )
              } else {
                console.log("Insufficent Quantity!");
                promptCustomer(res);
              }
            })
        }
      }
    })
}