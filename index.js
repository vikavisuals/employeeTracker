var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeTracker_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer.prompt({
    name: "mainMenu",
    type: "list",
    message: "What would you like to do?",
    choices: ['View All Employees', 'Add Employee', 'Remove Employee']
  }).then(function (res) {
    switch (res.mainMenu) {
      case 'View All Employees':
        viewAll();
        break;
      case 'Add Employee':
        add();
        break;
      case 'Remove Employee':
        remove();
        break;
    }
  });
};

function viewAll() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res);
    start();
  });
};


function add() {
  inquirer.prompt([{
    name: 'firstName',
    type: 'input',
    message: "First Name:"
  }, {
    name: 'lastName',
    type: 'input',
    message: "Last Name:"
  }]
  ).then(function (res) {

    connection.query(
      `INSERT INTO employee (first_name, last_name) VALUES ('${res.firstName}', '${res.lastName}')`,

      function (err, res) {
        if (err) throw err;
        console.log("Employee added")
        start();
      });

  });
};