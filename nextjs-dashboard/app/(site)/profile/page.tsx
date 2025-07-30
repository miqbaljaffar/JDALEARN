'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Skema validasi yang sama dari API
const profileSchema = z.object({
  name: z.string().min(3, "Nama harus memiliki setidaknya 3 karakter.").max(50),
  phoneNumber: z.string().max(15).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name ?? '',
        phoneNumber: session.user.phoneNumber ?? '',
        address: session.user.address ?? '',
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil.');
      }

      // --- AWAL PERUBAHAN ---
      // Panggil update() dengan data baru untuk memperbarui sesi
      await update({
        ...session, // sertakan data sesi yang lama
        user: {
            ...session?.user, // sertakan data user yang lama
            name: data.name, // timpa dengan data baru
            address: data.address,
            phoneNumber: data.phoneNumber,
        }
      });
      // --- AKHIR PERUBAHAN ---

      alert('Profil berhasil diperbarui!');
      setIsEditing(false);

    } catch (err: any) {
      setApiError(err.message);
    }
  };
  
  // Sisa kode UI tidak berubah
  if (status === "loading") {
    return <div className="card text-center">Memuat profil Anda...</div>;
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="card">
        <h1 className="text-2xl font-bold">Profil Akun</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center md:col-span-1">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-4xl font-bold text-gray-600">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{session?.user?.name}</h2>
              <p className="text-gray-500">{session?.user?.email}</p>
              {!isEditing && (
                 <button type="button" onClick={() => setIsEditing(true)} className="btn mt-6">
                   Edit Profil
                 </button>
              )}
            </div>

            <div className="space-y-6 md:col-span-2">
              {apiError && <p className="rounded-md bg-red-100 p-3 text-center text-red-600">{apiError}</p>}
              <div>
                <label htmlFor="name" className="mb-1 block font-medium">Nama Lengkap</label>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  disabled={!isEditing || isSubmitting}
                  className="input-field"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="mb-1 block font-medium">Nomor Telepon</label>
                <input
                  {...register('phoneNumber')}
                  id="phoneNumber"
                  type="tel"
                  disabled={!isEditing || isSubmitting}
                  placeholder="e.g., 081234567890"
                  className="input-field"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label htmlFor="address" className="mb-1 block font-medium">Alamat</label>
                <textarea
                  {...register('address')}
                  id="address"
                  rows={4}
                  disabled={!isEditing || isSubmitting}
                  placeholder="Masukkan alamat lengkap Anda"
                  className="input-field"
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
              </div>
              
              {isEditing && (
                <div className="flex gap-4">
                  <button type="submit" className="btn flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
    </div>
  );
}