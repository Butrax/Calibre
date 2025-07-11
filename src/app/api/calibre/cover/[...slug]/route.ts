// src/app/api/calibre/cover/[...slug]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

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
      const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
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
