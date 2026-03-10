
CREATE DATABASE global_marketplace;
USE global_marketplace;


CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY, 
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Client', 'Developer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

CREATE TABLE developer_profiles (
    developer_id VARCHAR(50) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100) DEFAULT 'Software Engineer', 
    primary_skill VARCHAR(100),
    experience_years INT,
    country VARCHAR(100),
    bio TEXT, 
    hourly_rate INT DEFAULT 50, 
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from developer_profiles;

CREATE TABLE client_profiles (
    client_id VARCHAR(50) PRIMARY KEY, 
    company_name VARCHAR(255),
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from client_profiles;

CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY, 
    client_id VARCHAR(50), 
    title VARCHAR(255), -- NEW
    description TEXT, -- NEW
    industry VARCHAR(100),
    project_type VARCHAR(100),
    required_skills TEXT, 
    budget_min INT DEFAULT 0, -- UPDATED
    budget_max INT DEFAULT 5000, -- NEW
    duration VARCHAR(50) DEFAULT '4 weeks', -- NEW
    urgency ENUM('Low', 'Medium', 'High'),
    status ENUM('Open', 'In Progress', 'Completed') DEFAULT 'Open',
    posted_date DATE,
    FOREIGN KEY (client_id) REFERENCES client_profiles(client_id) ON DELETE SET NULL
);
select * from projects;

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50),
    developer_id VARCHAR(50),
    proposal_text TEXT,
    expected_days INT,
    matching_score DECIMAL(5,2), 
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (developer_id) REFERENCES developer_profiles(developer_id) ON DELETE CASCADE
);
select * from applications;

CREATE TABLE past_deliveries (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    developer_id VARCHAR(50),
    past_project_id VARCHAR(50), 
    project_category VARCHAR(100),
    client_rating DECIMAL(3,1), 
    on_time BOOLEAN, 
    delivery_days INT,
    earnings_usd INT,
    FOREIGN KEY (developer_id) REFERENCES developer_profiles(developer_id) ON DELETE CASCADE
);

select * from past_deliveries;