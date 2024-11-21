DROP TABLE IF EXISTS sales_data;
DROP TABLE IF EXISTS employees;

-- Create the employees table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,                -- Auto-incrementing primary key
    name VARCHAR(255) NOT NULL,                   -- Employee name
    job_title VARCHAR(255) NOT NULL,              -- Job title
    salary NUMERIC(10, 2) CHECK (salary >= 0),    -- Salary with 2 decimal places, must be non-negative
    department VARCHAR(255) NOT NULL,             -- Department
    joined_date DATE NOT NULL                     -- Date the employee joined
);

-- Create the sales_data table
CREATE TABLE sales_data (
    sales_id SERIAL PRIMARY KEY,                    -- Auto-incrementing primary key for sales record
    employee_id INT NOT NULL,                       -- Foreign key to reference employee_id in employees table
    sales NUMERIC(10, 2) CHECK (sales >= 0),        -- Sales amount, must be non-negative
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) -- Establishes the relationship
);

-- Insert records into employees table
INSERT INTO employees (name, job_title, salary, department, joined_date)
VALUES
    ('John Smith', 'Manager', 60000.00, 'Sales', '2022-01-15'),
    ('Jane Doe', 'Analyst', 45000.00, 'Marketing', '2022-02-01'),
    ('Mike Brown', 'Developer', 55000.00, 'IT', '2022-03-10'),
    ('Anna Lee', 'Manager', 65000.00, 'Sales', '2021-12-05'),
    ('Mark Wong', 'Developer', 50000.00, 'IT', '2023-05-20'),
    ('Emily Chen', 'Analyst', 48000.00, 'Marketing', '2023-06-02');

-- Insert records into sales_data table
INSERT INTO sales_data (employee_id, sales)
VALUES
    (1, 15000.00),  
    (2, 12000.00),  
    (3, 18000.00),  
    (1, 20000.00),  
    (4, 22000.00),  
    (5, 19000.00),  
    (6, 13000.00),  
    (2, 14000.00);

-- 1. Retrieve all data from employees
SELECT * 
FROM employees;

-- 2. Count the number of employees with the job title 'Manager'
SELECT COUNT(employee_id) 
FROM employees 
WHERE job_title = 'Manager';

-- 3. Retrieve the name and salary of employees in the Sales or Marketing department
SELECT name, salary 
FROM employees 
WHERE department = 'Sales' OR department = 'Marketing';

-- 4. Calculate the average salary of employees who joined in the last 5 years
SELECT AVG(salary) 
FROM employees 
WHERE joined_date >= CURRENT_DATE - INTERVAL '5 years';

-- 5. Get the top 5 employees by total sales
SELECT 
    e.name, 
    SUM(s.sales) AS total_sales 
FROM 
    sales_data s 
JOIN 
    employees e ON e.employee_id = s.employee_id 
GROUP BY 
    e.name 
ORDER BY 
    total_sales DESC 
LIMIT 5;

-- 6. Retrieve employees in departments with above-average salaries
WITH department_avg_salary AS (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
),
overall_avg_salary AS (
    SELECT AVG(salary) AS avg_salary
    FROM employees
)
SELECT 
    e.name, 
    e.salary, 
    d.avg_salary AS department_avg_salary
FROM 
    employees e
JOIN 
    department_avg_salary d ON e.department = d.department
WHERE 
    d.avg_salary > (SELECT avg_salary FROM overall_avg_salary);

-- 7. Retrieve name, total sales, and ranking of employees based on total sales
SELECT 
    e.name,
    SUM(s.sales) AS total_sales,
    RANK() OVER (ORDER BY SUM(s.sales) DESC) AS ranking
FROM 
    employees e
JOIN 
    sales_data s ON e.employee_id = s.employee_id
GROUP BY 
    e.name
ORDER BY 
    ranking;

-- 8. Stored function to retrieve employees by department
CREATE OR REPLACE FUNCTION get_department_employees(department_name TEXT)
RETURNS TABLE (
    employee_name TEXT,
    total_salary NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        name::TEXT AS employee_name,
        salary AS total_salary
    FROM 
        employees
    WHERE 
        department = department_name;
END;
$$ LANGUAGE plpgsql;

-- Call the function for the 'Marketing' department
SELECT * 
FROM get_department_employees('Marketing');