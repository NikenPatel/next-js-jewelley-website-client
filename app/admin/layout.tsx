// "use client";

import DashboardLayout from "../components/admin/DashboardLayout";

// import { useState, ReactNode } from "react";
// import Sidebar from "../components/common/Sidebar";
// import Navbar from "../components/common/Header";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`fixed z-40 h-screen transition-all duration-300 lg:static
//         ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <main className="w-full flex-1 h-screen overflow-y-auto bg-gray-100">
//         <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

//         {children}
//       </main>
//     </div>
//   );
// }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
