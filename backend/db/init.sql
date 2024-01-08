-- Employees Table
CREATE TABLE
    IF NOT EXISTS employees (
        employeeId INT AUTO_INCREMENT PRIMARY KEY,
        role ENUM ('hr', 'admin', 'staff'),
        email VARCHAR(255) UNIQUE NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        password VARCHAR(255),
        matricule VARCHAR(255) UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP NULL
    );

CREATE TABLE
    IF NOT EXISTS evaluations (
        status ENUM ('draft', 'sent') DEFAULT 'draft',
        evaluationId INT AUTO_INCREMENT PRIMARY KEY,
        authorId INT,
        employeeId INT,
        evaluationYear CHAR(4) NOT NULL DEFAULT '2024',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        efficiency TEXT,
        efficiencyRating INT,
        competency TEXT,
        competencyRating INT,
        commitment TEXT,
        commitmentRating INT,
        initiative TEXT,
        initiativeRating INT,
        respect TEXT,
        respectRating INT,
        leadership TEXT,
        leadershipRating INT,
        FOREIGN KEY (employeeId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (authorId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        CHECK (evaluationYear REGEXP '^[0-9]{4}$')
    );

CREATE TABLE
    IF NOT EXISTS objectives (
        objectiveId INT AUTO_INCREMENT PRIMARY KEY,
        status ENUM ('draft', 'sent', 'invalid', 'ok', 'graded') NOT NULL DEFAULT 'draft',
        employeeId INT,
        title TEXT NOT NULL,
        description TEXT,
        successConditions TEXT,
        deadline TEXT,
        kpi TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employeeId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL
    );

CREATE TABLE
    IF NOT EXISTS steps (
        stepId INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT,
        message TEXT,
        deadline TEXT,
        active BOOLEAN
    );

CREATE TABLE
    IF NOT EXISTS objectiveEvaluations (
        objectiveEvaluationId INT AUTO_INCREMENT PRIMARY KEY,
        objectiveId INT NOT NULL,
        status ENUM ('draft', 'sent') NOT NULL DEFAULT 'draft',
        authorId INT NOT NULL,
        grade INT,
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (objectiveId) REFERENCES objectives (objectiveId) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (authorId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE CASCADE
    );

-- Comments Table
CREATE TABLE
    IF NOT EXISTS comments (
        commentId INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT,
        objectiveId INT,
        authorId INT,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (objectiveId) REFERENCES objectives (objectiveId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (authorId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (employeeId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL
    );

-- Positions Table
CREATE TABLE
    IF NOT EXISTS positions (
        roleId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        holderId INT,
        supervisorId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (holderId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (supervisorId) REFERENCES positions (roleId) ON UPDATE CASCADE ON DELETE SET NULL
    );