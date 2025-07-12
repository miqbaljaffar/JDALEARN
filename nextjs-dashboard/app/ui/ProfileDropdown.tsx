'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk membuka/menutup dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Efek untuk menutup dropdown saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      {/* Tombol ikon profil */}
      <button onClick={toggleDropdown} className="profile-icon">
        <UserCircleIcon />
      </button>

      {/* Menu dropdown, hanya muncul jika isOpen bernilai true */}
      {isOpen && (
        <div className="dropdown-menu">
          <Link href="/profile" onClick={() => setIsOpen(false)}>
            Account
          </Link>
          <Link href="/dashboard/" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
        </div>
      )}
    </div>
  )
}
