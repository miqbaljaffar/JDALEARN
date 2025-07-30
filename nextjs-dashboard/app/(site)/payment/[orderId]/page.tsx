'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'sonner';
interface Order {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

const paymentDetails: { [key: string]: { name: string; account: string; } } = {
    mbanking: { name: 'BCA Virtual Account', account: '1234567890' },
    dana: { name: 'DANA', account: '081234567890' },
    ovo: { name: 'OVO', account: '081234567890' },
    gopay: { name: 'GoPay', account: '081234567890' },
};

export default function PaymentPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { orderId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    if (status === 'authenticated' && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.ok ? res.json() : Promise.reject('Gagal mengambil data pesanan.'))
        .then(data => setOrder(data))
        .catch(err => setError(err.toString()))
        .finally(() => setIsLoading(false));
    }
  }, [orderId, router, status]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Silakan pilih file bukti pembayaran.');
      return;
    }
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error('Gagal mengunggah gambar.');

      const paymentRes = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof: uploadData.url }),
      });

      if (!paymentRes.ok) throw new Error('Gagal menyimpan bukti pembayaran.');

      toast.success('Bukti pembayaran berhasil diunggah! Pesanan Anda akan segera diproses.');
      router.push('/profile/orders');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="card text-center">Memuat...</div>;
  if (error && !isUploading) return <div className="card text-center text-red-600">{error}</div>; // Sembunyikan error lama saat upload
  if (!order) return <div className="card text-center">Pesanan tidak ditemukan.</div>;

  const paymentInfo = paymentDetails[order.paymentMethod.toLowerCase()];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Selesaikan Pembayaran</h1>
        <p className="text-gray-600 mt-2">Selesaikan pembayaran Anda sebelum batas waktu agar pesanan dapat diproses.</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Detail Pembayaran</h2>
        <div className="space-y-3">
          <div className="flex justify-between"><span>Status Pesanan:</span> <span className="font-bold badge">{order.status}</span></div>
          <div className="flex justify-between"><span>Metode Pembayaran:</span> <span className="font-bold">{paymentInfo.name}</span></div>
          <div className="flex justify-between"><span>Nomor Rekening/Telepon:</span> <span className="font-bold">{paymentInfo.account}</span></div>
          <hr className="my-3"/>
          <div className="flex justify-between text-xl font-bold"><span>Total Pembayaran:</span> <span>Rp{order.totalAmount.toLocaleString('id-ID')}</span></div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h2>
        <form onSubmit={handleSubmitProof}>
          <p className="text-sm text-gray-500 mb-4">Pastikan gambar bukti transfer (struk) terlihat jelas dan tidak buram.</p>
          <input type="file" onChange={handleFileChange} accept="image/*" required className="input-field w-full"/>
          {selectedFile && (
            <div className="mt-4">
              <p>Preview:</p>
              <Image src={URL.createObjectURL(selectedFile)} alt="Preview" width={150} height={150} className="rounded-lg object-cover"/>
            </div>
          )}
          <button type="submit" className="btn w-full mt-6" disabled={isUploading}>
            {isUploading ? 'Mengunggah...' : 'Konfirmasi Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
}