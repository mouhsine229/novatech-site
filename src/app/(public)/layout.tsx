import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { AdminAccessTrigger } from "@/components/admin-access-trigger";
import { InstallPwaPrompt } from "@/components/install-pwa-prompt";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageViewTracker />
      <AdminAccessTrigger />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <InstallPwaPrompt />
    </>
  );
}
