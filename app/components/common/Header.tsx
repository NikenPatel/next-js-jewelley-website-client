"use client";

import {
  FaBars,
  FaBell,
  FaSearch,
  FaMoon,
  FaUserCircle,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const router = useRouter();

  const handleRedirectUserPanel = () => {
    router.push("/");
  };

  return (
    <header className="h-16 bg-[#f3ece7] border border-gray-400 px-5 py-5 flex items-center justify-between sticky top-0 z-50">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-gray-600 lg:hidden">
          <FaBars size={20} />
        </button>

        {/* <h1 className="text-xl font-bold text-gray-800">
          Jewelry Admin
        </h1> */}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search products, orders..."
          className="bg-transparent outline-none ml-3 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button
          className="text-gray-600 hover:text-yellow-500 transition"
          onClick={handleRedirectUserPanel}
        >
          <FaUser size={18} />
        </button>

        {/* Dark Mode */}
        <button className="text-gray-600 hover:text-yellow-500 transition">
          <FaMoon size={18} />
        </button>

        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-yellow-500 transition">
          <FaBell size={18} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <FaUserCircle size={36} className="text-[#D4AF37]" />

          <div className="hidden md:block">
            <p className="font-semibold text-gray-800">Admin</p>

            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
