import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { exportBackup } from '@/lib/contentMigration';

/** GET /api/admin/backup — downloads the website content + enquiries as JSON */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const data = await exportBackup();
    const name = `veldex-backup-${data.exportedAt.slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[Backup API]', err);
    return NextResponse.json({ success: false, error: 'Could not export the backup.' }, { status: 500 });
  }
}
