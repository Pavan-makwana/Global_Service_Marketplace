const pool = require('../src/config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        const adminEmail = 'admin@spartantech.com';
        const adminPassword = 'admin'; 

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const [existing] = await pool.execute(`SELECT id FROM users WHERE email = ?`, [adminEmail]);
        
        if (existing.length > 0) {
            console.log(' Admin account already exists!');
            process.exit(0);
        }

        await pool.execute(
            `INSERT INTO users (id, email, password_hash, role) VALUES ('ADMIN-001', ?, ?, 'Admin')`,
            [adminEmail, hashedPassword]
        );

        console.log('Master Admin account created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error(' Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();