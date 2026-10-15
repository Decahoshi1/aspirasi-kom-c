'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ProgressBar';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [aspirations, setAspirations] = useState([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'ADMIN_KOMISI_C') {
      router.push('/login');
      return;
    }
    setUser(parsed);
    fetchAllAspirations();
  }, []);

  const fetchAllAspirations = async () => {
    try {
      const res = await fetch('/api/aspirations');
      const data = await res.json();
      setAspirations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (id: string, status: 'DITERUSKAN' | 'DITOLAK') => {
    const adminNote = notes[id] || (status === 'DITERUSKAN' ? 'Disetujui dan diteruskan ke Waka terkait.' : 'Ditolak oleh Komisi C.');

    try {
      const res = await fetch(`/api/aspirations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      });

      if (res.ok) {
        fetchAllAspirations();
        alert(`Aspirasi berhasil ${status === 'DITERUSKAN' ? 'disetujui & diteruskan' : 'ditolak'}`);
      } else {
        alert('Gagal memperbarui status');
      }
    } catch (e) {
      alert('Kesalahan jaringan');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Dashboard Admin Komisi C (Kurator)</h1>
            <p className="text-xs text-emerald-600 font-medium">Pengawas & Kurator Aspirasi &bull; {user.name}</p>
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

      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 mt-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Kurasi Daftar Aspirasi Siswa</h2>
            <p className="text-xs text-gray-500">Setujui untuk meneruskan ke Waka/Bidang terkait atau tolak/banding.</p>
          </div>

          {aspirations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Belum ada aspirasi masuk.</p>
          ) : (
            <div className="space-y-6">
              {aspirations.map((asp: any) => (
                <div key={asp.id} className="p-5 border rounded-2xl bg-gray-50 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                        {asp.target.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">Siswa: {asp.student?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(asp.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm font-medium text-gray-900">{asp.content}</p>

                  {asp.imageUrl && (
                    <div>
                      <a href={asp.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 underline font-semibold">
                        Lihat Bukti Foto
                      </a>
                    </div>
                  )}

                  <ProgressBar status={asp.status} target={asp.target} />

                  {/* Form Kurasi Admin */}
                  <div className="bg-white p-4 rounded-xl border space-y-3">
                    <label className="block text-xs font-bold text-gray-700">Catatan Komisi C (Opsional untuk Penolakan/Penerusan)</label>
                    <input
                      type="text"
                      value={notes[asp.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [asp.id]: e.target.value })}
                      placeholder="Tuliskan catatan kurasi..."
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleAction(asp.id, 'DITERUSKAN')}
                        className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg text-xs hover:bg-emerald-700 transition"
                      >
                        Setujui & Teruskan ke Waka
                      </button>
                      <button
                        onClick={() => handleAction(asp.id, 'DITOLAK')}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-xs hover:bg-red-700 transition"
                      >
                        Tolak / Banding
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
