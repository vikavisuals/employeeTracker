var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer.prompt( {
      name: "mainMenu",
      type: "list",
      message: "What would you like to do?",
      choices: ['View All Employees', 'Add Employee', 'Remove Employee']
    }).then(function(res) {
      switch(res.mainMenu) {
          case 'View All Employees':
              view();
              break;
          case 'Add Employee':
              add();
              break;
          case 'Remove Employee':
              remove();
              break;
      }
});
}