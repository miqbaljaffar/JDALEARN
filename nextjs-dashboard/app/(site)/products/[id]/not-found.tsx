import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: '60px 20px'
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '20px'
      }}>
        🔍
      </div>
      
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '20px',
        color: '#1f2937'
      }}>
        Product Not Found
      </h1>
      
      <p style={{ 
        fontSize: '18px', 
        color: '#6b7280',
        marginBottom: '40px',
        maxWidth: '500px',
        margin: '0 auto 40px'
      }}>
        Sorry, we couldn't find the product you're looking for. 
        It might have been discontinued or the ID is incorrect.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link href="/products" className="btn">
          View All Products
        </Link>
        
        <Link href="/" className="btn" style={{ 
          background: 'transparent',
          color: '#4f46e5',
          border: '2px solid #4f46e5'
        }}>
          Go Home
        </Link>
      </div>
    </div>
  )
}