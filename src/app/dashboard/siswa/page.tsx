'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ProgressBar';

export default function SiswaDashboard() {
  const [user, setUser] = useState<any>(null);
  const [aspirations, setAspirations] = useState([]);
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('KEASRAMAAN');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'SISWA') {
      router.push('/login');
      return;
    }
    setUser(parsed);
    fetchMyAspirations(parsed.userId);
  }, []);

  const fetchMyAspirations = async (studentId: string) => {
    try {
      const res = await fetch(`/api/aspirations?studentId=${studentId}`);
      const data = await res.json();
      setAspirations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const res = await fetch('/api/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.userId,
          content,
          target,
          imageUrl: imageUrl || null,
        }),
      });

      if (res.ok) {
        setContent('');
        setImageUrl('');
        fetchMyAspirations(user.userId);
        alert('Aspirasi berhasil dikirim dan menunggu kurasi Komisi C!');
      } else {
        const err = await res.json();
        alert(err.message || 'Gagal mengirim aspirasi');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Dashboard Siswa</h1>
            <p className="text-xs text-emerald-600 font-medium">Halo, {user.name} (NISN: {user.nisnOrEmail})</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-semibold text-gray-600 hover:underline">Beranda Publik</a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 mt-4">
        {/* Form Beri Aspirasi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Form Beri Aspirasi</h2>
            <p className="text-xs text-gray-500">Sampaikan aspirasi, saran, atau kritik membangun untuk madrasah.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Bidang</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2.5 border rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="KEASRAMAAN">Wakil Kepala Bidang Keasramaan</option>
                <option value="SARPRAS">Wakil Kepala Bidang Sarpras</option>
                <option value="AKADEMIK">Wakil Kepala Bidang Akademik</option>
                <option value="HUMAS">Wakil Kepala Bidang Humas</option>
                <option value="KOPERASI_LA_TAHZAN">Koperasi la Tahzan (Kantin / Koperasi Siswa)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Aspirasi</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan detail aspirasi Anda..."
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar / Lampiran (Opsional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/foto-bukti.jpg"
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm shadow-sm disabled:bg-emerald-300"
            >
              {loading ? 'Mengirim...' : 'Kirim Aspirasi'}
            </button>
          </form>
        </div>

        {/* Daftar Aspirasi Saya */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Riwayat Aspirasi Anda</h2>

          {aspirations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Anda belum pernah mengirimkan aspirasi.</p>
          ) : (
            <div className="space-y-4">
              {aspirations.map((asp: any) => (
                <div key={asp.id} className="p-4 border rounded-xl bg-gray-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                      {asp.target.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(asp.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm font-medium text-gray-800">{asp.content}</p>

                  {asp.imageUrl && (
                    <div>
                      <a href={asp.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 underline font-semibold">
                        Lihat Lampiran Gambar
                      </a>
                    </div>
                  )}

                  {asp.adminNote && (
                    <div className="p-2.5 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                      <strong>Catatan Komisi C:</strong> {asp.adminNote}
                    </div>
                  )}

                  <ProgressBar status={asp.status} target={asp.target} />

                  {asp.followUpNote && (
                    <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-200 space-y-1">
                      <div><strong>Tindak Lanjut Bidang:</strong> {asp.followUpNote}</div>
                      {asp.followUpImage && (
                        <div>
                          <a href={asp.followUpImage} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">
                            Lihat Foto Bukti Pelaksanaan
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
