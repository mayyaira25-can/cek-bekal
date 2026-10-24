import { StudentSubmission } from '../types/chemistry';

const STORAGE_KEY = 'cek_bekal_kimia_submissions_v2';
const BROADCAST_CHANNEL_NAME = 'cek_bekal_kimia_channel';

// In-browser BroadcastChannel for zero-latency multi-tab sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Fallback if BroadcastChannel is not supported
}

// Initial mock seed data for demo demonstration if empty
const SEED_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-seed-1',
    studentName: 'Ahmad Faiz Pratama',
    studentClass: 'XI MIPA 1',
    score: 6,
    maxScore: 6,
    percentage: 100,
    readinessLevel: 'Sangat Siap',
    answers: { 1: '1a', 2: '2b', 3: '3b', 4: '4b', 5: '5a', 6: '6a' },
    conceptScores: [
      { tag: 'konsentrasi_partikel', label: 'Konsentrasi & Partikel', correct: 1, total: 1, percentage: 100 },
      { tag: 'luas_permukaan', label: 'Luas Bidang Sentuh', correct: 1, total: 1, percentage: 100 },
      { tag: 'suhu_kinetik', label: 'Suhu & Energi Gerak', correct: 1, total: 1, percentage: 100 },
      { tag: 'tumbukan_efektif', label: 'Teori Tumbukan', correct: 1, total: 1, percentage: 100 },
      { tag: 'katalis_energi', label: 'Peran Katalis', correct: 1, total: 1, percentage: 100 },
      { tag: 'laju_vs_waktu', label: 'Laju vs Waktu', correct: 1, total: 1, percentage: 100 },
    ],
    recommendations: ['Pemahaman fondasi prasyarat sudah sangat kokoh. Siap melanjutkan ke topik penentuan orde reaksi!'],
    submittedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    durationSeconds: 195,
  },
  {
    id: 'sub-seed-2',
    studentName: 'Siti Nurhaliza',
    studentClass: 'XI MIPA 1',
    score: 5,
    maxScore: 6,
    percentage: 83,
    readinessLevel: 'Cukup Siap',
    answers: { 1: '1a', 2: '2b', 3: '3b', 4: '4b', 5: '5c', 6: '6a' },
    conceptScores: [
      { tag: 'konsentrasi_partikel', label: 'Konsentrasi & Partikel', correct: 1, total: 1, percentage: 100 },
      { tag: 'luas_permukaan', label: 'Luas Bidang Sentuh', correct: 1, total: 1, percentage: 100 },
      { tag: 'suhu_kinetik', label: 'Suhu & Energi Gerak', correct: 1, total: 1, percentage: 100 },
      { tag: 'tumbukan_efektif', label: 'Teori Tumbukan', correct: 1, total: 1, percentage: 100 },
      { tag: 'katalis_energi', label: 'Peran Katalis', correct: 0, total: 1, percentage: 0 },
      { tag: 'laju_vs_waktu', label: 'Laju vs Waktu', correct: 1, total: 1, percentage: 100 },
    ],
    recommendations: ['Pelajari kembali cara kerja katalis yang merendahkan energi aktivasi tanpa ikut habis.'],
    submittedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    durationSeconds: 240,
  },
  {
    id: 'sub-seed-3',
    studentName: 'Budi Santoso',
    studentClass: 'XI MIPA 2',
    score: 3,
    maxScore: 6,
    percentage: 50,
    readinessLevel: 'Perlu Penguatan',
    answers: { 1: '1b', 2: '2b', 3: '3a', 4: '4b', 5: '5b', 6: '6b' },
    conceptScores: [
      { tag: 'konsentrasi_partikel', label: 'Konsentrasi & Partikel', correct: 0, total: 1, percentage: 0 },
      { tag: 'luas_permukaan', label: 'Luas Bidang Sentuh', correct: 1, total: 1, percentage: 100 },
      { tag: 'suhu_kinetik', label: 'Suhu & Energi Gerak', correct: 0, total: 1, percentage: 0 },
      { tag: 'tumbukan_efektif', label: 'Teori Tumbukan', correct: 1, total: 1, percentage: 100 },
      { tag: 'katalis_energi', label: 'Peran Katalis', correct: 0, total: 1, percentage: 0 },
      { tag: 'laju_vs_waktu', label: 'Laju vs Waktu', correct: 0, total: 1, percentage: 0 },
    ],
    recommendations: [
      'Gunakan Simulasi Visual Partikel untuk melihat bagaimana kerapatan partikel memicu tabrakan.',
      'Eksplorasi pengaruh suhu terhadap kelincahan molekul pada menu Konsep Visual.',
    ],
    submittedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    durationSeconds: 310,
  },
];

