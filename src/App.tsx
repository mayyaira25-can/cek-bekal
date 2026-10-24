import React, { useState } from 'react';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { FlaskConical, ShieldCheck, ClipboardCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cek-bekal' | 'guru'>('cek-bekal');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState<boolean>(false);

  const handleTabChange = (tab: 'cek-bekal' | 'guru') => {
    if (tab === 'guru' && !isTeacherAuthenticated) {
      setShowTeacherLoginModal(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeacherLoginSuccess = () => {
    setIsTeacherAuthenticated(true);
    setShowTeacherLoginModal(false);
    setActiveTab('guru');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links: Cek Bekal & Ruang Guru) — Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('cek-bekal')}
            className="flex items-center gap-2.5 text-left text-slate-900 hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight whitespace-nowrap">
              Cek Bekal Kimia
            </span>
          </button>

          {/* Zone 2: Concise single-line text navigation links: only Cek Bekal & Ruang Guru */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleTabChange('cek-bekal')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cek-bekal'
                  ? 'text-sky-600 font-bold border-b-2 border-sky-600'
                  : ''
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              Cek Bekal
            </button>
            <button
              onClick={() => handleTabChange('guru')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guru'
                  ? 'text-sky-600 font-bold border-b-2 border-sky-600'
                  : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Ruang Guru
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'cek-bekal' ? (
              <button
                onClick={() => handleTabChange('guru')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                Akses Guru
              </button>
            ) : (
              <button
                onClick={() => handleTabChange('cek-bekal')}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Buka Cek Bekal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'cek-bekal' && <DiagnosticQuiz />}
        {activeTab === 'guru' && <TeacherDashboard />}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Cek Bekal Kimia: Laju Reaksi</span>
            <span>·</span>
            <span>Kurikulum Merdeka SMA</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Kimia Kelas XI</span>
            <span>·</span>
            <button
              onClick={() => {
                if (isTeacherAuthenticated) {
                  setActiveTab('guru');
                } else {
                  setShowTeacherLoginModal(true);
                }
              }}
              className="text-sky-600 hover:underline font-medium cursor-pointer"
            >
              Ruang Guru
            </button>
          </div>
        </div>
      </footer>

      {/* Masked Password Modal for Teacher Access (Password never shown) */}
      <TeacherLoginModal
        isOpen={showTeacherLoginModal}
        onClose={() => setShowTeacherLoginModal(false)}
        onSuccess={handleTeacherLoginSuccess}
      />
    </div>
  );
}
