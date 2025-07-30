'use client'
import { useState } from 'react'

// Impor ikon WhatsApp dari library populer
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda kembali.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const whatsappNumber = "6281388670054";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Halo%20Ztyle,%20saya%20tertarik%20dengan%20produk%20Anda.`;


  return (
    <div>
      <div className="card">
        <h1>Hubungi Kami</h1>
        <p>
          Punya pertanyaan atau ingin berdiskusi? Kami akan sangat senang mendengar dari Anda.
          Kirimkan pesan dan kami akan merespons sesegera mungkin.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <div className="card">
          <h2>Kirim Pesan</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nama Lengkap Anda"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #eee',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Alamat email aktif"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #eee',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Pesan Anda
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #eee',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            <button type="submit" className="btn">
              Kirim Pesan
            </button>
          </form>
        </div>
        
        <div className="card">
          <h2>Informasi Kontak</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                <FaWhatsapp size={24} color="#25D366" /> WhatsApp
            </a></h3>
            <p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>+62 813-8867-0054</a></p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>📧 Email</h3>
            <p>kontak@ztyle.com</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>📱 Telepon</h3>
            <p>+62 123 456 7890</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>📍 Alamat</h3>
            <p>
              Jalan Raya No. 123<br />
              Bandung, Jawa Barat 40123<br />
              Indonesia
            </p>
          </div>
          
          <div>
            <h3>🕒 Jam Operasional</h3>
            <p>Senin - Jumat: 09:00 - 18:00 WIB</p>
            <p>Sabtu: 09:00 - 14:00 WIB</p>
            <p>Minggu: Libur</p>
          </div>
        </div>
      </div>
    </div>
  )
}