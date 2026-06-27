'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Zap,
  Star,
  Gift,
  Brain,
  CheckCircle2,
  Clock,
  Coins,
  Target,
  Flame,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Medal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletStore } from '@/store/wallet.store';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ElementType;
  completed: boolean;
  type: 'daily' | 'weekly';
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  reward: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  badge: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Monad blokzinciri yaklaşık kaç TPS (saniyede işlem) kapasitesine sahiptir?',
    options: ['~100 TPS', '~1.000 TPS', '~10.000 TPS', '~100.000 TPS'],
    correct: 2,
    explanation: 'Monad, EVM uyumlu paralel yürütme ile ~10.000 TPS kapasitesine ulaşır.',
    reward: 15,
  },
  {
    id: 2,
    question: 'Bu platformda YZ modelleri hangi token standardıyla NFT olarak basılır?',
    options: ['ERC-20', 'ERC-721', 'ERC-1155', 'ERC-4626'],
    correct: 1,
    explanation: 'Her YZ modeli, benzersiz sahiplik için ERC-721 NFT standardıyla tokenize edilir.',
    reward: 15,
  },
  {
    id: 3,
    question: 'IPFS kısaltmasının açılımı nedir?',
    options: [
      'Internet Protocol File System',
      'InterPlanetary File System',
      'Integrated Peer File Storage',
      'Internal Protocol for Secure Files',
    ],
    correct: 1,
    explanation:
      'IPFS (InterPlanetary File System), içerik adresleme kullanan dağıtık bir depolama protokolüdür.',
    reward: 10,
  },
  {
    id: 4,
    question: 'DAO yönetişiminde kararlar nasıl alınır?',
    options: [
      'Tek bir yönetici tarafından',
      'Token sahiplerinin oylamasıyla',
      'Geliştiricilerin onayıyla',
      'Otomatik algoritmalarla',
    ],
    correct: 1,
    explanation:
      'DAO (Merkeziyetsiz Otonom Organizasyon) kararları token sahiplerinin oylamasıyla alınır.',
    reward: 10,
  },
  {
    id: 5,
    question: 'SUM çerçevesi (framework) ne için tasarlanmıştır?',
    options: [
      'Model ağırlıklarını sıkıştırmak için',
      'Depozitolu veri katkı kalitesini güvence altına almak için',
      'Akıllı kontratları derlemek için',
      'NFT metadata formatını standartlaştırmak için',
    ],
    correct: 1,
    explanation:
      'Microsoft Research SUM çerçevesi, depozit mekanizmasıyla veri katkısının kalitesini teşvik eder.',
    reward: 20,
  },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'monad-whale', points: 4850, badge: '🥇' },
  { rank: 2, username: 'ai-builder', points: 3920, badge: '🥈' },
  { rank: 3, username: 'dao-voter', points: 3100, badge: '🥉' },
  { rank: 4, username: 'nft-minter', points: 2750, badge: '⭐' },
  { rank: 5, username: 'data-contrib', points: 2100, badge: '⭐' },
];

const STORAGE_KEY = 'dayai-earn-state';

interface EarnState {
  totalPoints: number;
  completedTasks: string[];
  answeredQuestions: number[];
  streak: number;
  lastActiveDate: string;
}

function loadState(): EarnState {
  if (typeof window === 'undefined')
    return {
      totalPoints: 0,
      completedTasks: [],
      answeredQuestions: [],
      streak: 1,
      lastActiveDate: new Date().toDateString(),
    };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        totalPoints: 0,
        completedTasks: [],
        answeredQuestions: [],
        streak: 1,
        lastActiveDate: new Date().toDateString(),
      };
    return JSON.parse(raw);
  } catch {
    return {
      totalPoints: 0,
      completedTasks: [],
      answeredQuestions: [],
      streak: 1,
      lastActiveDate: new Date().toDateString(),
    };
  }
}

