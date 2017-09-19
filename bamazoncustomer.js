var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Rahul41592",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connection sucessful!");
  makeTable();
})

var makeTable = function(){
	connection.query("SELECT * FROM products", function(err, res){
		for(var i=0; i<res.length; i++){
			console.log(res[i].itemid+"||"+res[i].productname+"||"+res[i].departmentname+"||"+res[i].price+"||"+res[i].stockquantity+"\n");
		}
    promptCustomer(res);
	})
}

var promptCustomer = function(res){
	inquirer.prompt([{
      name: "input",
      type: "choice",
      message: "What product would you like to purchase?"
    }]).then(function(answer){
      	var correct = false;
      	for(var i=0; i<res.length; i++){
      		if(res[i].productname==answer.choice){
      			correct=true;
      			var product=answer.choice;
      			var id=i;
	      		inquirer.prompt({
	      			type: "input",
	      			name: "quant",
	      			message: "how many would you like to buy?",
	      			validate: function(value){
	      				if(isNaN(value)==false){
	      					return true;
	      				}else{
	      					return false;
	      				}
	      			}
	      		}).then(function(answer){
	      			if((res[id].stockquantity-answer.quant)>0){
	      				connection.query("'UPDATE products SET stockquantity='"+(res[id].stockquanity-answer.quant)+"'WHERE productname='"+product
	      				+"''",function(err,res2){
	      					console.log("Product Bought!");
	      					makeTable();
	      				})
	      			}else{
	      				console.log("Not a valid selection!");
	      				promptCustomer(res);
	      			}
	      		})
	      	}
	    }
	})
}