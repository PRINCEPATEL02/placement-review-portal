CREATE TABLE IF NOT EXISTS post (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    role TEXT,
    type TEXT CHECK(type IN ('off campus', 'on campus')) NOT NULL,
    steps TEXT,
    level TEXT CHECK(level IN ('hard', 'medium', 'easy')),
    tips TEXT,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    approved BOOLEAN DEFAULT 0
);
