"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }
  return (
    <footer className="bg-[#fafafa] shadow mt-10">
      <div className="px-5 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <h3 className="flex flex-col justify-center items-center leading-5">
                <span className="font-mono text-[18px]">Learn with</span>
                <span className="font-mono text-[30px] font-semibold uppercase text-blue-600">
                  Musfiq
                </span>
              </h3>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-2">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Learn with Musfiq. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
