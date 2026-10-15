'Change to client component or server component'
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/ProgressBar';

export default function Home() {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState('ALL');

  const fetchAspirations = async () => {
    try {
      const res = await fetch('/api/aspirations');
      const data = await res.json();
      setAspirations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirations();
  }, []);

  const filteredAspirations = selectedTarget === 'ALL' 
    ? aspirations 
    : aspirations.filter((asp: any) => asp.target === selectedTarget);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Aspirasi MAN IC Pekalongan</h1>
            <p className="text-xs text-emerald-700 font-medium">Komisi C MPS Adyaveda</p>
          </div>
          <div className="space-x-3">
            <Link href="/login" className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition">
              Login Akun
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-emerald-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Suarakan Aspirasimu untuk Kemajuan Madrasah</h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto">
            Platform transparansi aspirasi siswa MAN Insan Cendekia Pekalongan. Dipantau langsung oleh Komisi C MPS Adyaveda dan ditindaklanjuti oleh Waka/Bidang terkait.
          </p>
          <div>
            <Link href="/login" className="inline-block px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow hover:bg-emerald-50 transition">
              Beri Aspirasi Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content / Public Status Tracker */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 my-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Daftar Aspirasi & Status Publik</h3>
            <p className="text-xs text-gray-500">Semua aspirasi transparan dan dapat dipantau progresnya secara real-time.</p>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Bidang</option>
              <option value="KEASRAMAAN">Keasramaan</option>
              <option value="SARPRAS">Sarpras</option>
              <option value="AKADEMIK">Akademik</option>
              <option value="HUMAS">Humas</option>
              <option value="KOPERASI_LA_TAHZAN">Koperasi la Tahzan</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data aspirasi...</div>
        ) : filteredAspirations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border p-8 text-gray-500">
            Belum ada aspirasi untuk kategori ini.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAspirations.map((asp: any) => (
              <div key={asp.id} className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                      {asp.target.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">Oleh: {asp.student?.name || 'Siswa Anonim'}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(asp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">
                  "{asp.content}"
                </p>

                {asp.imageUrl && (
                  <div>
                    <a href={asp.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 underline font-medium">
                      Lihat Lampiran Gambar / Bukti
                    </a>
                  </div>
                )}

                {asp.adminNote && (
                  <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                    <strong>Catatan Komisi C:</strong> {asp.adminNote}
                  </div>
                )}

                <div className="border-t pt-3">
                  <ProgressBar status={asp.status} target={asp.target} />
                </div>

                {asp.followUpNote && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-200 space-y-1">
                    <div><strong>Tindak Lanjut Bidang:</strong> {asp.followUpNote}</div>
                    {asp.followUpImage && (
                      <div>
                        <a href={asp.followUpImage} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">
                          Lihat Bukti Foto Pelaksanaan
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Komisi C MPS Adyaveda - MAN Insan Cendekia Pekalongan. All rights reserved.
      </footer>
    </div>
  );
}
