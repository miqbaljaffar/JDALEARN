import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700' }}>Login</h1>
          <p style={{ color: '#555', marginTop: '10px' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '600' }}>
              Daftar di sini
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}