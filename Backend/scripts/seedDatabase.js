const xlsx = require('xlsx');
const pool = require('../src/config/db');
const bcrypt = require('bcrypt'); 

async function seedDatabase() {
    try {
        console.log(' Cleaning old data (keeping your Admin safe)...');
        await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
        await pool.execute('TRUNCATE TABLE past_deliveries');
        await pool.execute('TRUNCATE TABLE applications');
        await pool.execute('TRUNCATE TABLE projects');
        await pool.execute('TRUNCATE TABLE developer_profiles');
        await pool.execute('TRUNCATE TABLE client_profiles');
        
        // Delete all users EXCEPT your Admin
        await pool.execute(`DELETE FROM users WHERE role != 'Admin'`);
        console.log('Old data cleared!\n');

        const uniqueDevelopers = new Set();
        let deliveryCount = 0;

        console.log('Reading Delivery.xlsx...');
        const deliveryWorkbook = xlsx.readFile('./scripts/Delivery.xlsx');
        const deliverySheet = deliveryWorkbook.Sheets[deliveryWorkbook.SheetNames[0]];
        const deliveryRows = xlsx.utils.sheet_to_json(deliverySheet);

        for (const row of deliveryRows) {
            const devId = row.Developer_ID || row['Developer ID'];
            if (!devId) continue;

            if (!uniqueDevelopers.has(devId)) {
                
                const rawPassword = `${devId.toLowerCase()}@spartan`; 
                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                await pool.execute(
                    `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, 'Developer')`,
                    [devId, `${devId.toLowerCase()}@spartantech.com`, hashedPassword]
                );
                
                const devTitle = `Senior ${row.Primary_Skill || 'Software'} Engineer`;
                const devBio = `Passionate expert with ${row.Experience_Years || 5} years of experience building scalable solutions specializing in ${row.Primary_Skill || 'web development'}.`;
                const hourlyRate = Math.floor(Math.random() * 50) + 50; // Random rate between $50 and $100

                await pool.execute(
                    `INSERT INTO developer_profiles (developer_id, name, title, bio, hourly_rate, primary_skill, experience_years, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [devId, row.Developer_Name || 'Unknown', devTitle, devBio, hourlyRate, row.Primary_Skill || null, parseInt(row.Experience_Years) || 0, row.Country || null]
                );
                
                uniqueDevelopers.add(devId);
            }

            const onTime = row.On_Time === 'Yes' ? 1 : 0;
            await pool.execute(
                `INSERT INTO past_deliveries (developer_id, past_project_id, project_category, client_rating, on_time, delivery_days, earnings_usd) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [devId, row.Project_ID || 'Unknown', row.Project_Category || null, parseFloat(row.Client_Rating) || 0, onTime, parseInt(row.Delivery_Days) || 0, parseInt(row.Earnings_USD) || 0]
            );
            deliveryCount++;
        }

        console.log(` Created exactly ${uniqueDevelopers.size} UNIQUE Developers with realistic UI profiles!`);
        console.log(` Seeded ${deliveryCount} Past Deliveries for them!\n`);

        console.log('Reading Leads.xlsx...');
        const leadsWorkbook = xlsx.readFile('./scripts/Leads.xlsx');
        const leadsSheet = leadsWorkbook.Sheets[leadsWorkbook.SheetNames[0]];
        const leadsRows = xlsx.utils.sheet_to_json(leadsSheet);

        const clientRawPassword = `c001@spartan`;
        const clientHashedPassword = await bcrypt.hash(clientRawPassword, 10);

        await pool.execute(
            `INSERT INTO users (id, email, password_hash, role) VALUES ('C001', 'client@spartantech.com', ?, 'Client')`,
            [clientHashedPassword]
        );
        await pool.execute(
            `INSERT INTO client_profiles (client_id, company_name) VALUES ('C001', 'Global Enterprise Ltd')`
        );

        let projectCount = 0;
        for (const row of leadsRows) {
            const leadId = row.Lead_ID || row['Lead ID'];
            if (!leadId) continue;

            const projectTitle = `${row.Industry || 'Tech'} ${row.Project_Type || 'Platform'}`;
            const projectDesc = `Looking for an experienced professional with deep knowledge in ${row.Required_Skills || 'modern tech stacks'} to help us build and scale this ${row.Project_Type || 'project'}.`;
            const budgetMin = parseInt(row.Budget_USD) || 5000;
            const budgetMax = budgetMin + 4500; // Adds a range for the UI

            await pool.execute(
                `INSERT IGNORE INTO projects (id, client_id, title, description, industry, project_type, required_skills, budget_min, budget_max, urgency, status) VALUES (?, 'C001', ?, ?, ?, ?, ?, ?, ?, ?, 'Open')`,
                [leadId, projectTitle, projectDesc, row.Industry || null, row.Project_Type || null, row.Required_Skills || null, budgetMin, budgetMax, row.Urgency || null]
            );
            projectCount++;
        }
        console.log(` Seeded ${projectCount} Projects with rich UI details!`);

        await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\n Database is fully loaded, deduplicated, and UI-ready!');
        process.exit();

    } catch (error) {
        console.error(' SEEDING FAILED:', error);

        process.exit(1);
    }
}

seedDatabase();