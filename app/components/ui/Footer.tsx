"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-bold text-[#D4AF37]">
              Auric
            </Link>

            <p className="mt-4 text-gray-400 leading-relaxed">
              Fine jewellery crafted for quiet luxury, modern romance, and
              timeless elegance.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaPinterestP />
              </a>

              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-[#D4AF37]">Shop</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/rings" className="hover:text-[#D4AF37]">
                  Rings
                </Link>
              </li>

              <li>
                <Link href="/necklaces" className="hover:text-[#D4AF37]">
                  Necklaces
                </Link>
              </li>

              <li>
                <Link href="/earrings" className="hover:text-[#D4AF37]">
                  Earrings
                </Link>
              </li>

              <li>
                <Link href="/bracelets" className="hover:text-[#D4AF37]">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-[#D4AF37]">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#D4AF37]">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-[#D4AF37]">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-[#D4AF37]">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/careers" className="hover:text-[#D4AF37]">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-[#D4AF37]">
              Support
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-[#D4AF37]">
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link href="/return-policy" className="hover:text-[#D4AF37]">
                  Return Policy
                </Link>
              </li>

              <li>
                <Link href="/privacy-policy" className="hover:text-[#D4AF37]">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/faq" className="hover:text-[#D4AF37]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-10 border-b border-gray-700">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold">Join Our Newsletter</h2>

            <p className="text-gray-400 mt-3">
              Get updates on new collections, exclusive offers, and luxury
              jewellery trends.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-[#D4AF37]"
              />

              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Auric Jewellery. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
