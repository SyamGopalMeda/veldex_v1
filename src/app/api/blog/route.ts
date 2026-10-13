import { NextResponse } from 'next/server';
import { listArticles } from '@/lib/content';

export const dynamic = 'force-dynamic';

/** GET /api/blog — published articles (database + built-in) */
export async function GET() {
  return NextResponse.json({ success: true, articles: await listArticles() });
}
