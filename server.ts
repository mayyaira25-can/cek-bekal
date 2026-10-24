import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // In-memory submissions store with default initial demo seed
  let submissionsStore: any[] = [
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
      recommendations: ['Pemahaman fondasi prasyarat sudah sangat kokoh. Siap melanjutkan ke materi Laju Reaksi!'],
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
  ];

  // SSE connected clients
  let sseClients: Response[] = [];

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Cek Bekal Kimia API' });
  });

  app.get('/api/submissions', (_req: Request, res: Response) => {
    res.json(submissionsStore);
  });

  app.post('/api/submissions', (req: Request, res: Response) => {
    const submission = req.body;
    if (!submission || !submission.studentName) {
      return res.status(400).json({ error: 'Data siswa tidak valid' });
    }

    submissionsStore = [submission, ...submissionsStore.filter((s) => s.id !== submission.id)];

    // Broadcast to SSE clients
    sseClients.forEach((client) => {
      client.write(`data: ${JSON.stringify(submission)}\n\n`);
    });

    res.status(201).json({ success: true, submission });
  });

  app.delete('/api/submissions', (_req: Request, res: Response) => {
    submissionsStore = [];
    sseClients.forEach((client) => {
      client.write(`event: clear\ndata: {}\n\n`);
    });
    res.json({ success: true, message: 'Data berhasil dikosongkan' });
  });

  // Server-Sent Events stream for real-time dashboard
  app.get('/api/submissions/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
  });

  // Vite integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
