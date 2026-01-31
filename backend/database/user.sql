CREATE TABLE IF NOT EXISTS user (
    enrollment TEXT PRIMARY KEY,
    last_name TEXT,
    first_name TEXT,
    middle_name TEXT,
    email_id TEXT,
    role TEXT,
    FOREIGN KEY(enrollment) REFERENCES login(enrollment)
);
