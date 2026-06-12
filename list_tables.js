const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=');
  if (key && value) {
    let val = value.trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key.trim()] = val;
  }
});

async function listTables() {
  try {
    const connection = await mysql.createConnection({
      host: env.MYSQL_HOST,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      port: parseInt(env.MYSQL_PORT || '3306')
    });

    const [rows] = await connection.execute('SHOW TABLES');
    console.log("Tables in database:");
    const tables = rows.map(r => Object.values(r)[0]);
    console.log(tables);

    for (const table of tables) {
      if (table.includes('player') || table.includes('data')) {
        const [columns] = await connection.execute(`SHOW COLUMNS FROM ${table}`);
        console.log(`\nColumns in ${table}:`);
        console.log(columns.map(c => c.Field).join(', '));

        const [data] = await connection.execute(`SELECT * FROM ${table} LIMIT 2`);
        console.log(`\nSample data in ${table}:`);
        console.log(data);
      }
    }

    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

listTables();
