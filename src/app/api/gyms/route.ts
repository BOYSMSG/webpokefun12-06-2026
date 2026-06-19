import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Gym from '@/models/Gym';

const DEFAULT_GYMS = [
  { name: 'Normal Gym', type: 'Normal', badgeName: 'Basic Badge' },
  { name: 'Fire Gym', type: 'Fire', badgeName: 'Volcano Badge' },
  { name: 'Water Gym', type: 'Water', badgeName: 'Cascade Badge' },
  { name: 'Grass Gym', type: 'Grass', badgeName: 'Plant Badge' },
  { name: 'Electric Gym', type: 'Electric', badgeName: 'Thunder Badge' },
  { name: 'Ice Gym', type: 'Ice', badgeName: 'Glacier Badge' },
  { name: 'Fighting Gym', type: 'Fighting', badgeName: 'Knuckle Badge' },
  { name: 'Poison Gym', type: 'Poison', badgeName: 'Soul Badge' },
  { name: 'Ground Gym', type: 'Ground', badgeName: 'Earth Badge' },
  { name: 'Flying Gym', type: 'Flying', badgeName: 'Zephyr Badge' },
  { name: 'Psychic Gym', type: 'Psychic', badgeName: 'Marsh Badge' },
  { name: 'Bug Gym', type: 'Bug', badgeName: 'Hive Badge' },
  { name: 'Rock Gym', type: 'Rock', badgeName: 'Boulder Badge' },
  { name: 'Ghost Gym', type: 'Ghost', badgeName: 'Phantom Badge' },
  { name: 'Dragon Gym', type: 'Dragon', badgeName: 'Rising Badge' },
  { name: 'Dark Gym', type: 'Dark', badgeName: 'Eclipse Badge' },
  { name: 'Steel Gym', type: 'Steel', badgeName: 'Mine Badge' },
  { name: 'Fairy Gym', type: 'Fairy', badgeName: 'Fairy Badge' }
];

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch gyms
    let gyms = await Gym.find({}).sort({ type: 1 });
    
    // Seed if empty
    if (gyms.length === 0) {
      await Gym.insertMany(DEFAULT_GYMS);
      gyms = await Gym.find({}).sort({ type: 1 });
    }

    return NextResponse.json({ success: true, gyms });
  } catch (error) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
