"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { SidebarContent } from "@/components/Sidebar";

export function SidebarWrapper() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <aside
        className={`sticky top-[57px] hidden h-[calc(100dvh-57px)] shrink-0 flex-col border-r border-border-default/70 bg-[var(--sidebar-bg)] backdrop-blur-xl transition-all duration-200 ease-in-out sm:flex ${
          collapsed ? "w-0 overflow-hidden border-r-0" : "w-[272px]"
        }`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
          <SidebarContent />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`fixed top-[74px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-border-default bg-[var(--sidebar-bg)] text-content-muted shadow-sm transition-all duration-200 hover:bg-surface-secondary hover:text-content-primary sm:flex ${
          collapsed ? "left-[12px]" : "left-[258px]"
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </>
  );
}
