DROP TABLE IF EXISTS volunteers;

-- Create the table
CREATE TABLE IF NOT EXISTS volunteers
(
    id VARCHAR(256) PRIMARY KEY, -- I removed COLLATE and made it a primary key
    email VARCHAR(256),
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL
);
