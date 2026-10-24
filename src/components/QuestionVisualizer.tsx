import React from 'react';

interface QuestionVisualizerProps {
  visualType: 'collision_angle' | 'concentration_beakers' | 'surface_area_blocks' | 'temperature_speed' | 'catalyst_hill' | 'reaction_time_graph';
}

export const QuestionVisualizer: React.FC<QuestionVisualizerProps> = ({ visualType }) => {
  switch (visualType) {
    case 'concentration_beakers':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
            Perbandingan Kerapatan Partikel dalam Volume yang Sama
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Beaker A */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-40 border-2 border-slate-500 border-t-0 rounded-b-2xl bg-slate-800/60 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/10" />
                {/* 6 sparse particles */}
                <div className="absolute top-6 left-6 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300" />
                <div className="absolute top-12 right-8 w-3.5 h-3.5 rounded-full bg-orange-400 shadow-sm shadow-orange-300" />
                <div className="absolute bottom-8 left-10 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300" />
                <div className="absolute bottom-12 right-6 w-3.5 h-3.5 rounded-full bg-orange-400 shadow-sm shadow-orange-300" />
                <div className="absolute top-24 left-16 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300" />
              </div>
              <span className="mt-2 text-xs font-medium text-slate-300">Wadah A (Renggang / Encer)</span>
              <span className="text-[11px] text-slate-400">Peluang tabrakan rendah</span>
            </div>

            {/* Beaker B */}
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-40 border-2 border-blue-400 border-t-0 rounded-b-2xl bg-blue-950/40 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/20" />
                {/* 22 packed particles with glowing collision */}
                {[
                  { t: 15, l: 15, c: 'bg-cyan-400' },
                  { t: 20, l: 45, c: 'bg-orange-400' },
                  { t: 15, l: 75, c: 'bg-cyan-400' },
                  { t: 35, l: 30, c: 'bg-orange-400' },
                  { t: 40, l: 65, c: 'bg-cyan-400' },
                  { t: 45, l: 95, c: 'bg-orange-400' },
                  { t: 65, l: 20, c: 'bg-cyan-400' },
                  { t: 70, l: 50, c: 'bg-orange-400' },
                  { t: 65, l: 80, c: 'bg-cyan-400' },
                  { t: 90, l: 25, c: 'bg-orange-400' },
                  { t: 95, l: 60, c: 'bg-cyan-400' },
                  { t: 90, l: 90, c: 'bg-orange-400' },
                  { t: 115, l: 40, c: 'bg-cyan-400' },
                  { t: 120, l: 75, c: 'bg-orange-400' },
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{ top: `${p.t}px`, left: `${p.l}px` }}
                    className={`absolute w-3.5 h-3.5 rounded-full ${p.c} shadow-md`}
                  />
                ))}
                {/* Collision flash badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Tabrakan Sering!
                </div>
              </div>
              <span className="mt-2 text-xs font-semibold text-cyan-300">Wadah B (Padat / Pekat)</span>
              <span className="text-[11px] text-cyan-200">Peluang tabrakan sangat tinggi</span>
            </div>
          </div>
        </div>
      );

    case 'surface_area_blocks':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
            Perbandingan Luas Permukaan Kontak Reaksi
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Solid Chunk */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 bg-slate-800/80 rounded-xl border border-slate-600 flex flex-col items-center justify-center p-3 relative">
                <div className="w-20 h-20 bg-amber-700/80 border-2 border-amber-500 rounded flex items-center justify-center text-center p-1">
                  <span className="text-[11px] font-semibold text-amber-100">Lapisan Dalam Terkunci</span>
                </div>
                <div className="absolute top-2 text-[10px] text-slate-400">Hanya kulit luar yang tersentuh</div>
              </div>
              <span className="mt-2 text-xs font-medium text-slate-300">Tablet Utuh (Bongkahan)</span>
              <span className="text-[11px] text-slate-400">Bidang sentuh terbatas</span>
            </div>

            {/* Crushed Powder */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 bg-emerald-950/30 rounded-xl border border-emerald-600/50 flex flex-col items-center justify-center p-3 relative">
                <div className="grid grid-cols-4 gap-1.5 p-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 bg-emerald-500 rounded-sm border border-emerald-300 shadow-sm" />
                  ))}
                </div>
                <div className="absolute top-2 text-[10px] text-emerald-300 font-medium">Semua sisi terbuka bebas!</div>
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Tablet Digerus (Serbuk Halus)</span>
              <span className="text-[11px] text-emerald-300">Bidang sentuh sangat luas</span>
            </div>
          </div>
        </div>
      );

    case 'temperature_speed':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
            Pengaruh Suhu terhadap Energi Gerak Partikel
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Cold */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 bg-cyan-950/30 border border-cyan-800/60 rounded-xl flex flex-col items-center justify-center p-2 relative">
                <div className="text-2xl mb-1">🧊</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-cyan-400" />
                  <span className="text-xs text-cyan-200">Gerak lambat</span>
                </div>
                <span className="text-[10px] text-cyan-400 mt-2">Energi kinetik kecil</span>
              </div>
              <span className="mt-2 text-xs font-medium text-slate-300">Suhu Dingin (10°C)</span>
              <span className="text-[11px] text-slate-400">Benturan lemah, reaksi lambat</span>
            </div>

            {/* Hot */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 bg-orange-950/30 border border-orange-500/60 rounded-xl flex flex-col items-center justify-center p-2 relative">
                <div className="text-2xl mb-1 animate-bounce">🔥</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-400 ring-2 ring-amber-300 animate-pulse" />
                  <span className="text-xs text-orange-200 font-semibold">Gerak melesat!</span>
                </div>
                <span className="text-[10px] text-amber-300 mt-2">Energi kinetik melimpah</span>
              </div>
              <span className="mt-2 text-xs font-semibold text-orange-400">Suhu Panas (80°C)</span>
              <span className="text-[11px] text-orange-300">Benturan kuat & reaksi kilat</span>
            </div>
          </div>
        </div>
      );

    case 'collision_angle':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
            Perbedaan Tumbukan Meleset vs Tumbukan Efektif
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Ineffective Collision */}
            <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded-xl flex flex-col items-center text-center">
              <div className="h-20 flex items-center justify-center gap-2 relative">
                <div className="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-900">A</div>
                <span className="text-xs text-rose-400">⤢ Terpental ⤡</span>
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-slate-900">B</div>
              </div>
              <div className="text-xs font-semibold text-rose-400">Tabrakan Gagal (Tidak Efektif)</div>
              <span className="text-[11px] text-rose-200/80 mt-1">Arah hadap meleset / tenaga lemah</span>
            </div>

            {/* Effective Collision */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-600/50 rounded-xl flex flex-col items-center text-center">
              <div className="h-20 flex items-center justify-center gap-1 relative">
                <div className="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-900">A</div>
                <div className="text-xs text-amber-300 font-bold">⚡ Tepat! ⚡</div>
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-slate-900">B</div>
                <span className="text-emerald-400 font-bold mx-1">→</span>
                <div className="w-7 h-7 rounded-full bg-emerald-500 ring-2 ring-emerald-300 flex items-center justify-center text-[10px] font-bold text-white">AB</div>
              </div>
              <div className="text-xs font-semibold text-emerald-400">Tumbukan Efektif (Berhasil)</div>
              <span className="text-[11px] text-emerald-200/80 mt-1">Arah tepat + tenaga benturan cukup</span>
            </div>
          </div>
        </div>
      );

    case 'catalyst_hill':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
            Analogi Rute Hambatan Energi Reaksi
          </div>
          <div className="relative h-44 bg-slate-950 rounded-xl p-3 flex flex-col justify-end overflow-hidden border border-slate-800">
            {/* SVG mountain and tunnel */}
            <svg viewBox="0 0 400 140" className="w-full h-full">
              {/* Steep hill without catalyst */}
              <path
                d="M 20 120 Q 200 -20 380 120"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3"
                strokeDasharray="6,4"
              />
              <text x="160" y="30" fill="#f43f5e" fontSize="12" fontWeight="bold">
                Tanpa Katalis: Tanjakan Bukit Terjal
              </text>

              {/* Lower shortcut with catalyst */}
              <path
                d="M 20 120 Q 200 50 380 120"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
              />
              <text x="145" y="85" fill="#10b981" fontSize="12" fontWeight="bold">
                Dengan Katalis: Terowongan Pintas Rendah
              </text>

              {/* Reactants and Products markers */}
              <circle cx="30" cy="120" r="7" fill="#38bdf8" />
              <text x="15" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold">Reaktan</text>

              <circle cx="370" cy="120" r="7" fill="#a855f7" />
              <text x="350" y="135" fill="#a855f7" fontSize="11" fontWeight="bold">Produk</text>
            </svg>
          </div>
          <div className="mt-2 text-center text-xs text-slate-300">
            Katalis tidak menaikkan energi partikel, tetapi menurunkan hambatan energi yang harus dilalui.
          </div>
        </div>
      );

    case 'reaction_time_graph':
      return (
        <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-700 select-none">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">
            Hubungan Kecepatan Reaksi dan Waktu Tuntas
          </div>
          <div className="space-y-4">
            {/* Fast reaction */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-400">⚡ Reaksi Sangat Cepat (Laju Tinggi)</span>
                <span className="font-bold text-emerald-300">Waktu: Hanya 5 Detik</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full w-full" />
              </div>
            </div>

            {/* Slow reaction */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-400">🐢 Reaksi Lambat (Laju Rendah)</span>
                <span className="font-bold text-amber-300">Waktu: 60 Menit (Lama)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-3 rounded-full w-1/4" />
              </div>
            </div>
          </div>
          <div className="mt-4 p-2.5 bg-slate-800/80 rounded-lg text-center text-xs text-slate-300">
            Semakin kencang reaksi berlangsung, maka waktu yang dihabiskan untuk menyelesaikan reaksi semakin singkat.
          </div>
        </div>
      );

    default:
      return null;
  }
};
