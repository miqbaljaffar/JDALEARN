'use client'

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Definisikan tipe untuk data form yang lebih lengkap
interface ProfileFormData {
  name: string;
  phoneNumber: string;
  address: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phoneNumber: '',
    address: '',
  });

  // Efek untuk mengisi form saat data sesi tersedia atau berubah
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name ?? '',
        phoneNumber: (session.user as any).phoneNumber ?? '',
        address: (session.user as any).address ?? '',
      });
    }
  }, [session]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal memperbarui profil.');
      }

      // --- PERBAIKAN UTAMA ADA DI SINI ---
      // Cukup panggil fungsi update() tanpa argumen.
      // Ini akan secara otomatis memicu NextAuth untuk mengambil ulang data sesi dari server
      // dengan data terbaru yang sudah kita simpan di database.
      await update();
      
      alert('Profil berhasil diperbarui!');
      setIsEditing(false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... sisa kode komponen tetap sama ...
  if (status === "loading") {
    return <div className="card text-center">Memuat profil Anda...</div>;
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }
  
  const renderAvatar = () => (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-4xl font-bold text-gray-600">
      {session?.user?.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profil Akun</h1>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center md:col-span-1">
              {renderAvatar()}
              <h2 className="mt-4 text-xl font-semibold">{session?.user?.name}</h2>
              <p className="text-gray-500">{session?.user?.email}</p>
              {!isEditing && (
                 <button type="button" onClick={() => setIsEditing(true)} className="btn mt-6">
                   Edit Profil
                 </button>
              )}
            </div>

            <div className="space-y-6 md:col-span-2">
              {error && <p className="rounded-md bg-red-100 p-3 text-center text-red-600">{error}</p>}
              <div>
                <label htmlFor="name" className="mb-1 block font-medium">Nama Lengkap</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="mb-1 block font-medium">Alamat Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={session?.user?.email ?? ''}
                  disabled
                  className="input-field bg-gray-100"
                  title="Email tidak dapat diubah"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="mb-1 block font-medium">Nomor Telepon</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., 08123456789"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-1 block font-medium">Alamat</label>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Masukkan alamat lengkap Anda"
                  className="input-field"
                />
              </div>
              
              {isEditing && (
                <div className="flex gap-4">
                  <button type="submit" className="btn flex-1" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn flex-1 border-2 border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100">
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-field:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
          color: #6b7280;
        }
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}