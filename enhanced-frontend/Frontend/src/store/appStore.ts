import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

// Domain models (simplified)
export interface Template {
  id: string; name: string; type: string; sport: string; exercises: number; duration: number;
  assignments: number; avgScore: number; createdBy: string; createdAt: string; isActive: boolean;
  description?: string;
}
export interface Exercise {
  id: string; name: string; sport: string; difficulty: string; description: string; metrics: string[];
  submissions: number; avgScore: number; createdBy: string; createdAt: string; videoUrl: string; posterUrl?: string;
}
export interface Candidate { id: string; name: string; sport: string; score: number; status: string; owner?: string; }
export interface Player { id: string; name: string; age: number; location: string; primarySport: string; joinDate: string; totalVideos: number; averageScore: number; inTalentPool: boolean; lastActive: string; }
export interface VideoPending { id: string; player: string; exercise: string; submitted: string; videoUrl: string; }
export interface VideoCompleted { id: string; player: string; exercise: string; score: number; reviewedOn: string; videoUrl: string; }
export interface VideoFlagged { id: string; player: string; reason: string; flaggedOn: string; videoUrl: string; }
export interface Notification { id: string; message: string; createdAt: string; read?: boolean; type?: string; }

interface AppState {
  templates: Template[];
  exercises: Exercise[];
  candidates: Candidate[];
  pipeline: Candidate[]; // pipeline progression list
  players: Player[];
  videosPending: VideoPending[];
  videosCompleted: VideoCompleted[];
  videosFlagged: VideoFlagged[];
  notifications: Notification[];
  // Template actions
  addTemplate(t: Omit<Template,'id'|'createdAt'|'assignments'|'avgScore'|'isActive'>): void;
  updateTemplate(id: string, patch: Partial<Template>): void;
  duplicateTemplate(id: string): void;
  deleteTemplate(id: string): void;
  assignTemplate(id: string, count?: number): void;
  // Exercise actions
  updateExercise(id: string, patch: Partial<Exercise>): void;
  deleteExercise(id: string): void;
  // Video review actions
  reviewVideo(id: string, score: number): void;
  reviewFlaggedVideo(id: string, score: number): void;
  flagVideo(id: string, reason: string): void;
  unflagVideo(id: string): void;
  // Talent actions
  advanceCandidate(id: string): void;
  assignCandidateOwner(id: string, owner: string): void;
  // Player actions
  addPlayer(p: Omit<Player,'id'|'joinDate'|'totalVideos'|'averageScore'|'lastActive'>): void;
  // Pipeline actions
  advancePipelineStage(id: string): void;
  // Notifications
  pushNotification(message: string, type?: string): void;
  markAllNotificationsRead(): void;
}

const cycleStatuses = ['Shortlisted','Interview','Trials','Selected'];

