import { NextResponse } from 'next/server';
import { listProjects } from '@/lib/content';

export const dynamic = 'force-dynamic';

/** GET /api/projects — published projects (database + built-in portfolio) */
export async function GET() {
  return NextResponse.json({ success: true, projects: await listProjects() });
}
