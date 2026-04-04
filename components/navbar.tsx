"use client"

import Link from "next/link"
import Image from "next/image"

export function Navbar({ logoUrl, title }: { logoUrl: string; title: string }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 py-2.5">
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Image
                src={logoUrl}
                alt={title}
                width={320}
                height={80}
                className="h-12 w-auto sm:h-[3.25rem] max-w-[min(50vw,13.5rem)] sm:max-w-[17rem] md:max-w-[19rem] shrink-0 object-contain object-left"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">{title}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
