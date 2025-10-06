"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "text-burgundy-primary font-semibold"
      : "text-gray-700 hover:text-burgundy-primary transition-colors duration-300";
  };

  const navigationItems = [
    { href: "/", label: "Hjem" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reservation" },
    { href: "/contact", label: "Kontakt" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 hover:text-burgundy-primary transition-colors duration-300"
            >
              Vesuvius
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-burgundy-primary border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-burgundy-primary transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-burgundy-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {session.user.name?.[0]?.toUpperCase() ||
                      session.user.email[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {session.user.name || session.user.email}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {session.user.email}
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log ud
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-burgundy-primary text-white px-6 py-2 rounded-md hover:bg-burgundy-dark transition-colors duration-300 font-medium"
              >
                Log ind
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#A63A50] transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-3 rounded-md ${getLinkClass(
                    item.href
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-3">
                {session ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Logget ind som: {session.user.name || session.user.email}
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block py-3 px-3 rounded-md text-gray-700 hover:text-burgundy-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left py-3 px-3 rounded-md text-gray-700 hover:text-burgundy-primary"
                    >
                      Log ud
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block py-3 px-3 rounded-md text-gray-700 hover:text-burgundy-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log ind
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block py-3 px-3 rounded-md bg-burgundy-primary text-white text-center hover:bg-burgundy-dark"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Opret konto
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
