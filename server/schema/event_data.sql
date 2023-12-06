-- Table: event_data

-- Drop the table if it exists (optional)
DROP TABLE IF EXISTS event_data;

-- Create the table
CREATE TABLE IF NOT EXISTS event_data
(
    id serial PRIMARY KEY, -- Use 'serial' for auto-incrementing primary key
    volunteer_id VARCHAR(256),
    number_in_party INTEGER,
    pounds INTEGER,
    ounces INTEGER,
    unusual_items VARCHAR(256),
    event_id VARCHAR(256) NOT NULL,
    is_checked_in BOOLEAN NOT NULL
);
