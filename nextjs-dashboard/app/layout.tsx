import Link from 'next/link'
import Image from 'next/image'
import ProfileDropdown from './ui/ProfileDropdown' // Impor komponen baru
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import './globals.css'

export const metadata = {
  title: 'My Next.js App',
  description: 'Created with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav">
            <Link href="/" className="logo">
              <Image
                src="/Logo.png"
                alt="Ztyle Logo"
                width={120}
                height={45}
                priority
              />
            </Link>
            
            <div className="nav-right-section">
              <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/news">News</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
              
              <Link href="/checkout" className="profile-icon">
                <ShoppingCartIcon />
              </Link>
              
              {/* Ganti Link ikon dengan komponen ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </nav>
        </header>
        <main className="main">
          {children}
        </main>
        <footer className="footer">
          <p>&copy; 2024 MyApp. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}