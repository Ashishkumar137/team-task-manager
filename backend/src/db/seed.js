const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pool = require('./connection');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data safely
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM team_members');
    await pool.query('DELETE FROM projects');
    await pool.query('DELETE FROM users');
    console.log('🧹 Cleared existing data');

    // Create password hash
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Insert Users
    const usersResult = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES 
        ('admin@example.com', $1, 'Alex', 'Admin'),
        ('member1@example.com', $1, 'Sarah', 'Developer'),
        ('member2@example.com', $1, 'James', 'Designer')
      RETURNING id, email;
    `, [passwordHash]);

    const users = {};
    usersResult.rows.forEach(user => {
      users[user.email] = user.id;
    });
    console.log('👤 Created 3 sample users (email: admin@example.com / password: password123)');

    // 2. Insert Projects
    const project1Result = await pool.query(`
      INSERT INTO projects (name, description, owner_id)
      VALUES ('🚀 Spaceflight Alpha', 'Our next-generation commercial orbital space flight program.', $1)
      RETURNING id;
    `, [users['admin@example.com']]);

    const project2Result = await pool.query(`
      INSERT INTO projects (name, description, owner_id)
      VALUES ('🎨 Brand Redesign', 'Refreshing our global corporate visual identity and digital assets.', $1)
      RETURNING id;
    `, [users['admin@example.com']]);

    const p1Id = project1Result.rows[0].id;
    const p2Id = project2Result.rows[0].id;
    console.log('🏗️ Created 2 premium projects');

    // 3. Add Team Members
    await pool.query(`
      INSERT INTO team_members (project_id, user_id, role)
      VALUES 
        ($1, $2, 'ADMIN'),
        ($1, $3, 'MEMBER'),
        ($1, $4, 'MEMBER'),
        ($5, $2, 'ADMIN'),
        ($5, $4, 'MEMBER')
    `, [
      p1Id, users['admin@example.com'], users['member1@example.com'], users['member2@example.com'],
      p2Id
    ]);
    console.log('👥 Assigned team members to projects');

    // 4. Create Tasks with Relative Due Dates (Today, Past, Future)
    const today = new Date();
    const format = (d) => d.toISOString().split('T')[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 3); // Overdue

    const futureDate1 = new Date();
    futureDate1.setDate(today.getDate() + 2); // Upcoming

    const futureDate2 = new Date();
    futureDate2.setDate(today.getDate() + 5); // Future

    await pool.query(`
      INSERT INTO tasks (project_id, title, description, status, priority, assigned_to, assigned_by, due_date)
      VALUES 
        ($1, 'Refactor propulsion control loops', 'Update the PID constants and control loop formulas for the second stage booster propulsion systems.', 'IN_PROGRESS', 'URGENT', $2, $3, $4),
        ($1, 'Finalize aerodynamic simulation data', 'Compile the aerodynamic Drag and Lift coefficients from the latest wind tunnel runs for CFD validation.', 'TODO', 'HIGH', $5, $3, $6),
        ($1, 'Prepare pitch deck for Series B round', 'Draft the slides detailing the Spaceflight Alpha flight schedules and projected commercial payload revenues.', 'DONE', 'MEDIUM', $3, $3, $7),
        ($1, 'Review launch safety checklists', 'Conduct a complete walk-through of the range safety, ordnance, and telemetry check lists with the ground control team.', 'IN_REVIEW', 'URGENT', $2, $3, $8),
        ($9, 'Publish new logo guidelines', 'Export the SVG vector assets, RGB/CMYK guidelines, and font usage documentation to the shared design library.', 'DONE', 'LOW', $5, $3, $7)
    `, [
      p1Id, users['member1@example.com'], users['admin@example.com'], format(pastDate), users['member2@example.com'], format(futureDate1), format(today), format(futureDate2),
      p2Id
    ]);
    console.log('📋 Generated 5 detailed tasks with dynamic dates');

    console.log('✅ Database successfully seeded!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
