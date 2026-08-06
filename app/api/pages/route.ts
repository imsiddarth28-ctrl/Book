import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { bookId, pages } = await request.json();

    if (!bookId || !pages || !Array.isArray(pages)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const createdPages = await prisma.$transaction(
      pages.map((page: { imageUrl: string; pageNumber: number }) =>
        prisma.page.create({
          data: {
            bookId,
            imageUrl: page.imageUrl,
            pageNumber: page.pageNumber,
          },
        })
      )
    );

    return NextResponse.json(createdPages, { status: 201 });
  } catch (error) {
    console.error('Error creating pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
