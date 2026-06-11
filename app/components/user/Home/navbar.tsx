"use client";

import { logout } from "@/app/store/slices/authSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import IconButton from "../../common/IconButton";
import Icon from "../../common/Icon";
import { useAppSelector } from "@/app/store/hooks";

function ShopNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { token, user } = useSelector(
    (state: { auth: { token: string | null; user: any } }) => state.auth,
  );

  const { items } = useAppSelector((state) => state.cart);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Collections", path: "/collections" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // const navLinks = token && user?.role !== "admin"
  //   ? [...baseLinks, { name: "My Profile", path: "/shop/profile" }]
  //   : baseLinks;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/signin");
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <header className="site-header sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="lux-nav mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          className="brand text-2xl font-serif uppercase tracking-[0.35em] text-slate-900 transition hover:text-[#bfa15c]"
          href="/"
        >
          Auric
        </Link>

        <div className="nav-links hidden items-center gap-4 md:flex">
          {baseLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`group nav-btn relative text-sm font-medium uppercase tracking-[0.2em] text-slate-700 transition hover:text-[#bfa15c] ${
                pathname === link.path ? "text-[#bfa15c]" : ""
              }`}
            >
              {link.name}

              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-[#bfa15c] transition-all duration-300 ${
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
          <Link href="/shop/wishlist">
            <IconButton
              ariaLabel="Wishlist"
              icon={<Icon name="heart" className="h-5 w-5" />}
            />
          </Link>

          <Link href="/shop/addtocart" className="relative">
            <IconButton
              ariaLabel="Cart"
              icon={<Icon name="bag" className="h-5 w-5" />}
            />

            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalQuantity}
              </span>
            )}
          </Link>

          <Link
            className="icon-btn inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-slate-700 transition hover:border-[#bfa15c] hover:text-[#bfa15c]"
            aria-label="Account"
            href={
              token
                ? user?.role === "admin"
                  ? "/admin/dashboard"
                  : "/shop/profile"
                : "/auth/signin"
            }
          >
            <Icon name="user" className="h-5 w-5" />
          </Link>

          {token ? (
            <button
              className="nav-logout rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#bfa15c] hover:text-slate-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              className="nav-logout rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#bfa15c] hover:text-slate-900"
              onClick={handleLogout}
              href={"/auth/signin"}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default ShopNavbar;
