import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const cleanFileName = (file.name || 'page.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `notes/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanFileName}`;

    const blob = await put(uniqueFileName, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
