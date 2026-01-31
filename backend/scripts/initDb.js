const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const sqlFiles = ['login.sql', 'user.sql', 'post.sql'];

const initDb = () => {
    db.serialize(() => {
        sqlFiles.forEach(file => {
            const filePath = path.join(__dirname, '../database', file);
            const sql = fs.readFileSync(filePath, 'utf8');

            db.exec(sql, (err) => {
                if (err) {
                    console.error(`Error executing ${file}:`, err.message);
                } else {
                    console.log(`Successfully executed ${file}`);
                }
            });
        });

        // Check if admin exists, if not create default admin
        // This is a placeholder, actual admin creation should handle password hashing
    });

    // db.close(); // Keep open if running in server, but for script we might want to close. 
    // However, db.js opens it. Let's just log done.
};

initDb();
