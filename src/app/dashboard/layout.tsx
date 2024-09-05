import { GnovistarSidebar } from "./components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <GnovistarSidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
          <div className="p-4 md:p-10 grow overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </GnovistarSidebar>
  );
}