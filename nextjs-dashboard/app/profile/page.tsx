'use client'

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// Definisikan tipe untuk user session
interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setFormData({ 
        name: session.user.name ?? '', 
        email: session.user.email ?? '' 
      });
    }
  }, [session]);
  
  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Fungsi untuk update data user (placeholder)
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    // Di sini Anda akan memanggil API untuk update data user di database
    // Contoh: await fetch('/api/user/update', { ... });
    
    // Setelah berhasil, update sesi NextAuth
    await update({ name: formData.name });
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  if (status === "loading") {
    return <div className="card">Memuat profil...</div>;
  }

  if (!session) {
    return (
      <div className="card">
        <h1>Akses Ditolak</h1>
        <p>Anda harus login untuk melihat halaman ini.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Profil Akun</h1>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn" style={{ background: '#e53e3e' }}>
                Logout
            </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', marginTop: '20px' }}>
          {/* ... (kode avatar tetap sama) ... */}
          <div style={{ 
            width: '100px', 
            height: '100px',
            marginRight: '30px',
            background: '#e0e0e0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#555'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            {!isEditing ? (
              <>
                <h1 style={{ marginBottom: '10px' }}>{user?.name}</h1>
                <p>{user?.email}</p>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ fontSize: '24px', fontWeight: 'bold', border: '1px solid #ccc', padding: '5px', borderRadius: '4px' }}
                />
                <p style={{ marginTop: '10px' }}>{user?.email} (Email tidak dapat diubah)</p>
              </form>
            )}
          </div>
        </div>
        
        {!isEditing ? (
            <button onClick={handleEditToggle} className="btn">Edit Identitas</button>
        ) : (
            <div>
                <button onClick={handleUpdate} className="btn" style={{ marginRight: '10px' }}>Simpan Perubahan</button>
                <button onClick={handleEditToggle} className="btn" style={{ background: 'transparent', color: '#333', border: '1px solid #333' }}>Batal</button>
            </div>
        )}
      </div>
    </div>
  );
}