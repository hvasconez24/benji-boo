USE business;
INSERT INTO department (name)
VALUES ("Human Resources");
INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources Leader", 4598, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 9887, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Head of Operations", 6098, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matt", "LeBlanc", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("David", "Schwimmer", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matthew", "Perry", 3, null);