const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
var departments;
var roles = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Josue1405",
    database: "business"
});

connection.connect(function (err) {
    if (err) throw err;
    firstPrompt();
    viewAllDepartments_();
    viewAllRoles_();
    viewAllEmployees_();
    viewAllManagers_();
});

function firstPrompt() {
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Finish program"]
        })
        .then(function ({ task }) {
            switch (task) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Finish program":
                    connection.end();
                    break;
            }
        });
}

function viewAllDepartments() {
    console.log("Viewing all departments...\n");

    var query =
        `SELECT * FROM department`

    connection.query(query, function (err, res) {
        if (err) throw err;
        departments = res;
        console.table(res);
        console.log("All departments viewed.\n");

        firstPrompt();
    });
}

function viewAllDepartments_() {
    var query =
        `SELECT * FROM department`

    connection.query(query, function (err, res) {
        if (err) throw err;
        departments = res;
    });
}

function viewAllRoles() {
    console.log("Viewing all roles...\n");

    var query =
        `SELECT role.id as role_id, role.title as role_title, 
        department.name as department_name, role.salary
        FROM role, department
        WHERE role.department_id = department.id`

    connection.query(query, function (err, res) {
        if (err) throw err;
        roles = res;
        console.table(res);
        console.log("All roles viewed.\n");

        firstPrompt();
    });
}

function viewAllRoles_() {
    var query =
        `SELECT * FROM role`
    connection.query(query, function (err, res) {
        if (err) throw err;
        roles = res;
    });
}

function viewAllEmployees() {
    console.log("Viewing all employees...\n");

    var query =
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
            LEFT JOIN role
	        ON employee.role_id = role.id
            LEFT JOIN department
            ON department.id = role.department_id
            LEFT JOIN employee manager
	        ON manager.id = employee.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;
        employees = res;
        console.table(res);
        console.log("All employees viewed.\n");

        firstPrompt();
    });
}

function viewAllEmployees_() {
    var query =
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
            LEFT JOIN role
	        ON employee.role_id = role.id
            LEFT JOIN department
            ON department.id = role.department_id
            LEFT JOIN employee manager
	        ON manager.id = employee.manager_id`
    connection.query(query, function (err, res) {
        if (err) throw err;
        employees = res;
    });
}

function viewAllManagers_() {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
        if (err) throw err;
        managers = res;
    })
};

function addDepartment() {

    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What department do you want to add?"
        }
    ]).then(function (answer) {
        connection.query(
            `INSERT INTO department (name) 
            VALUES ('${answer.department}')`,
            (err, res) => {
                if (err) throw err;

                console.log("The department " + answer.department + " was added.");
                viewAllDepartments();
            })
    })
};

function addRole() {
    var departmentOptions = [];

    for (i = 0; i < departments.length; i++) {
        departmentOptions.push(Object(departments[i]));
    };

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What role do you want to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "department_id",
            type: "list",
            message: "What is the department for this role?",
            choices: departmentOptions
        },
    ]).then(function (answer) {
        for (i = 0; i < departmentOptions.length; i++) {
            if (departmentOptions[i].name === answer.department_id) {
                department_id = departmentOptions[i].id
            }
        }
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`, (err, res) => {
            if (err) throw err;

            console.log("The role " + answer.title + " was added.");
            viewAllRoles();

        })
    })
};

function addEmployee() {

    var roleOptions = [];
    var managerOptions = []


    connection.query(`SELECT id, title FROM role`, function (err, res) {
        if (err) throw err;
        roleOptions = JSON.parse(JSON.stringify(res));
    });

    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
    };

    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "list",
            message: "What is the role for this employee?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++) {
                    choiceArray.push(roleOptions[i].title)
                }
                return choiceArray;
            }
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the manager for this employee?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < managerOptions.length; i++) {
                    choiceArray.push(managerOptions[i].managers)
                }
                return choiceArray;
            }
        }
    ]).then(function (answer) {
        for (i = 0; i < roleOptions.length; i++) {
            if (roleOptions[i].title === answer.role_id) {
                role_id = roleOptions[i].id
            }
        }
        for (i = 0; i < managerOptions.length; i++) {
            if (managerOptions[i].managers === answer.manager_id) {
                manager_id = managerOptions[i].id
            }
        }

        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, (err, res) => {
            if (err) throw err;

            console.log("The employee " + answer.first_name + " " + answer.last_name + " was added.");
            viewAllEmployees();

        })
    })

}

function updateEmployeeRole() {
    var employeeOptions = [];

    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }

    inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].first_name);
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        let roleOptions = [];
        for (i = 0; i < roles.length; i++) {
            roleOptions.push(Object(roles[i]));
        };
        for (i = 0; i < employeeOptions.length; i++) {
            if (employeeOptions[i].first_name === answer.updateRole) {
                employeeSelected = employeeOptions[i].id
            }
        }
        inquirer.prompt([
            {
                name: "newRole",
                type: "list",
                message: "Select a new role:",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < roleOptions.length; i++) {
                        choiceArray.push(roleOptions[i].title)
                    }
                    return choiceArray;
                }
            }
        ]).then(answer => {
            for (i = 0; i < roleOptions.length; i++) {
                if (answer.newRole === roleOptions[i].title) {
                    newChoice = roleOptions[i].id
                    connection.query(`UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
                        if (err) throw err;
                    };
                }
            }
            console.log("Role updated.");
            viewAllEmployees();
        })
    })
};





