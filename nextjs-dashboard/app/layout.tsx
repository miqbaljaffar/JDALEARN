import { poppins } from './ui/fonts';
import Link from 'next/link';
import Image from 'next/image';
import ProfileDropdown from './ui/ProfileDropdown';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import './globals.css';
import Providers from './providers'; 

export const metadata = {
  title: 'Ztyle App',
  description: 'Created with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* 2. Bungkus semua konten dengan Provider */}
        <Providers>
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

                <ProfileDropdown />
              </div>
            </nav>
          </header>
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Ztyle</h3>
                <p>Jalan Raya No. 123<br />Bandung, West Java 40123<br />Indonesia</p>
              </div>
              <div className="footer-section">
                <h3>Hubungi Kami</h3>
                <p>Email: contact@myapp.com</p>
                <p>Telepon: +62 123 456 7890</p>
              </div>
              <div className="footer-section">
                <h3>Ikuti Kami</h3>
                <div className="social-icons">
                  <a href="#" aria-label="Facebook">FB</a>
                  <a href="#" aria-label="Twitter">TW</a>
                  <a href="#" aria-label="Instagram">IG</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Ztyle. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}