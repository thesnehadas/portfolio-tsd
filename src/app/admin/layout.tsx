import { getSession } from "@/lib/auth-helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Building2,
  BookOpen,
  LogOut 
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#fdfaf3]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r-2 border-[#4a3728] min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-semibold text-[#09090b]">
              Admin Panel
            </h2>
            <p className="text-sm text-[#71717a] mt-1">
              Portfolio Management
            </p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fdfaf3] transition-colors text-[#09090b]"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/case-studies"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fdfaf3] transition-colors text-[#09090b]"
            >
              <FileText className="w-5 h-5" />
              Case Studies
            </Link>
            <Link
              href="/admin/testimonials"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fdfaf3] transition-colors text-[#09090b]"
            >
              <MessageSquare className="w-5 h-5" />
              Testimonials
            </Link>
            <Link
              href="/admin/social-proof"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fdfaf3] transition-colors text-[#09090b]"
            >
              <Building2 className="w-5 h-5" />
              Social Proof
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#fdfaf3] transition-colors text-[#09090b]"
            >
              <BookOpen className="w-5 h-5" />
              Blog Posts
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-[#4a3728]/20">
            <form action="/api/auth/sign-out" method="POST">
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
