'use client';

import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { signIn } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 1. Tambahkan state isLoading
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // 2. Atur isLoading menjadi true saat proses dimulai

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        // Redirect ke dashboard untuk admin, atau ke home untuk user lain
        // Cek sesi bisa disederhanakan dengan `useSession` jika sudah ada di scope
        // atau langsung redirect dan biarkan middleware/halaman tujuan yang mengatur
        router.push('/'); // Redirect ke halaman utama, nanti bisa diarahkan dari sana
        router.refresh(); // Memastikan sesi baru diambil oleh server
      }
    } catch (e) {
        setError('Terjadi kesalahan yang tidak terduga.');
    } finally {
        setIsLoading(false); // 3. Atur isLoading kembali ke false setelah selesai
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-full">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan alamat email Anda"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // 4. Nonaktifkan input saat loading
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-2 block text-sm font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // 5. Nonaktifkan input saat loading
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center space-x-2" aria-live="polite">
            <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      
      {/* 6. Ubah teks dan status tombol berdasarkan isLoading */}
      <button type="submit" className="btn w-full justify-center" disabled={isLoading} aria-disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Log in'} <ArrowRightIcon className="ml-auto h-5 w-5" />
      </button>
    </form>
  );
}