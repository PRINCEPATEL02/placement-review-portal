CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    last_login DATETIME,
    role TEXT CHECK(role IN ('student', 'admin')) NOT NULL
);
