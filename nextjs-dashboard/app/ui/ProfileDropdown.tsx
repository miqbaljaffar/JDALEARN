'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useSession, signOut } from 'next-auth/react'

export default function ProfileDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

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

  if (status === "loading") {
    return (
      <button className="profile-icon">
        <UserCircleIcon />
      </button>
    );
  }

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="profile-icon">
        <UserCircleIcon />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {!session ? (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              {session.user?.role === 'ADMIN' ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    Akun
                  </Link>
                  <Link href="/profile/orders" onClick={() => setIsOpen(false)}>
                    Riwayat Pesanan
                  </Link>
                </>
              )}
              <a onClick={() => {
                signOut({ callbackUrl: '/' });
                setIsOpen(false);
              }} style={{ cursor: 'pointer' }}>
                Logout
              </a>
            </>
          )}
        </div>
      )}
    </div>
  )
}