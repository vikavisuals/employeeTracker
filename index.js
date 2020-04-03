var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
    choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role', 'Remove Employee', 'Remove Department', 'Remove Role']
  }).then(function (res) {
    switch (res.mainMenu) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Add Department':
        addDepartment();
        break;
        case 'Add Role':
        addRole();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
        case 'Remove Department':
        removeDepartment();
        break;
        case 'Remove Role':
        removeRole();
        break;
    }
  });
};

// Views all existing employees
function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log(res);
    start();
  });
};

// Views all existing departments
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(res);
    start();
  });
};

// Views all existing roles
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.log(res);
    start();
  });
};

// Adds a new employee
function addEmployee() {
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

// Adds a new department
function addDepartment() {
  inquirer.prompt([{
    name: 'department',
    type: 'input',
    message: "Department Name:"
  }]
  ).then(function (res) {
    connection.query(
      `INSERT INTO department (name) VALUES ('${res.department}')`,
      function (err, res) {
        if (err) throw err;
        console.log("DEPARTMENT ADDED")
        start();
      });
  });
};

// Adds a new role
function addRole() {
  inquirer.prompt([{
    name: 'title',
    type: 'input',
    message: "Title:"
  },
  {
    name: 'salary',
    type: 'input',
    message: "Salary:"
  }]
  ).then(function (res) {
    connection.query(
      `INSERT INTO role (title, salary) VALUES ('${res.title}', '${res.salary}')`,
      function (err, res) {
        if (err) throw err;
        console.log("ROLE ADDED")
        start();
      });
  });
};

// Deletes an existing employee
function removeEmployee() {
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

// Deletes an existing department
function removeDepartment() {
  connection.query('SELECT * FROM department', (err, department) => {
    const list = department.map(department => `${department.name}`)
    inquirer.prompt({
      name: 'delete',
      type: 'list',
      message: "Which department would you like to remove?",
      choices: list
    })
      .then(function (res) {
        let departmentID;
        list.forEach((item, i) => {
          if (item === res.delete) {
            departmentID = department[i].id;
          }
        })
        connection.query(
          `DELETE FROM department WHERE id = "${departmentID}"`,
          function (err, res) {
            if (err) throw err;
            console.log("DEPARTMENT REMOVED")
            start();
          });
      });
  });
};

// Deletes an existing role
function removeRole() {
  connection.query('SELECT * FROM role', (err, role) => {
    const list = role.map(role => `${role.title}, ${role.salary}`)
    inquirer.prompt({
      name: 'delete',
      type: 'list',
      message: "Which role would you like to remove?",
      choices: list
    })
      .then(function (res) {
        let roleID;
        list.forEach((item, i) => {
          if (item === res.delete) {
            roleID = role[i].id;
          }
        })
        connection.query(
          `DELETE FROM role WHERE id = "${roleID}"`,
          function (err, res) {
            if (err) throw err;
            console.log("ROLE REMOVED")
            start();
          });
      });
  });
};