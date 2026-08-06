import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { pages } = await request.json();

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await prisma.$transaction(
      pages.map((page: { id: string; pageNumber: number }) =>
        prisma.page.update({
          where: { id: page.id },
          data: { pageNumber: page.pageNumber },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering pages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
