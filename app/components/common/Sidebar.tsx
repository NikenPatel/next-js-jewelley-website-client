"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { FaChevronDown, FaChevronRight, FaSignOutAlt } from "react-icons/fa";

import { menuItems } from "@/app/data";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { resetProductState } from "@/app/store/slices/productSlice";

interface MenuChild {
  label: string;
  path: string;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  children: MenuChild[];
}

export default function Sidebar() {
  const [open, setOpen] = useState<string>("Dashboard");

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, success, error } = useSelector(
    (state: RootState) => state.product,
  );
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/auth/signup");
  };
  const redirectPages = () => {
    dispatch(resetProductState());
  };

  return (
    <aside className="w-80 h-screen overflow-y-auto bg-[#f3ece7] text-gray-800 border-none">
      {/* Logo */}
      <div className="sticky top-0 z-10 px-6 py-5 border border-gray-400 bg-[#f3ece7]">
        <h4 className="text-l font-bold text-[#D4AF37]">✨ Jewel Admin</h4>
      </div>

      {/* Menu */}
      <div className="py-4">
        {(menuItems as MenuItem[]).map((item) => (
          <div key={item.title}>
            <button
              onClick={() => setOpen(open === item.title ? "" : item.title)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left transition
                ${
                  open === item.title
                    ? "bg-[#f3ece7] text-[#D4AF37]"
                    : "hover:bg-[#99775c]"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span>{item.title}</span>
              </div>

              {open === item.title ? <FaChevronDown /> : <FaChevronRight />}
            </button>

            {/* Sub Menu */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === item.title ? "max-h-[600px]" : "max-h-0"
              }`}
            >
              {item.children.map((sub) => {
                const href = sub.path;

                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={sub.path}
                    href={href}
                    onClick={redirectPages}
                    className={`block pl-16 pr-6 py-2 text-sm transition
                      ${
                        isActive
                          ? "text-[#D4AF37] bg-[#99775c]"
                          : "text-gray-400 hover:text-[#D4AF37] hover:bg-[#99775c]"
                      }`}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 mt-4 text-red-400 hover:bg-red-500/10"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
