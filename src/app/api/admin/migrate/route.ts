import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { migrationStatus, runMigration } from '@/lib/contentMigration';
import { revalidateSite } from '@/lib/content';

/** GET /api/admin/migrate — which built-in content is already stored in the database */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, status: await migrationStatus() });
  } catch (err) {
    console.error('[Migrate API] status', err);
    return NextResponse.json({ success: false, error: 'Could not read the database.' }, { status: 500 });
  }
}

/** POST /api/admin/migrate — copy any missing built-in content into the database (safe to repeat) */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const written = await runMigration();
    revalidateSite();
    return NextResponse.json({ success: true, written, status: await migrationStatus() });
  } catch (err) {
    console.error('[Migrate API] run', err);
    return NextResponse.json({ success: false, error: 'Migration failed — nothing was overwritten.' }, { status: 500 });
  }
}
