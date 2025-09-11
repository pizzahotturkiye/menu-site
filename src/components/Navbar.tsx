'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center logo-container" onClick={closeMenu}>
              <Image 
                src="/logo.png" 
                alt="Pizza Hot Logo" 
                className="h-12 w-auto transition-transform hover:scale-110 drop-shadow-lg"
                height={48}
                width={60}
                style={{
                  filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(234, 88, 12, 0.5))'
                }}
              />
              <span className="ml-3 text-xl font-bold pizza-title hidden sm:block">
                Pizza Hot
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-all duration-300 relative group ${
                isActive('/') 
                  ? 'text-orange-400' 
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              Ana Sayfa
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-transform duration-300 ${
                isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              href="/menu" 
              className={`font-medium transition-all duration-300 relative group ${
                isActive('/menu') 
                  ? 'text-orange-400' 
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              Menü
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-transform duration-300 ${
                isActive('/menu') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link 
              href="/admin" 
              className={`font-medium transition-all duration-300 relative group ${
                isActive('/admin') 
                  ? 'text-orange-400' 
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              Yönetim
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500 transition-transform duration-300 ${
                isActive('/admin') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-orange-400 hover:bg-red-900/20 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-effect border-t border-red-900/30 mt-4 rounded-lg">
              <Link 
                href="/" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-orange-400 bg-red-900/30' 
                    : 'text-gray-300 hover:text-orange-400 hover:bg-red-900/20'
                }`}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/menu" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive('/menu') 
                    ? 'text-orange-400 bg-red-900/30' 
                    : 'text-gray-300 hover:text-orange-400 hover:bg-red-900/20'
                }`}
              >
                Menü
              </Link>
              <Link 
                href="/admin" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive('/admin') 
                    ? 'text-orange-400 bg-red-900/30' 
                    : 'text-gray-300 hover:text-orange-400 hover:bg-red-900/20'
                }`}
              >
                Yönetim
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
