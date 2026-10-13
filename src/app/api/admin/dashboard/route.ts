import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { countArticles, countProjects, listEnquiries, listServices, type EnquiryRecord } from '@/lib/adminData';

const MONTHS = 6;

/**
 * GET /api/admin/dashboard
 * Live overview: real enquiries from Firestore, plus counts of the projects,
 * articles and services the public site actually publishes.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const [enquiries, projects, articles, services] = await Promise.all([
      listEnquiries().catch((): EnquiryRecord[] => []),
      countProjects(),
      countArticles(),
      listServices().catch(() => []),
    ]);

    // Leads per month (last 6 calendar months, oldest first)
    const now = new Date();
    const monthly = Array.from({ length: MONTHS }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-IN', { month: 'short' }), count: 0 };
    });
    const byStatus: Record<string, number> = { New: 0, Contacted: 0, 'In Progress': 0, Completed: 0, Closed: 0 };
    const byService: Record<string, number> = {};
    let last30 = 0;
    for (const e of enquiries) {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      byService[e.service] = (byService[e.service] || 0) + 1;
      if (!e.createdAt) continue;
      const d = new Date(e.createdAt);
      const m = monthly.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (m) m.count++;
      if (+now - +d <= 30 * 864e5) last30++;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects: projects.total,
        totalBlogPosts: articles.total,
        draftBlogPosts: articles.drafts,
        totalEnquiries: enquiries.length,
        newEnquiriesCount: byStatus.New,
        enquiriesLast30Days: last30,
        totalServices: services.length,
        publishedServices: services.filter((s) => s.isPublished).length,
      },
      charts: {
        enquiriesByMonth: monthly.map(({ label, count }) => ({ label, count })),
        enquiriesByStatus: byStatus,
        enquiriesByService: Object.entries(byService).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, count]) => ({ label, count })),
        projectsByCategory: projects.byCategory,
      },
      recentEnquiries: enquiries.slice(0, 6),
    });
  } catch (err: unknown) {
    console.error('[Dashboard API] Error:', err);
    return NextResponse.json({ success: false, error: 'Could not load dashboard data' }, { status: 500 });
  }
}
