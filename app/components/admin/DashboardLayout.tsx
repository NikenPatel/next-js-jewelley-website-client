"use client";

import { useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed z-40 h-screen transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      <main className="flex-1 h-screen overflow-y-auto ">
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {children}
      </main>
    </div>
  );
}
