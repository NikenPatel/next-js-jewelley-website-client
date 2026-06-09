"use client";

import { logout } from "@/app/store/slices/authSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../common/IconButton";
import Icon from "../../common/Icon";

// import { logout } from "../../../store/authSlice";
// import IconButton from "../../Common/IconButton";
// import Icon from "../../Common/Icon";

function ShopNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { token } = useSelector(
    (state: { auth: { token: string | null } }) => state.auth,
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Collections", path: "/collections" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/signin");
  };

  return (
    <header className="site-header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <nav className="lux-nav mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          className="brand text-2xl font-serif uppercase tracking-[0.35em] text-slate-900 transition hover:text-[#bfa15c]"
          href="/"
        >
          Auric
        </Link>

        <div className="nav-links hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`group nav-btn relative text-sm font-medium uppercase tracking-[0.2em] text-slate-700 transition hover:text-[#bfa15c] ${
                pathname === link.path ? "text-[#bfa15c]" : ""
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-[#bfa15c] transition-all duration-300 ${
                  pathname === link.path ? "w-full" : "group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="nav-icons flex items-center gap-2">
          <IconButton
            ariaLabel="Search"
            icon={<Icon name="search" className="h-5 w-5" />}
          />
          <IconButton
            ariaLabel="Wishlist"
            icon={<Icon name="heart" className="h-5 w-5" />}
          />
          <IconButton
            ariaLabel="Cart"
            icon={<Icon name="bag" className="h-5 w-5" />}
          />

          <Link
            className="icon-btn inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-slate-700 transition hover:border-[#bfa15c] hover:text-[#bfa15c]"
            aria-label="Account"
            href={token ? "/admin/dashboard" : "/auth/signin"}
          >
            <Icon name="user" className="h-5 w-5" />
          </Link>

          {token && (
            <button
              className="nav-logout rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#bfa15c] hover:text-slate-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default ShopNavbar;
