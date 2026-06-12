const mysql = require('mysql2/promise');

async function getTables() {
  try {
    const pool = mysql.createPool({
      host: "18.236.210.126",
      port: 3306,
      database: "s2_alphazone",
      user: "u2_845m56eYBm",
      password: "IkIn9gE8teY=pWMzzG7a^X1o",
    });

    const [tables] = await pool.query("SHOW TABLES");
    console.log("All Tables in Database:");
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [columns] = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``);
      console.log(`\nTable: ${tableName}`);
      console.log(`Columns: ${columns.map(c => c.Field).join(', ')}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

getTables();
