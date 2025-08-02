'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'sonner';
import { ArrowLeftIcon, ClipboardDocumentIcon, ClockIcon, CreditCardIcon, CurrencyDollarIcon, DocumentCheckIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Order {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

const paymentDetails: { [key: string]: { name: string; account: string; logo: string; instructions: string[] } } = {
    mbanking: { 
        name: 'BRI Virtual Account', 
        account: '3901081388670054', 
        logo: '/bri.png',
        instructions: [
            "Buka aplikasi m-BRI di ponsel Anda.",
            "Pilih menu 'm-Transfer' > 'BRI Virtual Account'.",
            "Masukkan nomor Virtual Account di atas dan pilih 'Send'.",
            "Periksa detail transaksi, lalu masukkan PIN m-BRI Anda.",
            "Simpan bukti transfer untuk diunggah."
        ]
    },
    dana: { 
        name: 'DANA', 
        account: '081388670054', 
        logo: '/dana.jpg',
        instructions: [
            "Buka aplikasi DANA.",
            "Pilih menu 'Kirim' lalu pilih 'Kirim ke Nomor HP'.",
            "Masukkan nomor DANA di atas.",
            "Masukkan jumlah total pembayaran dan konfirmasi.",
            "Screenshot bukti transfer setelah berhasil."
        ]
    },
    ovo: { 
        name: 'OVO', 
        account: '081388670054', 
        logo: '/ovo.png',
        instructions: [
            "Buka aplikasi OVO.",
            "Pilih menu 'Transfer' dan pilih 'Ke Sesama OVO'.",
            "Masukkan nomor OVO di atas dan jumlah transfer.",
            "Konfirmasi transaksi dengan PIN OVO Anda.",
            "Screenshot bukti transfer untuk diunggah."
        ]
    },
     gopay: { 
        name: 'GoPay', 
        account: '081388670054', 
        logo: '/gopay.png',
        instructions: [
            "Buka aplikasi Gojek.",
            "Pilih menu 'Bayar' dan pilih 'Ke rekening bank'.",
            "Masukkan nomor GoPay di atas dan jumlah transfer.",
            "Konfirmasi pembayaran dengan PIN GoPay Anda.",
            "Screenshot bukti transfer setelah berhasil."
        ]
    },
};

const getStatusInfo = (status: string) => {
    switch(status.toUpperCase()) {
        case 'PAID':
        case 'SHIPPED':
        case 'DELIVERED':
        case 'WAITING_CONFIRMATION':
            return { color: 'bg-green-100 text-green-800', text: 'Terkonfirmasi' };
        case 'CANCELLED':
            return { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' };
        case 'PENDING':
        default:
            return { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu Pembayaran' };
    }
};


export default function PaymentPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { orderId } = useParams();
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
    
    if (sessionStatus === 'authenticated' && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => {
            if (res.status === 404) throw new Error('Pesanan tidak ditemukan.');
            if (!res.ok) throw new Error('Gagal mengambil data pesanan.');
            return res.json();
        })
        .then(data => setOrder(data))
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [orderId, router, sessionStatus]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // Batas 2MB
          toast.error("Ukuran file maksimal adalah 2MB.");
          return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor berhasil disalin!");
  };

  const handleSubmitProof = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Silakan pilih file bukti pembayaran.');
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const promise = fetch('/api/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(uploadData => {
            if (!uploadData.success) throw new Error('Gagal mengunggah gambar.');
            return fetch(`/api/orders/${orderId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentProof: uploadData.url }),
            });
        })
        .then(paymentRes => {
            if (!paymentRes.ok) throw new Error('Gagal menyimpan bukti pembayaran.');
        });

    toast.promise(promise, {
        loading: 'Mengunggah bukti pembayaran...',
        success: () => {
            router.push('/profile/orders');
            return 'Pembayaran berhasil dikonfirmasi! Pesanan Anda akan segera kami proses.';
        },
        error: (err) => {
            setIsUploading(false);
            return err.message || 'Terjadi kesalahan.';
        },
    });
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
          </div>
      );
  }
  
  if (error) return (
      <div className="card text-center text-red-600 bg-red-50">
          <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
          <p>{error}</p>
          <Link href="/profile/orders" className="btn mt-4">
              Kembali ke Riwayat Pesanan
          </Link>
      </div>
  );

  if (!order) return null;

  const paymentInfo = paymentDetails[order.paymentMethod.toLowerCase()];
  const statusInfo = getStatusInfo(order.status);
  const isPaymentPending = order.status.toUpperCase() === 'PENDING';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative text-center mb-10">
            <Link href="/profile/orders" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Kembali
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Instruksi Pembayaran</h1>
            <p className="text-gray-500 mt-1">Selesaikan dalam 24 jam agar pesanan tidak dibatalkan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Kolom Kiri: Detail & Instruksi */}
            <div className="space-y-6">
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Detail Tagihan</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center gap-2"><ClockIcon className="w-4 h-4" />Status Pesanan</span>
                            <span className={`font-bold px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>{statusInfo.text}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center gap-2"><CreditCardIcon className="w-4 h-4" />Metode Pembayaran</span>
                            <span className="font-semibold text-gray-800">{paymentInfo.name}</span>
                        </div>
                        <div className="border-t my-3"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-medium text-gray-600 flex items-center gap-2"><CurrencyDollarIcon className="w-5 h-5" />Total Pembayaran</span>
                            <span className="font-bold text-blue-600">Rp{order.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Cara Pembayaran</h2>
                    <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 rounded-lg">
                         <Image src={paymentInfo.logo} alt={`${paymentInfo.name} logo`} width={80} height={25} className="object-contain"/>
                         <div className="flex-grow">
                             <p className="text-xs text-gray-500">Nomor Tujuan</p>
                             <p className="text-lg font-bold text-gray-800 tracking-wider">{paymentInfo.account}</p>
                         </div>
                         <button onClick={() => handleCopy(paymentInfo.account)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                             <ClipboardDocumentIcon className="w-6 h-6 text-gray-500" />
                         </button>
                    </div>
                    <ol className="list-decimal list-inside space-y-3 text-gray-600 text-sm">
                        {paymentInfo.instructions.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                </div>
            </div>

            {/* Kolom Kanan: Form Upload */}
            <div className="sticky top-24">
                <div className="card p-6">
                     <div className="text-center mb-5">
                        <DocumentCheckIcon className="w-12 h-12 mx-auto text-blue-500" />
                        <h2 className="text-xl font-semibold mt-2 text-gray-700">Konfirmasi Pembayaran</h2>
                        <p className="text-sm text-gray-500 mt-1">Unggah bukti transfer Anda di sini.</p>
                    </div>

                    {isPaymentPending ? (
                        <form onSubmit={handleSubmitProof} className="space-y-4">
                            <div>
                                <label htmlFor="file-upload" className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-md tracking-wide uppercase border-2 border-dashed border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-colors">
                                    <PhotoIcon className="w-8 h-8"/>
                                    <span className="mt-2 text-base leading-normal">{selectedFile ? selectedFile.name : 'Pilih sebuah file'}</span>
                                    <input id="file-upload" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" required className="hidden"/>
                                </label>
                                {selectedFile && (
                                    <div className="mt-4 text-center">
                                        <Image src={URL.createObjectURL(selectedFile)} alt="Preview bukti transfer" width={200} height={200} className="rounded-lg object-contain mx-auto border"/>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn w-full text-base py-3" disabled={isUploading || !selectedFile}>
                                {isUploading ? 'Mengunggah...' : 'Kirim Konfirmasi'}
                            </button>
                        </form>
                    ) : (
                         <div className="text-center p-6 bg-green-50 rounded-lg">
                             <SparklesIcon className="w-10 h-10 text-green-500 mx-auto" />
                             <p className="mt-2 font-semibold text-green-800">
                                 Pesanan ini sudah dalam proses atau selesai. Terima kasih!
                             </p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}