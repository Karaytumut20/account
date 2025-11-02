// app/api/projects/route.ts
import { readFile, writeFile } from 'fs/promises';
import { NextRequest } from 'next/server';

const DB = 'lib/projects.json';

export async function GET() {
  const data = await readFile(DB, 'utf-8');
  return Response.json(JSON.parse(data));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = JSON.parse(await readFile(DB, 'utf-8'));
  data.push(body);
  await writeFile(DB, JSON.stringify(data, null, 2));
  return Response.json({ success: true });
}