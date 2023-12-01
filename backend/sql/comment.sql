Evaluations Table
CREATE TABLE
    IF NOT EXISTS evaluations (
        evaluationId INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT,
        evaluationYear CHAR(4) NOT NULL DEFAULT '2024',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        efficiency TEXT,
        competency TEXT,
        commitment TEXT,
        initiative TEXT,
        respect TEXT,
        leadership TEXT,
        FOREIGN KEY (employeeId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        CHECK (evaluationYear REGEXP '^[0-9]{4}$')
    );

Objectives Table