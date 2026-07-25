import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import RewardProduct from '@/models/RewardProduct';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    // Default: fetch all visible products
    let query: any = { isVisible: true };
    
    // Check if the user is requesting as Admin (to see hidden/draft products)
    const url = new URL(req.url);
    const isAdminRequest = url.searchParams.get('admin') === 'true';
    
    if (isAdminRequest) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user && (user.role === 'OWNER' || user.role === 'ADMIN')) {
          query = {}; // Admin sees all
        }
      }
    }

    // Filter by Category
    const category = url.searchParams.get('category');
    if (category && category !== 'All') {
      if (category === 'Limited') {
        query.isLimited = true;
      } else if (category === 'Exclusive') {
        query.isExclusive = true;
      } else {
        query.category = category;
      }
    }

    const products = await RewardProduct.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectMongo();
    const product = await RewardProduct.findByIdAndUpdate(id, updates, { new: true });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !['ADMIN', 'OWNER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectMongo();
    const product = await RewardProduct.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (!user || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const newProduct = await RewardProduct.create(body);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Create Reward Product Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