export const useAppStore = create<AppState>((set, get) => ({
  templates: [
    { id: 'TPL001', name: 'Basketball Assessment Battery', type: 'assessment', sport: 'Basketball', exercises: 6, duration: 45, assignments: 89, avgScore: 8.2, createdBy: 'Omkar', createdAt: '2024-01-15', isActive: true },
    { id: 'TPL002', name: 'Football Skills Evaluation', type: 'skills', sport: 'Football', exercises: 8, duration: 60, assignments: 124, avgScore: 7.9, createdBy: 'Nishant', createdAt: '2024-01-10', isActive: true },
    { id: 'TPL003', name: 'General Fitness Test', type: 'fitness', sport: 'General', exercises: 5, duration: 30, assignments: 267, avgScore: 7.6, createdBy: 'Atharv', createdAt: '2024-01-08', isActive: true },
    { id: 'TPL004', name: 'Swimming Technique Program', type: 'training', sport: 'Swimming', exercises: 4, duration: 40, assignments: 56, avgScore: 8.7, createdBy: 'Prachi', createdAt: '2024-01-05', isActive: false },
    { id: 'TPL005', name: 'Athletics Sprint Assessment', type: 'assessment', sport: 'Athletics', exercises: 7, duration: 35, assignments: 178, avgScore: 8.0, createdBy: 'Ishita', createdAt: '2024-01-03', isActive: true }
  ],
  exercises: [
    { id: 'EX001', name: 'Vertical Jump Test', sport: 'Athletics', difficulty: 'beginner', description: 'Measures explosive leg power and vertical leap ability', metrics: ['Power','Technique','Height'], submissions: 245, avgScore: 7.8, createdBy: 'Omkar', createdAt: '2024-01-15', videoUrl: 'https://cdn.coverr.co/videos/coverr-runner-in-the-city-4402/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60' },
    { id: 'EX002', name: 'Shuttle Run 20m', sport: 'Basketball', difficulty: 'intermediate', description: 'Tests agility, speed, and change of direction', metrics: ['Speed','Agility','Endurance'], submissions: 189, avgScore: 8.2, createdBy: 'Nishant', createdAt: '2024-01-10', videoUrl: 'https://cdn.coverr.co/videos/coverr-basketball-player-dribbling-1736/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=60' },
    { id: 'EX003', name: 'Push-up Endurance', sport: 'General', difficulty: 'beginner', description: 'Measures upper body strength and endurance', metrics: ['Strength','Endurance','Form'], submissions: 312, avgScore: 7.5, createdBy: 'Atharv', createdAt: '2024-01-08', videoUrl: 'https://cdn.coverr.co/videos/coverr-gym-pushups-5458/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60' },
    { id: 'EX004', name: 'Swimming Technique', sport: 'Swimming', difficulty: 'advanced', description: 'Evaluates stroke technique and efficiency', metrics: ['Technique','Speed','Efficiency'], submissions: 98, avgScore: 8.7, createdBy: 'Prachi', createdAt: '2024-01-05', videoUrl: 'https://cdn.coverr.co/videos/coverr-swimmer-underwater-5303/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=800&q=60' },
    { id: 'EX005', name: 'Football Dribbling', sport: 'Football', difficulty: 'intermediate', description: 'Tests ball control and dribbling skills', metrics: ['Control','Speed','Accuracy'], submissions: 167, avgScore: 7.9, createdBy: 'Ishita', createdAt: '2024-01-03', videoUrl: 'https://cdn.coverr.co/videos/coverr-football-player-kicking-ball-9493/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1601758124513-c62663cfbe69?auto=format&fit=crop&w=800&q=60' },
    { id: 'EX006', name: 'Boxing Combination', sport: 'Boxing', difficulty: 'advanced', description: 'Evaluates punch combinations and technique', metrics: ['Technique','Power','Speed'], submissions: 78, avgScore: 8.4, createdBy: 'Diksha', createdAt: '2024-01-01', videoUrl: 'https://cdn.coverr.co/videos/coverr-boxing-training-5828/1080p.mp4', posterUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=60' }
  ],
  candidates: [
    { id: 'ATH001', name: 'Diksha', sport: 'Athletics', score: 9.1, status: 'Shortlisted' },
    { id: 'BBL002', name: 'Hritesh', sport: 'Basketball', score: 8.8, status: 'Interview' },
    { id: 'BDM005', name: 'Prachi', sport: 'Badminton', score: 8.5, status: 'Shortlisted' }
  ],
  pipeline: [
    { id: 'ATH001', name: 'Diksha', sport: 'Athletics', score: 9.1, status: 'Screening' },
    { id: 'BBL002', name: 'Hritesh', sport: 'Basketball', score: 8.8, status: 'Interview' },
    { id: 'FTB004', name: 'Nidhish', sport: 'Football', score: 8.2, status: 'Trials' }
  ],
  players: [
    { id: 'PLY001', name: 'Nishant', age: 20, location: 'Mumbai, Maharashtra', primarySport: 'Athletics', joinDate: '2024-08-15', totalVideos: 12, averageScore: 8.6, inTalentPool: true, lastActive: '2h ago' },
    { id: 'PLY002', name: 'Omkar', age: 21, location: 'Pune, Maharashtra', primarySport: 'Basketball', joinDate: '2024-07-22', totalVideos: 18, averageScore: 8.9, inTalentPool: true, lastActive: '1h ago' },
    { id: 'PLY003', name: 'Atharv', age: 19, location: 'Nagpur, Maharashtra', primarySport: 'Football', joinDate: '2024-06-10', totalVideos: 10, averageScore: 8.1, inTalentPool: false, lastActive: 'Today' },
    { id: 'PLY004', name: 'Nidhish', age: 22, location: 'Chennai, Tamil Nadu', primarySport: 'Swimming', joinDate: '2024-05-05', totalVideos: 9, averageScore: 8.3, inTalentPool: false, lastActive: 'Yesterday' },
    { id: 'PLY005', name: 'Hritesh', age: 20, location: 'Delhi, Delhi', primarySport: 'Athletics', joinDate: '2024-04-11', totalVideos: 20, averageScore: 8.4, inTalentPool: true, lastActive: '3h ago' },
    { id: 'PLY006', name: 'Qusai', age: 21, location: 'Hyderabad, Telangana', primarySport: 'Boxing', joinDate: '2024-03-01', totalVideos: 15, averageScore: 8.0, inTalentPool: false, lastActive: '5h ago' },
    { id: 'PLY007', name: 'Ishita', age: 18, location: 'Ahmedabad, Gujarat', primarySport: 'Badminton', joinDate: '2024-02-18', totalVideos: 11, averageScore: 8.7, inTalentPool: true, lastActive: '30m ago' },
    { id: 'PLY008', name: 'Diksha', age: 19, location: 'Bhopal, MP', primarySport: 'Wrestling', joinDate: '2024-01-20', totalVideos: 7, averageScore: 7.9, inTalentPool: false, lastActive: '1d ago' },
    { id: 'PLY009', name: 'Prachi', age: 19, location: 'Jaipur, Rajasthan', primarySport: 'Football', joinDate: '2024-01-02', totalVideos: 14, averageScore: 8.5, inTalentPool: true, lastActive: '4h ago' }
  ],
  videosPending: [
    { id: 'V001', player: 'Ishita', exercise: 'Vertical Jump', submitted: '2025-09-20', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
    { id: 'V002', player: 'Omkar', exercise: 'Sprint', submitted: '2025-09-22', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/bee.mp4' }
  ],
  videosCompleted: [
    { id: 'V010', player: 'Nishant', exercise: 'Freestyle 50m', score: 8.9, reviewedOn: '2025-09-18', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
    { id: 'V011', player: 'Atharv', exercise: 'Sprint', score: 8.2, reviewedOn: '2025-09-19', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/bee.mp4' }
  ],
  videosFlagged: [
    { id: 'V020', player: 'Qusai', reason: 'Inappropriate content', flaggedOn: '2025-09-23', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
  ],
  notifications: [],

  addTemplate: (t) => set(state => {
    const tmpl = { ...t, id: nanoid(6), createdAt: new Date().toISOString().split('T')[0], assignments: 0, avgScore: 0, isActive: true };
    get().pushNotification(`Created template '${tmpl.name}'`,'template');
    return { templates: [...state.templates, tmpl] };
  }),
  updateTemplate: (id, patch) => set(state => {
    const existing = state.templates.find(tp => tp.id === id);
    if(existing) get().pushNotification(`Updated template '${existing.name}'`,'template');
    return { templates: state.templates.map(tp => tp.id === id ? { ...tp, ...patch } : tp) };
  }),
  duplicateTemplate: (id) => {
    const { templates, pushNotification } = get();
    const original = templates.find(t => t.id === id); if(!original) return;
    const copy = { ...original, id: nanoid(6), name: original.name + ' Copy', createdAt: new Date().toISOString().split('T')[0] };
    set({ templates: [...templates, copy] });
    pushNotification(`Duplicated template '${original.name}'`,'template');
  },
  deleteTemplate: (id) => set(state => { const del = state.templates.find(t=>t.id===id); if(del) get().pushNotification(`Deleted template '${del.name}'`,'template'); return { templates: state.templates.filter(t => t.id !== id) }; }),
  assignTemplate: (id, count=1) => set(state => { const temp = state.templates.find(t=>t.id===id); if(temp) get().pushNotification(`Assigned template '${temp.name}'`,'template'); return { templates: state.templates.map(t => t.id===id ? { ...t, assignments: t.assignments + count } : t) }; }),

  updateExercise: (id, patch) => set(state => { const ex = state.exercises.find(e=>e.id===id); if(ex) get().pushNotification(`Updated exercise '${ex.name}'`,'exercise'); return { exercises: state.exercises.map(ex => ex.id === id ? { ...ex, ...patch } : ex) }; }),
  deleteExercise: (id) => set(state => { const ex = state.exercises.find(e=>e.id===id); if(ex) get().pushNotification(`Deleted exercise '${ex.name}'`,'exercise'); return { exercises: state.exercises.filter(ex => ex.id !== id) }; }),

  reviewVideo: (id, score) => set(state => {
    const pending = state.videosPending.find(v => v.id === id); if(!pending) return {} as any;
    get().pushNotification(`Reviewed video ${pending.id} (score ${score})`,'video');
    return {
      videosPending: state.videosPending.filter(v => v.id !== id),
      videosCompleted: [...state.videosCompleted, { id: pending.id, player: pending.player, exercise: pending.exercise, score, reviewedOn: new Date().toISOString().split('T')[0], videoUrl: pending.videoUrl }]
    };
  }),
  flagVideo: (id, reason) => set(state => {
    const pending = state.videosPending.find(v => v.id === id); if(!pending) return {} as any;
    get().pushNotification(`Flagged video ${pending.id}`,'video');
    return {
      videosPending: state.videosPending.filter(v => v.id !== id),
      videosFlagged: [...state.videosFlagged, { id: pending.id, player: pending.player, reason, flaggedOn: new Date().toISOString().split('T')[0], videoUrl: pending.videoUrl }]
    };
  }),
  reviewFlaggedVideo: (id, score) => set(state => {
    const flagged = state.videosFlagged.find(v => v.id === id); if(!flagged) return {} as any;
    get().pushNotification(`Reviewed flagged video ${flagged.id}`,'video');
    return {
      videosFlagged: state.videosFlagged.filter(v => v.id !== id),
      videosCompleted: [...state.videosCompleted, { id: flagged.id, player: flagged.player, exercise: 'N/A', score, reviewedOn: new Date().toISOString().split('T')[0], videoUrl: flagged.videoUrl }]
    };
  }),
  unflagVideo: (id) => set(state => { const f = state.videosFlagged.find(v=>v.id===id); if(f) get().pushNotification(`Removed flag from video ${f.id}`,'video'); return { videosFlagged: state.videosFlagged.filter(v => v.id !== id) }; }),

  advanceCandidate: (id) => set(state => {
    const updated = state.candidates.map(c => c.id === id ? { ...c, status: cycleStatuses[(cycleStatuses.indexOf(c.status) + 1) % cycleStatuses.length] } : c);
    const cand = updated.find(c=>c.id===id); if(cand) get().pushNotification(`Advanced candidate ${cand.name} to ${cand.status}`,'candidate');
    return { candidates: updated };
  }),
  assignCandidateOwner: (id, owner) => set(state => { const pl = state.pipeline.map(c => c.id === id ? { ...c, owner } : c); const cand = pl.find(c=>c.id===id); if(cand) get().pushNotification(`Assigned owner ${owner} to ${cand.name}`,'candidate'); return { pipeline: pl }; }),
  advancePipelineStage: (id) => set(state => {
    const stages = ['Screening','Interview','Trials','Selected'];
    const pl = state.pipeline.map(c => c.id === id ? { ...c, status: stages[(stages.indexOf(c.status) + 1) % stages.length] } : c);
    const ent = pl.find(c=>c.id===id); if(ent) get().pushNotification(`Pipeline: advanced ${ent.name} to ${ent.status}`,'candidate');
    return { pipeline: pl };
  }),

  addPlayer: (p) => set(state => { const player = { ...p, id: nanoid(6), joinDate: new Date().toISOString(), totalVideos: 0, averageScore: 0, lastActive: 'Today' }; get().pushNotification(`Added player ${player.name}`,'player'); return { players: [...state.players, player] }; }),

  pushNotification: (message, type) => set(state => ({ notifications: [{ id: nanoid(8), message, createdAt: new Date().toLocaleTimeString(), type, read: false }, ...state.notifications ].slice(0,50) })),
  markAllNotificationsRead: () => set(state => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }))
}));
