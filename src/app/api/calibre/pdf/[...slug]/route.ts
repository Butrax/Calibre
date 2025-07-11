// src/app/api/calibre/pdf/[...slug]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const filePath = params.slug.join('/');
  const calibreDir = path.join(process.cwd(), 'src', 'calibre');
  const fullPath = path.join(calibreDir, filePath);

  if (fs.existsSync(fullPath)) {
    try {
      const fileBuffer = fs.readFileSync(fullPath);
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
        },
      });
    } catch (error) {
        console.error("Error reading file:", error);
        return new NextResponse('Error reading file', { status: 500 });
    }
  }

  return new NextResponse('File not found', { status: 404 });
}
