"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { SidebarContent } from "@/components/Sidebar";

export function SidebarWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <aside className={`sticky top-[65px] hidden h-[calc(100dvh-65px)] shrink-0 border-r border-border-default bg-[var(--sidebar-bg)] sm:flex ${collapsed ? "w-0 overflow-hidden border-r-0" : "w-[248px]"}`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarContent />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`fixed top-[78px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-border-default bg-surface-card text-content-muted shadow-sm transition-all hover:text-content-primary sm:flex ${collapsed ? "left-[8px]" : "left-[236px]"}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${collapsed ? "rotate-180" : ""}`}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </>
  );
}
