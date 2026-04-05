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
      {/* Sidebar */}
      <aside
        className={`
          sticky top-[57px] hidden h-[calc(100dvh-57px)] shrink-0 flex-col
          border-r border-border-default bg-[var(--sidebar-bg)] backdrop-blur-xl
          transition-all duration-200 ease-in-out sm:flex
          ${collapsed ? "w-0 overflow-hidden border-r-0" : "w-[220px]"}
        `}
      >
        {/* Sidebar content fills entire height */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Floating collapse toggle — sits outside sidebar so it's always visible */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`
          fixed z-20 hidden sm:flex items-center justify-center
          h-6 w-6 rounded-full border border-border-default bg-[var(--sidebar-bg)]
          text-content-muted hover:text-content-primary hover:bg-surface-secondary
          shadow-sm transition-all duration-200
          top-[72px]
          ${collapsed ? "left-[8px]" : "left-[208px]"}
        `}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </>
  );
}
