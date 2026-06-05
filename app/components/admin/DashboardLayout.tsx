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
      <Sidebar />

      <main className="flex-1 w-80 h-screen overflow-y-auto">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {children}
      </main>
    </div>
  );
}
