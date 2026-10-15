import React from 'react';

export function ProgressBar({ status, target }: { status: string; target: string }) {
  const formatTarget = (t: string) => {
    switch(t) {
      case 'KEASRAMAAN': return 'Keasramaan';
      case 'SARPRAS': return 'Sarpras';
      case 'AKADEMIK': return 'Akademik';
      case 'HUMAS': return 'Humas';
      case 'KOPERASI_LA_TAHZAN': return 'Koperasi la Tahzan';
      default: return t;
    }
  };

  const targetName = formatTarget(target);

  const steps = [
    { key: 'MENUNGGU_KURASI', label: 'Menunggu Kurasi' },
    { key: 'DITERUSKAN', label: `Diteruskan ke ${targetName}` },
    { key: 'SUDAH_DIBACA', label: `Dibaca ${targetName}` },
    { key: 'SUDAH_DILAKSANAKAN', label: 'Sudah Dilaksanakan' },
  ];

  const getStepIndex = (st: string) => {
    if (st === 'DITOLAK') return -1;
    if (st === 'MENUNGGU_KURASI') return 0;
    if (st === 'DITERUSKAN') return 1;
    if (st === 'SUDAH_DIBACA') return 2;
    if (st === 'SUDAH_DILAKSANAKAN') return 3;
    return 0;
  };

  const currentIndex = getStepIndex(status);

  if (status === 'DITOLAK') {
    return (
      <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-200">
        Status: Ditolak / Banding oleh Komisi C (Tidak Dilanjutkan)
      </div>
    );
  }

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-200 -z-0"></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs text-center mt-1.5 font-medium px-1 ${isCurrent ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
