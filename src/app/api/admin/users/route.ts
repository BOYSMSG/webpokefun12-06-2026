import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const permissions = (session?.user as any)?.permissions || [];

    if (!session || (userRole !== 'OWNER' && userRole !== 'ADMIN' && !permissions.includes('MANAGE_ROLES'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching admin users", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const myEmail = session?.user?.email;
    const myRole = (session?.user as any)?.role;
    const myPermissions = (session?.user as any)?.permissions || [];

    if (!myEmail || (myRole !== 'OWNER' && myRole !== 'ADMIN' && !myPermissions.includes('MANAGE_ROLES'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { email, role, permissions } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Protect OWNERs from being demoted or modified by non-owners
    if (targetUser.role === 'OWNER' && myRole !== 'OWNER') {
      return NextResponse.json({ error: 'You cannot modify an OWNER account.' }, { status: 403 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (permissions) updates.permissions = permissions;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role/permissions", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
