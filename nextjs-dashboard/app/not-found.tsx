"use client";
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: '60px 20px',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '20px',
        animation: 'bounce 2s infinite'
      }}>
        404
      </div>
      
      <h1 style={{ 
        fontSize: '48px', 
        marginBottom: '20px',
        color: '#333'
      }}>
        Oops! Page Not Found
      </h1>
      
      <p style={{ 
        fontSize: '18px', 
        color: '#6c757d',
        marginBottom: '40px',
        maxWidth: '500px'
      }}>
        The page you're looking for doesn't exist. It might have been moved, 
        deleted, or you entered the wrong URL.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link href="/" className="btn">
          Go Home
        </Link>
        
        <Link href="/products" className="btn" style={{ 
          background: 'transparent',
          color: '#007bff',
          border: '2px solid #007bff'
        }}>
          Browse Products
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '60px',
        fontSize: '80px',
        opacity: '0.3'
      }}>
        🚀
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}