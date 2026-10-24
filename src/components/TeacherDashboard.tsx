import React, { useState, useEffect } from 'react';
import { submissionService } from '../services/submissionService';
import { StudentSubmission, CompetencyTag } from '../types/chemistry';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { 
  Users, 
  Award, 
  BarChart3, 
  Download, 
  Trash2, 
  UserPlus, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Filter,
  Activity
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [recentStudentId, setRecentStudentId] = useState<string | null>(null);

  // Load initial and subscribe to real-time updates
  useEffect(() => {
    // Initial fetch
    setSubmissions(submissionService.getSubmissions());

    // Subscribe to live broadcast & poll
    const unsubscribe = submissionService.subscribe((newSub) => {
      setSubmissions((prev) => {
        const filtered = prev.filter((s) => s.id !== newSub.id);
        return [newSub, ...filtered];
      });
      setLastUpdated(new Date());
      setRecentStudentId(newSub.id);

      // Clear highlight after 4 seconds
      setTimeout(() => {
        setRecentStudentId(null);
      }, 4000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter submissions by class
  const filteredSubmissions = submissions.filter((s) => {
    if (selectedClass === 'all') return true;
    return s.studentClass === selectedClass;
  });

  // Calculate analytics
  const totalCount = filteredSubmissions.length;
  const avgScore =
    totalCount > 0
      ? Math.round(
          filteredSubmissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalCount
        )
      : 0;

  const countSangatSiap = filteredSubmissions.filter((s) => s.readinessLevel === 'Sangat Siap').length;
  const countCukupSiap = filteredSubmissions.filter((s) => s.readinessLevel === 'Cukup Siap').length;
  const countPerluPenguatan = filteredSubmissions.filter((s) => s.readinessLevel === 'Perlu Penguatan').length;

  // Concept mastery across the class
  const conceptStats: Record<CompetencyTag, { label: string; correct: number; total: number }> = {
    konsentrasi_partikel: { label: 'Kerapatan & Konsentrasi', correct: 0, total: 0 },
    luas_permukaan: { label: 'Luas Bidang Sentuh', correct: 0, total: 0 },
    suhu_kinetik: { label: 'Suhu & Energi Gerak', correct: 0, total: 0 },
    tumbukan_efektif: { label: 'Teori Tumbukan', correct: 0, total: 0 },
    katalis_energi: { label: 'Peran Katalisator', correct: 0, total: 0 },
    laju_vs_waktu: { label: 'Laju vs Waktu', correct: 0, total: 0 },
  };

  filteredSubmissions.forEach((s) => {
    s.conceptScores.forEach((c) => {
      if (conceptStats[c.tag]) {
        conceptStats[c.tag].correct += c.correct;
        conceptStats[c.tag].total += c.total;
      }
    });
  });

  // Export CSV
  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return;

    const headers = ['Nama Siswa', 'Kelas', 'Nilai (%)', 'Skor', 'Status Kesiapan', 'Waktu Pengumpulan'];
    const rows = filteredSubmissions.map((s) => [
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.studentClass}"`,
      s.percentage,
      `${s.score}/${s.maxScore}`,
      `"${s.readinessLevel}"`,
      `"${new Date(s.submittedAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_cek_bekal_kimia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateStudent = () => {
    submissionService.addDemoSubmission();
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Bapak/Ibu Guru yakin ingin mengosongkan seluruh data asesmen siswa?')) {
      submissionService.clearSubmissions();
      setSubmissions([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Status & Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Live Real-Time Terhubung
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">
              Update: {lastUpdated.toLocaleTimeString('id-ID')}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Dasbor Guru: Hasil Asesmen Diagnostik Real-Time
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Pantau pemahaman konsep prasyarat siswa seketika saat mereka menyelesaikan asesmen
          </p>
        </div>

        {/* Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Tambah data siswa simulasi untuk menguji sinkronisasi live"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            Simulasi Siswa Masuk
          </button>

          <button
            onClick={exportToCSV}
            disabled={filteredSubmissions.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh Rekap CSV
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            title="Kosongkan data untuk sesi kelas baru"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Siswa Selesai</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Siswa telah mengirimkan jawaban</div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Rata-Rata Kelas</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Skor pemahaman materi prasyarat
          </div>
        </div>

        {/* Sangat Siap */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Kategori Sangat Siap</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
            {countSangatSiap}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalCount > 0 ? Math.round((countSangatSiap / totalCount) * 100) : 0}% dari seluruh siswa
          </div>
        </div>

        {/* Perlu Penguatan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Butuh Penguatan Konsep</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
            {countPerluPenguatan}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalCount > 0 ? Math.round((countPerluPenguatan / totalCount) * 100) : 0}% perlu remidiasi visual
          </div>
        </div>
      </div>

      {/* Concept Breakdown Analytics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          Daya Serap Kelas per Konsep Prasyarat Laju Reaksi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(conceptStats).map(([tag, data]) => {
            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={tag} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">{data.label}</span>
                  <span className="font-mono font-bold text-slate-700 tabular-nums">
                    {pct}% ({data.correct}/{data.total})
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Filter Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">Semua Kelas</option>
              <option value="XI MIPA 1">XI MIPA 1</option>
              <option value="XI MIPA 2">XI MIPA 2</option>
              <option value="XI MIPA 3">XI MIPA 3</option>
              <option value="XI MIPA 4">XI MIPA 4</option>
              <option value="XI Fase F-1">XI Fase F-1</option>
              <option value="XI Fase F-2">XI Fase F-2</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Menampilkan <strong className="text-slate-800 font-mono">{filteredSubmissions.length}</strong> siswa
          </span>
        </div>

        {/* Table Content */}
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">Belum ada siswa yang mengumpulkan jawaban.</p>
            <p className="text-xs text-slate-400">
              Siswa dapat membuka tab <strong>Cek Bekal Siswa</strong> untuk mengerjakan asesmen.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Skor Diagnostik</th>
                  <th className="py-3 px-4">Status Kesiapan</th>
                  <th className="py-3 px-4">Waktu Selesai</th>
                  <th className="py-3 px-4 text-right">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((s) => {
                  const isNew = s.id === recentStudentId;
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isNew ? 'bg-emerald-50/70 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {s.studentName}
                        {isNew && (
                          <span className="ml-2 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase">
                            Baru Masuk!
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{s.studentClass}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {s.percentage}% ({s.score}/{s.maxScore})
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            s.readinessLevel === 'Sangat Siap'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.readinessLevel === 'Cukup Siap'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.readinessLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {new Date(s.submittedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Jawaban
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rincian Diagnostik: {selectedStudent.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.studentClass} · Nilai: {selectedStudent.percentage}% ({selectedStudent.readinessLevel})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Jawaban Siswa per Butir Soal:
              </h4>

              {DIAGNOSTIC_QUESTIONS.map((q) => {
                const studentAnsId = selectedStudent.answers[q.id];
                const studentOption = q.options.find((o) => o.id === studentAnsId);
                const correctOption = q.options.find((o) => o.isCorrect);
                const isCorrect = studentAnsId === correctOption?.id;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-semibold">
                      <span className="text-slate-800">Soal {q.id}: {q.competencyLabel}</span>
                      <span className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {isCorrect ? 'Benar' : 'Salah'}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium mb-2">{q.prompt}</p>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <div>
                        <span className="text-slate-500">Jawaban Siswa: </span>
                        <span className={isCorrect ? 'text-emerald-800 font-medium' : 'text-rose-700 font-medium'}>
                          {studentOption?.text || 'Tidak dijawab'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="text-slate-500">Kunci Jawaban: </span>
                          <span className="text-emerald-800 font-medium">{correctOption?.text}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
