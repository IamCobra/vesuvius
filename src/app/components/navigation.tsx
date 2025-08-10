'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavigationProps {
  currentPage?: 'home' | 'menu' | 'order'
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const getLinkClass = (page: string) => {
    return currentPage === page 
      ? "text-orange-600 font-semibold" 
      : "text-gray-700 hover:text-orange-600 transition-colors"
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Vesuvius
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={getLinkClass('home')}>
              Home
            </Link>
            <Link href="/menu" className={getLinkClass('menu')}>
              Menu
            </Link>
            <Link href="/order" className={getLinkClass('order')}>
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className={`block py-2 ${getLinkClass('home')}`}>
                Home
              </Link>
              <Link href="/menu" className={`block py-2 ${getLinkClass('menu')}`}>
                Menu
              </Link>
              <Link href="/order" className={`block py-2 ${getLinkClass('order')}`}>
                Order Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}