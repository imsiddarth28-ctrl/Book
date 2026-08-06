import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { pages: true },
        },
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, coverColor } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        title,
        coverColor: coverColor || '#FBF9F5',
      },
    });
    
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
