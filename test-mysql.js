const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: "18.236.210.126",
      port: 3306,
      database: "s2_alphazone",
      user: "u2_845m56eYBm",
      password: "IkIn9gE8teY=pWMzzG7a^X1o",
      connectTimeout: 30000,
    });

    console.log("Connection successful!");
    
    console.log("Fetching tables...");
    const [tables] = await connection.query("SHOW TABLES");
    console.log("Tables found:");
    
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      console.log(`\n--- Table: ${tableName} ---`);
      const [columns] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      console.log(columns.map(c => `${c.Field} (${c.Type})`).join(', '));
      
      const [data] = await connection.query(`SELECT * FROM \`${tableName}\` LIMIT 5`);
      if (data.length > 0) {
        console.log("Sample Data:");
        console.table(data);
      } else {
        console.log("Table is empty.");
      }
    }

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Database error:", err.message);
    if (err.code) console.error("Error code:", err.code);
    process.exit(1);
  }
}

checkDatabase();
