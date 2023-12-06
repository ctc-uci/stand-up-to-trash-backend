-- Table: events

DROP TABLE IF EXISTS events;

CREATE TABLE IF NOT EXISTS events
(
    id serial PRIMARY KEY, -- Use 'serial' for auto-incrementing primary key
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256) NOT NULL,
    location VARCHAR(256) NOT NULL
);
