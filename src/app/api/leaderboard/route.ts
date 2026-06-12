import { NextResponse } from 'next/server';
import { getMySQLConnection } from '@/lib/mysql';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'ranked';
    
    let tableName = 'ranked_player_data';
    let orderBy = 'elo'; // default sort

    if (mode === 'alphazone') {
      tableName = 'alphazone_player_data';
      orderBy = 'elo'; // or wins/kills
    } else if (mode === 'dungeon') {
      tableName = 'dungeon_player_data';
      orderBy = 'boss_kills'; // as requested/implied for dungeon
    } else if (mode === 'raid') {
      tableName = 'alphazone_player_data'; // raid shares alphazone table according to docs
      orderBy = 'raid_points'; // assuming raid points exist, else fallback to elo
    }

    const pool = getMySQLConnection();

    // To prevent SQL injection and errors if column doesn't exist, we first check if the table exists
    const [tables]: any = await pool.query(`SHOW TABLES LIKE ?`, [tableName]);
    if (tables.length === 0) {
      return NextResponse.json({ success: false, error: "Table not found", data: [] });
    }

    // Try to sort by the preferred column, fallback if not exists
    const [columns]: any = await pool.query(`SHOW COLUMNS FROM ??`, [tableName]);
    const columnNames = columns.map((col: any) => col.Field);
    
    if (!columnNames.includes(orderBy)) {
      if (columnNames.includes('elo')) orderBy = 'elo';
      else if (columnNames.includes('wins')) orderBy = 'wins';
      else if (columnNames.includes('kills')) orderBy = 'kills';
      else orderBy = columnNames[0]; // fallback
    }

    const [rows]: any = await pool.query(`SELECT * FROM ?? ORDER BY ?? DESC LIMIT 50`, [tableName, orderBy]);

    // Sanitize output, remove internal ids if necessary, but returning all for now
    return NextResponse.json({ success: true, data: rows, mode, sort: orderBy });
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
