import 'dotenv/config';
import pool from './config/db.js';

const dummySchools = [
  {
    name: "Delhi Public School",
    address: "Mathura Road, New Delhi",
    latitude: 28.5672,
    longitude: 77.2410
  },
  {
    name: "Kendriya Vidyalaya",
    address: "Gole Market, New Delhi",
    latitude: 28.6331,
    longitude: 77.2023
  },
  {
    name: "Modern School",
    address: "Barakhamba Road, New Delhi",
    latitude: 28.6295,
    longitude: 77.2241
  },
  {
    name: "St. Columba's School",
    address: "Ashok Place, New Delhi",
    latitude: 28.6288,
    longitude: 77.2065
  },
  {
    name: "The Mother's International School",
    address: "Sri Aurobindo Marg, New Delhi",
    latitude: 28.5422,
    longitude: 77.2008
  }
];

async function seedDatabase() {
  console.log("Seeding database with dummy data...");
  try {
    for (const school of dummySchools) {
      const [result] = await pool.execute(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [school.name, school.address, school.latitude, school.longitude]
      );
      console.log(`✓ Inserted: ${school.name} (ID: ${result.insertId})`);
    }
    console.log("\\nSeeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
