export type CompetencyTag = 
  | 'tumbukan_efektif' 
  | 'konsentrasi_partikel' 
  | 'luas_permukaan' 
  | 'suhu_kinetik' 
  | 'katalis_energi' 
  | 'laju_vs_waktu';

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  visualCue?: string;
}

export interface DiagnosticQuestion {
  id: number;
  competency: CompetencyTag;
  competencyLabel: string;
  prompt: string;
  visualType: 'collision_angle' | 'concentration_beakers' | 'surface_area_blocks' | 'temperature_speed' | 'catalyst_hill' | 'reaction_time_graph';
  options: DiagnosticOption[];
  explanation: string;
  visualExplanation: string;
}

export type ReadinessLevel = 'Sangat Siap' | 'Cukup Siap' | 'Perlu Penguatan';

export interface ConceptScore {
  tag: CompetencyTag;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  score: number;
  maxScore: number;
  percentage: number;
  readinessLevel: ReadinessLevel;
  answers: Record<number, string>; // questionId -> selectedOptionId
  conceptScores: ConceptScore[];
  recommendations: string[];
  submittedAt: string;
  durationSeconds: number;
}

export interface ClassroomSummary {
  totalStudents: number;
  averageScore: number;
  readinessCounts: {
    sangatSiap: number;
    cukupSiap: number;
    perluPenguatan: number;
  };
  competencyAverages: Record<CompetencyTag, { label: string; percentage: number }>;
}
