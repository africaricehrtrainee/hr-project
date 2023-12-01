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
    IF NOT EXISTS objectives (
        objectiveId INT AUTO_INCREMENT PRIMARY KEY,
        status ENUM ('draft', 'sent', 'invalid', 'ok') DEFAULT 'draft',
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

-- Comments Table
CREATE TABLE
    IF NOT EXISTS comments (
        commentId INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT,
        objectiveId INT,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (objectiveId) REFERENCES objectives (objectiveId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (employeeId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL
    );

-- Positions Table
CREATE TABLE
    IF NOT EXISTS positions (
        roleId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        holderId INT,
        superviseeId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (holderId) REFERENCES employees (employeeId) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (superviseeId) REFERENCES positions (roleId) ON UPDATE CASCADE ON DELETE SET NULL
    );