'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ProgressBar';

export default function GuruDashboard() {
  const [user, setUser] = useState<any>(null);
  const [aspirations, setAspirations] = useState([]);
  const [followUpNotes, setFollowUpNotes] = useState<{ [key: string]: string }>({});
  const [followUpImages, setFollowUpImages] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'GURU_WAKA') {
      router.push('/login');
      return;
    }
    setUser(parsed);
    fetchAspirationsByTarget(parsed.targetWaka);
  }, []);

  const fetchAspirationsByTarget = async (targetWaka: string) => {
    try {
      const res = await fetch(`/api/aspirations?target=${targetWaka}`);
      const data = await res.json();
      setAspirations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/aspirations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SUDAH_DIBACA' }),
      });
      if (res.ok) {
        fetchAspirationsByTarget(user.targetWaka);
        alert('Aspirasi ditandai "Sudah Dibaca"');
      }
    } catch (e) {
      alert('Gagal memperbarui status');
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    const note = followUpNotes[id];
    if (!note) {
      alert('Deskripsi tindak lanjut wajib diisi sebelum menandai selesai.');
      return;
    }

    try {
      const res = await fetch(`/api/aspirations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SUDAH_DILAKSANAKAN',
          followUpNote: note,
          followUpImage: followUpImages[id] || null,
        }),
      });

      if (res.ok) {
        fetchAspirationsByTarget(user.targetWaka);
        alert('Aspirasi berhasil ditandai "Sudah Dilaksanakan"');
      }
    } catch (e) {
      alert('Gagal memperbarui status');
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
            <h1 className="text-lg font-bold text-gray-900">Dashboard Guru / Waka ({user.targetWaka?.replace(/_/g, ' ')})</h1>
            <p className="text-xs text-emerald-600 font-medium">{user.name}</p>
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
            <h2 className="text-lg font-bold text-gray-900">Aspirasi Masuk untuk Bidang Anda</h2>
            <p className="text-xs text-gray-500">Aspirasi yang sudah disetujui Komisi C dan ditujukan ke bidang Anda.</p>
          </div>

          {aspirations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Belum ada aspirasi untuk bidang ini.</p>
          ) : (
            <div className="space-y-6">
              {aspirations.map((asp: any) => (
                <div key={asp.id} className="p-5 border rounded-2xl bg-gray-50 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                      {asp.target.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">Siswa: {asp.student?.name} &bull; {new Date(asp.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm font-medium text-gray-900">{asp.content}</p>

                  {asp.imageUrl && (
                    <div>
                      <a href={asp.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 underline font-semibold">
                        Lihat Lampiran Foto Siswa
                      </a>
                    </div>
                  )}

                  <ProgressBar status={asp.status} target={asp.target} />

                  {/* Aksi Waka */}
                  <div className="bg-white p-4 rounded-xl border space-y-3">
                    {asp.status === 'DITERUSKAN' && (
                      <button
                        onClick={() => handleMarkAsRead(asp.id)}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition"
                      >
                        Tandai "Sudah Dibaca"
                      </button>
                    )}

                    {(asp.status === 'SUDAH_DIBACA' || asp.status === 'SUDAH_DILAKSANAKAN') && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-gray-700">Form Tindak Lanjut / Penyelesaian</h4>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Deskripsi Tindak Lanjut</label>
                          <textarea
                            rows={3}
                            value={followUpNotes[asp.id] !== undefined ? followUpNotes[asp.id] : (asp.followUpNote || '')}
                            onChange={(e) => setFollowUpNotes({ ...followUpNotes, [asp.id]: e.target.value })}
                            placeholder="Jelaskan tindakan yang telah dilakukan..."
                            className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Link Bukti Foto Penyelesaian (Opsional)</label>
                          <input
                            type="text"
                            value={followUpImages[asp.id] !== undefined ? followUpImages[asp.id] : (asp.followUpImage || '')}
                            onChange={(e) => setFollowUpImages({ ...followUpImages, [asp.id]: e.target.value })}
                            placeholder="https://example.com/foto-selesai.jpg"
                            className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <button
                          onClick={() => handleMarkAsCompleted(asp.id)}
                          className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg text-xs hover:bg-emerald-700 transition"
                        >
                          Simpan & Tandai "Sudah Dilaksanakan"
                        </button>
                      </div>
                    )}
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
