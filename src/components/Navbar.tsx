'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = [
  { label: 'Card Slice', href: '/card-slice' },
  { label: 'Card Stack', href: '/card-stack' },
  { label: 'Card Stack V2', href: '/card-stack-v2' },
  { label: 'Stripe Section', href: '/final' },
  { label: 'Marquee', href: '/marquee' },
  { label: 'Physics Plugin', href: '/physics-plugin' },
  { label: 'Snap', href: '/snap' },
  { label: 'Snap V2', href: '/snap-v2' },
  { label: 'Sticky Video', href: '/sticky-video' },
  { label: 'Text Blur', href: '/text-blur-animation' },
]

const Navbar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-black">
            Gsap Nextjs
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menus.map((menu) => {
              const isActive = pathname === menu.href

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`text-sm font-medium transition-colors ${isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                  {menu.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col space-y-2 px-4 py-3">
            {menus.map((menu) => {
              const isActive = pathname === menu.href

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setOpen(false)}
                  className={`rounded px-3 py-2 text-sm font-medium ${isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {menu.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