export const submissionService = {
  // Get all submissions from localStorage & API
  getSubmissions(): StudentSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    // Set seed if empty
    this.saveToStorage(SEED_SUBMISSIONS);
    return SEED_SUBMISSIONS;
  },

  // Save submissions locally and broadcast to other tabs
  saveToStorage(items: StudentSubmission[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  },

  // Add new student submission in real-time
  async submitAssessment(submission: StudentSubmission): Promise<boolean> {
    const current = this.getSubmissions();
    const updated = [submission, ...current.filter((s) => s.id !== submission.id)];
    this.saveToStorage(updated);

    // Broadcast immediately across open tabs
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'NEW_SUBMISSION',
          payload: submission,
        });
      } catch (err) {
        console.warn('Broadcast channel error', err);
      }
    }

    // Try posting to backend API if available
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
    } catch {
      // Backend may be offline or in static preview, local & broadcast persist flawlessly
    }

    return true;
  },

  // Listen for real-time incoming submissions
  subscribe(callback: (newSubmission: StudentSubmission) => void): () => void {
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'NEW_SUBMISSION' && event.data?.payload) {
        callback(event.data.payload);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            callback(parsed[0]);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }
    window.addEventListener('storage', handleStorage);

    // Also poll server if available
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/submissions');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.saveToStorage(data);
          }
        }
      } catch {
        // Silently skip
      }
    }, 4000);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  },

  // Clear submissions (for teacher reset)
  clearSubmissions() {
    this.saveToStorage([]);
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'CLEAR_SUBMISSIONS' });
    }
    try {
      fetch('/api/submissions', { method: 'DELETE' });
    } catch {
      // Silently skip
    }
  },

  // Add sample demo student for teacher testing
  addDemoSubmission() {
    const demoNames = ['Rizky Ramadhan', 'Putri Ayu Wandira', 'Kevin Pratama', 'Nabila Zahra', 'Dimas Anggoro'];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomScore = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const randomClass = Math.random() > 0.5 ? 'XI MIPA 1' : 'XI MIPA 2';

    const sub: StudentSubmission = {
      id: `sub-demo-${Date.now()}`,
      studentName: randomName,
      studentClass: randomClass,
      score: randomScore,
      maxScore: 6,
      percentage: Math.round((randomScore / 6) * 100),
      readinessLevel: randomScore >= 5 ? 'Sangat Siap' : 'Cukup Siap',
      answers: { 1: '1a', 2: '2b', 3: '3b', 4: '4b', 5: '5a', 6: '6a' },
      conceptScores: [
        { tag: 'konsentrasi_partikel', label: 'Konsentrasi & Partikel', correct: 1, total: 1, percentage: 100 },
        { tag: 'luas_permukaan', label: 'Luas Bidang Sentuh', correct: 1, total: 1, percentage: 100 },
        { tag: 'suhu_kinetik', label: 'Suhu & Energi Gerak', correct: 1, total: 1, percentage: 100 },
        { tag: 'tumbukan_efektif', label: 'Teori Tumbukan', correct: 1, total: 1, percentage: 100 },
        { tag: 'katalis_energi', label: 'Peran Katalis', correct: randomScore > 4 ? 1 : 0, total: 1, percentage: randomScore > 4 ? 100 : 0 },
        { tag: 'laju_vs_waktu', label: 'Laju vs Waktu', correct: 1, total: 1, percentage: 100 },
      ],
      recommendations: ['Siap mengikuti pembelajaran materi lanjutan Laju Reaksi!'],
      submittedAt: new Date().toISOString(),
      durationSeconds: Math.floor(Math.random() * 120) + 120,
    };

    this.submitAssessment(sub);
    return sub;
  },
};
