var mysql = require("mysql");
var inquirer = require("inquirer");

// MySQL localhost info
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeTracker_db"
});

// Upon connection, Start function is booted up
connection.connect(function (err) {
  if (err) throw err;
  start();
});

// Generates the main menu when starting app
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

// Views all existing employees
function viewAll() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res);
    start();
  });
};

// Adds a new employee
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
        console.log("EMPLOYEE ADDED")
        start();
      });
  });
};

// Deletes an existing employee
function remove() {
  connection.query('SELECT * FROM employee', (err, employee) => {
    const list = employee.map(employee => `${employee.first_name} ${employee.last_name}`)
    inquirer.prompt({
      name: 'delete',
      type: 'list',
      message: "Who would you like to remove?",
      choices: list
    })
      .then(function (res) {
        let employeeID;
        list.forEach((item, i) => {
          if (item === res.delete) {
            employeeID = employee[i].id;
          }
        })
        connection.query(
          `DELETE FROM employee WHERE id = "${employeeID}"`,
          function (err, res) {
            if (err) throw err;
            console.log("EMPLOYEE REMOVED")
            start();
          });
      });
  });
};