function saveState(state: EarnState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EarnPage() {
  const { isConnected } = useWalletStore();
  const [earnState, setEarnState] = useState<EarnState>(loadState);
  const [activeTab, setActiveTab] = useState<'tasks' | 'quiz' | 'leaderboard'>('tasks');

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizSessionAnswered, setQuizSessionAnswered] = useState<number[]>([]);

  const updateState = useCallback((updater: (prev: EarnState) => EarnState) => {
    setEarnState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Daily tasks — dynamic based on completed state
  const dailyTasks: DailyTask[] = [
    {
      id: 'visit-marketplace',
      title: 'Pazar Yerini Ziyaret Et',
      description: 'Pazar yerindeki modellere göz at',
      reward: 5,
      icon: Target,
      completed: earnState.completedTasks.includes('visit-marketplace'),
      type: 'daily',
    },
    {
      id: 'connect-wallet',
      title: 'Cüzdan Bağla',
      description: 'MetaMask cüzdanını platforma bağla',
      reward: 20,
      icon: Zap,
      completed: earnState.completedTasks.includes('connect-wallet') || isConnected,
      type: 'daily',
    },
    {
      id: 'quiz-complete',
      title: 'YZ Bilgi Yarışması',
      description: 'Günlük bilgi yarışmasını tamamla',
      reward: 50,
      icon: Brain,
      completed: earnState.completedTasks.includes('quiz-complete'),
      type: 'daily',
    },
    {
      id: 'model-review',
      title: 'Model İncele',
      description: 'Herhangi bir model detay sayfasını aç',
      reward: 10,
      icon: Star,
      completed: earnState.completedTasks.includes('model-review'),
      type: 'daily',
    },
    {
      id: 'weekly-streak',
      title: '7 Günlük Seri',
      description: '7 gün arka arkaya giriş yaparak büyük ödül kazan',
      reward: 200,
      icon: Flame,
      completed: earnState.streak >= 7,
      type: 'weekly',
    },
  ];

  // Auto-complete wallet task when connected
  useEffect(() => {
    if (isConnected && !earnState.completedTasks.includes('connect-wallet')) {
      updateState((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + 20,
        completedTasks: [...prev.completedTasks, 'connect-wallet'],
      }));
      toast.success('+20 MON Puan Kazandın!', { description: 'Cüzdan bağlama görevi tamamlandı.' });
    }
  }, [isConnected, earnState.completedTasks, updateState]);

  function completeTask(task: DailyTask) {
    if (task.completed) return;
    updateState((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + task.reward,
      completedTasks: [...prev.completedTasks, task.id],
    }));
    toast.success(`+${task.reward} MON Puan Kazandın!`, { description: task.title });
  }

  // Quiz handlers
  const availableQuestions = QUIZ_QUESTIONS.filter(
    (q) => !earnState.answeredQuestions.includes(q.id),
  );
  const currentQ = availableQuestions[currentQuestion] ?? null;

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowResult(true);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      updateState((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + currentQ.reward,
        answeredQuestions: [...prev.answeredQuestions, currentQ.id],
      }));
      toast.success(`+${currentQ.reward} MON Puan!`, { description: 'Doğru cevap!' });
    } else {
      toast.error('Yanlış cevap!', { description: currentQ.explanation });
    }
    setQuizSessionAnswered((prev) => [...prev, currentQ.id]);
  }

  function nextQuestion() {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentQuestion + 1 >= availableQuestions.length) {
      setQuizComplete(true);
      if (!earnState.completedTasks.includes('quiz-complete')) {
        updateState((prev) => ({
          ...prev,
          totalPoints: prev.totalPoints + 50,
          completedTasks: [...prev.completedTasks, 'quiz-complete'],
        }));
        toast.success('+50 Bonus MON!', { description: 'Günlük yarışma tamamlandı!' });
      }
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  function resetQuiz() {
    updateState((prev) => ({ ...prev, answeredQuestions: [] }));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setQuizSessionAnswered([]);
  }

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const progressPct = (completedCount / dailyTasks.length) * 100;
  const levelThresholds = [0, 100, 300, 600, 1000, 2000, 5000];
  const level = levelThresholds.findLastIndex((t) => earnState.totalPoints >= t) + 1;
  const nextLevelAt = levelThresholds[level] ?? levelThresholds[levelThresholds.length - 1];
  const currentLevelAt = levelThresholds[level - 1] ?? 0;
  const levelPct = Math.min(
    100,
    ((earnState.totalPoints - currentLevelAt) / (nextLevelAt - currentLevelAt)) * 100,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Coins className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kazanç Merkezi</h1>
            <p className="text-sm text-muted-foreground">
              Görevleri tamamla, yarışmaya katıl ve MON token kazan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1.5 text-sm font-semibold border-yellow-500/30 bg-yellow-500/5 text-yellow-500"
          >
            <Coins className="h-3.5 w-3.5" />
            {earnState.totalPoints.toLocaleString('tr-TR')} MON
          </Badge>
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1.5 text-sm border-orange-500/30 bg-orange-500/5 text-orange-500"
          >
            <Flame className="h-3.5 w-3.5" />
            {earnState.streak} Günlük Seri
          </Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{earnState.totalPoints.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-muted-foreground">Toplam MON</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">Seviye {level}</p>
            <p className="text-xs text-muted-foreground">Mevcut Seviye</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {completedCount}/{dailyTasks.length}
            </p>
            <p className="text-xs text-muted-foreground">Bugünkü Görev</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <Medal className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">#{Math.max(1, 6 - level)}</p>
            <p className="text-xs text-muted-foreground">Sıralama</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Seviye {level} → Seviye {level + 1}
            </span>
            <span className="text-muted-foreground">
              {earnState.totalPoints.toLocaleString('tr-TR')} /{' '}
              {nextLevelAt.toLocaleString('tr-TR')} MON
            </span>
          </div>
          <Progress value={levelPct} className="h-2.5" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/40">
        {(
          [
            { key: 'tasks', label: 'Günlük Görevler', icon: Target },
            { key: 'quiz', label: 'YZ Yarışması', icon: Brain },
            { key: 'leaderboard', label: 'Lider Tablosu', icon: Trophy },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Daily progress */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Günlük İlerleme</span>
              <span>
                {completedCount}/{dailyTasks.length} tamamlandı
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />

            {/* Tasks */}
            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card
                    className={`transition-all ${task.completed ? 'border-green-500/30 bg-green-500/5 opacity-75' : 'hover:border-primary/30'}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${task.completed ? 'bg-green-500/20' : 'bg-primary/10'}`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <task.icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{task.title}</p>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
                          >
                            +{task.reward} MON
                          </Badge>
                          {task.type === 'weekly' && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 border-purple-500/30 text-purple-500"
                            >
                              Haftalık
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={task.completed ? 'ghost' : 'default'}
                        disabled={task.completed}
                        onClick={() => completeTask(task)}
                        className="shrink-0"
                      >
                        {task.completed ? (
                          'Tamamlandı'
                        ) : (
                          <>
                            Başla
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bonus card */}
            {completedCount === dailyTasks.length && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Card className="border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                  <CardContent className="p-6 text-center space-y-2">
                    <Gift className="h-10 w-10 text-yellow-500 mx-auto" />
                    <h3 className="font-bold text-lg">Tüm Görevler Tamamlandı! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      Yarın yeni görevler seni bekliyor. Serini korumaya devam et!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {availableQuestions.length === 0 || quizComplete ? (
              <Card className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-8 text-center space-y-4">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h3 className="text-xl font-bold">Tüm Sorular Tamamlandı!</h3>
                  <p className="text-sm text-muted-foreground">
                    {quizSessionAnswered.length} soruda {quizSessionAnswered.length * 15} MON puan
                    kazandın.
                  </p>
                  <Button onClick={resetQuiz} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Yarışmayı Sıfırla
                  </Button>
                </CardContent>
              </Card>
            ) : currentQ ? (
              <div className="space-y-4">
                {/* Progress */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Soru {currentQuestion + 1} / {availableQuestions.length}
                  </span>
                  <Badge variant="outline" className="gap-1 border-yellow-500/30 text-yellow-500">
                    <Coins className="h-3 w-3" />+{currentQ.reward} MON
                  </Badge>
                </div>
                <Progress
                  value={(currentQuestion / availableQuestions.length) * 100}
                  className="h-1.5"
                />

                {/* Question */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base leading-relaxed">{currentQ.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentQ.options.map((opt, idx) => {
                      let variant: string =
                        'border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-primary/5';
                      if (showResult) {
                        if (idx === currentQ.correct)
                          variant =
                            'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400';
                        else if (idx === selectedAnswer && idx !== currentQ.correct)
                          variant = 'border-destructive bg-destructive/10 text-destructive';
                        else variant = 'border-border/30 bg-muted/10 opacity-50';
                      } else if (selectedAnswer === idx) {
                        variant = 'border-primary bg-primary/10';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={showResult}
                          className={`w-full text-left p-3.5 rounded-lg border text-sm font-medium transition-all ${variant}`}
                        >
                          <span className="mr-2 font-bold text-muted-foreground">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-3 rounded-lg bg-muted/40 border border-border/40"
                      >
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground">Açıklama:</strong>{' '}
                          {currentQ.explanation}
                        </p>
                        <Button size="sm" className="mt-3 w-full" onClick={nextQuestion}>
                          {currentQuestion + 1 >= availableQuestions.length
                            ? 'Yarışmayı Bitir'
                            : 'Sonraki Soru →'}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Bu Haftanın Liderleri
                </CardTitle>
                <CardDescription>En fazla MON puan kazanan kullanıcılar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {LEADERBOARD.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-3 rounded-lg ${entry.rank <= 3 ? 'bg-yellow-500/5 border border-yellow-500/20' : 'bg-muted/20'}`}
                  >
                    <span className="text-xl w-8 text-center">{entry.badge}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">@{entry.username}</p>
                      <p className="text-xs text-muted-foreground">#{entry.rank}. sıra</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="gap-1 border-yellow-500/30 text-yellow-500 font-mono"
                    >
                      <Coins className="h-3 w-3" />
                      {entry.points.toLocaleString('tr-TR')}
                    </Badge>
                  </div>
                ))}

                {/* Current user placeholder */}
                <div className="flex items-center gap-4 p-3 rounded-lg border border-primary/30 bg-primary/5 mt-4">
                  <span className="text-xl w-8 text-center">🎯</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Sen</p>
                    <p className="text-xs text-muted-foreground">Seviye {level}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1 border-primary/40 text-primary font-mono"
                  >
                    <Coins className="h-3 w-3" />
                    {earnState.totalPoints.toLocaleString('tr-TR')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rewards info */}
            <Card className="border-dashed border-border/60">
              <CardContent className="p-4 space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  Ödül Seviyeleri
                </h4>
                {[
                  { level: 'Seviye 1', min: 0, reward: 'Platform rozeti' },
                  { level: 'Seviye 2', min: 100, reward: '0.01 MON Token' },
                  { level: 'Seviye 3', min: 300, reward: '0.05 MON Token' },
                  { level: 'Seviye 4', min: 600, reward: '0.1 MON Token + NFT' },
                  { level: 'Seviye 5', min: 1000, reward: '0.5 MON Token + DAO Oy Hakkı' },
                ].map((tier) => (
                  <div
                    key={tier.level}
                    className={`flex items-center justify-between text-xs p-2 rounded ${earnState.totalPoints >= tier.min ? 'text-green-500' : 'text-muted-foreground'}`}
                  >
                    <span className="font-medium">
                      {earnState.totalPoints >= tier.min ? '✓ ' : '○ '}
                      {tier.level} ({tier.min.toLocaleString('tr-TR')} MON)
                    </span>
                    <span>{tier.reward}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
