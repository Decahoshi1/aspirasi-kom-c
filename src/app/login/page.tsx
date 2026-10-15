'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [nisnOrEmail, setNisnOrEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisnOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login gagal');
        setLoading(false);
        return;
      }

      // Simpan session ke localStorage sederhana untuk demo client-side
      localStorage.setItem('user', JSON.stringify(data));

      // Arahkan berdasarkan role
      if (data.role === 'SISWA') router.push('/dashboard/siswa');
      else if (data.role === 'ADMIN_KOMISI_C') router.push('/dashboard/admin');
      else if (data.role === 'GURU_WAKA') router.push('/dashboard/guru');
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="text-xs text-emerald-600 font-semibold hover:underline">&larr; Kembali ke Beranda</Link>
          <h1 className="text-2xl font-bold text-gray-900 pt-2">Login Aplikasi Aspirasi</h1>
          <p className="text-sm text-gray-500">Komisi C MPS Adyaveda MAN IC Pekalongan</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NISN (Siswa/Admin) atau Email (Guru/Waka)
            </label>
            <input
              type="text"
              required
              value={nisnOrEmail}
              onChange={(e) => setNisnOrEmail(e.target.value)}
              placeholder="Contoh: 0081234567 atau sarpras@manic.sch.id"
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (Default: 123456)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:bg-emerald-300 text-sm"
          >
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 space-y-1 border">
          <p className="font-bold text-gray-700 mb-1">Akun Demo:</p>
          <p>• Siswa: <code className="bg-white px-1 py-0.5 rounded border">0081234567</code> / <code className="bg-white px-1 py-0.5 rounded border">123456</code></p>
          <p>• Admin Komisi C: <code className="bg-white px-1 py-0.5 rounded border">admincomc</code> / <code className="bg-white px-1 py-0.5 rounded border">123456</code></p>
          <p>• Guru/Waka: <code className="bg-white px-1 py-0.5 rounded border">sarpras@manic.sch.id</code> / <code className="bg-white px-1 py-0.5 rounded border">123456</code></p>
        </div>
      </div>
    </div>
  );
}
