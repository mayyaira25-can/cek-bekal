import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { QuestionVisualizer } from './QuestionVisualizer';
import { submissionService } from '../services/submissionService';
import { StudentSubmission, ConceptScore, ReadinessLevel, CompetencyTag } from '../types/chemistry';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, RotateCcw, Send, User, Award, BookOpen } from 'lucide-react';

export const DiagnosticQuiz: React.FC = () => {
  // Step: 'register' | 'quiz' | 'result'
  const [step, setStep] = useState<'register' | 'quiz' | 'result'>('register');

  // Student Identity: ONLY Name and Class (NO ABSENSI OPTIONS as instructed)
  const [studentName, setStudentName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('XI MIPA 1');

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);

  // Result state
  const [submission, setSubmission] = useState<StudentSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSentToTeacher, setIsSentToTeacher] = useState<boolean>(false);

  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setStep('quiz');
    setCurrentIdx(0);
    setSelectedAnswers({});
    setStartTime(Date.now());
  };

  const handleSelectOption = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];
  const isLastQuestion = currentIdx === DIAGNOSTIC_QUESTIONS.length - 1;
  const allAnswered = DIAGNOSTIC_QUESTIONS.every((q) => selectedAnswers[q.id]);

  const finishQuiz = async () => {
    setIsSubmitting(true);
    const duration = Math.max(10, Math.round((Date.now() - startTime) / 1000));

    // Calculate score
    let correctCount = 0;
    const conceptMap: Record<CompetencyTag, { label: string; correct: number; total: number }> = {
      tumbukan_efektif: { label: 'Teori Tumbukan Efektif', correct: 0, total: 0 },
      konsentrasi_partikel: { label: 'Kerapatan & Konsentrasi', correct: 0, total: 0 },
      luas_permukaan: { label: 'Luas Bidang Sentuh', correct: 0, total: 0 },
      suhu_kinetik: { label: 'Suhu & Energi Gerak', correct: 0, total: 0 },
      katalis_energi: { label: 'Peran Katalisator', correct: 0, total: 0 },
      laju_vs_waktu: { label: 'Laju vs Waktu', correct: 0, total: 0 },
    };

    const recommendations: string[] = [];

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      conceptMap[q.competency].total += 1;
      const userChoice = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);

      if (userChoice === correctOption?.id) {
        correctCount += 1;
        conceptMap[q.competency].correct += 1;
      } else {
        if (q.competency === 'konsentrasi_partikel') {
          recommendations.push('Perkuat pemahaman visual: partikel yang lebih padat memiliki frekuensi tumbukan lebih tinggi.');
        } else if (q.competency === 'luas_permukaan') {
          recommendations.push('Ingat analogi serbuk vs bongkahan: serbuk membuka seluruh bidang sentuh bagi molekul pereaksi.');
        } else if (q.competency === 'suhu_kinetik') {
          recommendations.push('Suhu tinggi membakar energi gerak partikel sehingga tabrakan bertenaga kuat lebih melimpah.');
        } else if (q.competency === 'tumbukan_efektif') {
          recommendations.push('Dua syarat tumbukan efektif: arah hadap tepat dan benturan berenergi cukup.');
        } else if (q.competency === 'katalis_energi') {
          recommendations.push('Katalis tidak menambah energi, melainkan merendahkan ambang rintangan aktivasi.');
        } else if (q.competency === 'laju_vs_waktu') {
          recommendations.push('Reaksi berkecepatan tinggi memerlukan waktu penyelesaian yang semakin singkat.');
        }
      }
    });

    const maxScore = DIAGNOSTIC_QUESTIONS.length;
    const percentage = Math.round((correctCount / maxScore) * 100);

    let readinessLevel: ReadinessLevel = 'Sangat Siap';
    if (percentage < 60) {
      readinessLevel = 'Perlu Penguatan';
    } else if (percentage < 85) {
      readinessLevel = 'Cukup Siap';
    }

    if (recommendations.length === 0) {
      recommendations.push('Selamat! Penguasaan konsep prasyarat kamu sudah sempurna untuk memulai materi Laju Reaksi!');
    }

    const conceptScores: ConceptScore[] = Object.entries(conceptMap).map(([tag, val]) => ({
      tag: tag as CompetencyTag,
      label: val.label,
      correct: val.correct,
      total: val.total,
      percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
    }));

    const newSub: StudentSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentName,
      studentClass,
      score: correctCount,
      maxScore,
      percentage,
      readinessLevel,
      answers: selectedAnswers,
      conceptScores,
      recommendations,
      submittedAt: new Date().toISOString(),
      durationSeconds: duration,
    };

    setSubmission(newSub);

    // Send real-time to teacher dashboard
    await submissionService.submitAssessment(newSub);
    setIsSentToTeacher(true);
    setIsSubmitting(false);
    setStep('result');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Registration Screen */}
      {step === 'register' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Visual Header Banner */}
          <div className="relative h-48 md:h-64 bg-slate-900 overflow-hidden">
            <img
              src="/src/assets/images/hero_reaction_particles_1792815674475.jpg"
              alt="Cek Bekal Kimia Laju Reaksi"
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                Asesmen Diagnostik Awal
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Cek Bekal Kimia: Kesiapan Belajar Laju Reaksi
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
                Asesmen diagnostik awal kesiapan belajar materi Laju Reaksi.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-xl mx-auto space-y-6">
            <form onSubmit={startQuiz} className="space-y-5 text-left bg-slate-50 p-6 rounded-xl border border-slate-200">
              {/* Nama Siswa */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Muhammad Raihan"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Kelas Siswa (Pilihan praktis) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="XI MIPA 1">XI MIPA 1</option>
                  <option value="XI MIPA 2">XI MIPA 2</option>
                  <option value="XI MIPA 3">XI MIPA 3</option>
                  <option value="XI MIPA 4">XI MIPA 4</option>
                  <option value="XI Fase F-1">XI Fase F-1</option>
                  <option value="XI Fase F-2">XI Fase F-2</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!studentName.trim()}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                Mulai Cek Bekal Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Interactive Quiz Screen */}
      {step === 'quiz' && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Progress Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="font-semibold text-slate-900">{studentName}</span>
              <span>·</span>
              <span>{studentClass}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-sky-700 font-mono">
                Soal {currentIdx + 1} dari {DIAGNOSTIC_QUESTIONS.length}
              </span>
              <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                Topik: {currentQ.competencyLabel}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Interactive Visual Illustration Diagram */}
            <div className="my-4">
              <QuestionVisualizer visualType={currentQ.visualType} />
            </div>

            {/* Options List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Pilih Jawaban yang Paling Tepat:
              </span>
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === option.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQ.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-500 ring-1 ring-sky-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-slate-800">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Sebelumnya
            </button>

            {isLastQuestion ? (
              <button
                onClick={finishQuiz}
                disabled={!allAnswered || isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Mengirim ke Guru...' : 'Selesaikan & Kirim Diagnostik'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(DIAGNOSTIC_QUESTIONS.length - 1, prev + 1))}
                disabled={!selectedAnswers[currentQ.id]}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg transition-colors"
              >
                Selanjutnya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Diagnostic Result Screen */}
      {step === 'result' && submission && (
        <div className="space-y-6">
          {/* Real-time sync confirmation banner */}
          {isSentToTeacher && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs md:text-sm font-semibold">
                  Hasil Berhasil Terkirim ke Dasbor Guru Secara Real-Time!
                </span>
              </div>
              <span className="text-xs text-emerald-700">Tersinkronisasi</span>
            </div>
          )}

          {/* Main Score & Readiness Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="text-center max-w-lg mx-auto space-y-3">
              <div className="inline-flex p-3 bg-amber-50 rounded-2xl text-amber-600 mb-1">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Hasil Diagnostik: {submission.studentName}
              </h2>
              <p className="text-xs text-slate-500">
                Kelas: {submission.studentClass} · Waktu Pengerjaan: {Math.floor(submission.durationSeconds / 60)} menit {submission.durationSeconds % 60} detik
              </p>

              {/* Big Score Counter */}
              <div className="py-4">
                <div className="text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {submission.percentage}%
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Skor: {submission.score} dari {submission.maxScore} Soal Terjawab Benar
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-block">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    submission.readinessLevel === 'Sangat Siap'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : submission.readinessLevel === 'Cukup Siap'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  Tingkat Kesiapan: {submission.readinessLevel}
                </span>
              </div>
            </div>

            {/* Concept Mastery Breakdown Bars */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Penguasaan Konsep Prasyarat Laju Reaksi:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.conceptScores.map((c) => (
                  <div key={c.tag} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-800">{c.label}</span>
                      <span className="font-mono font-bold text-slate-700">
                        {c.correct}/{c.total} ({c.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          c.percentage === 100
                            ? 'bg-emerald-500'
                            : c.percentage > 0
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="mt-6 p-4 bg-sky-50/60 border border-sky-200 rounded-xl">
              <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">
                Rekomendasi Belajar Personal:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {submission.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual Question-by-Question Review */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Pembahasan Visual Butir Soal
            </h3>

            <div className="space-y-6">
              {DIAGNOSTIC_QUESTIONS.map((q) => {
                const userChoiceId = submission.answers[q.id];
                const correctOption = q.options.find((o) => o.isCorrect);
                const isCorrect = userChoiceId === correctOption?.id;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">
                        Soal {q.id}: {q.competencyLabel}
                      </span>
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Tepat
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" /> Perlu Dicermati
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 mb-3">{q.prompt}</p>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-700">Kunci Konsep: </span>
                        <span className="text-emerald-800 font-medium">{correctOption?.text}</span>
                      </div>
                      <div className="text-slate-600 border-t border-slate-100 pt-2">
                        <strong>Penjelasan:</strong> {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setStep('register');
                  setStudentName('');
                  setSubmission(null);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Asesmen untuk Siswa Lain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
