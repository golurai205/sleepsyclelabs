import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Moon, Sun, Clock, Brain, Activity, Bell, Sparkles, Volume2, VolumeX, 
  Play, Pause, TrendingUp, Calendar, Award, Zap, Heart, Coffee,
  ChevronRight, Star, Check, X, Menu, MoonStar, Cloud, Wind,
  Droplets, Timer, BarChart3, Shield, Globe, ArrowRight,
  BrainCircuit, BedDouble, Sunrise, Sunset
} from 'lucide-react'

type SleepRecord = {
  date: string
  bedtime: string
  wakeup: string
  hours: number
  quality: number
}

type TimeOption = {
  time: string
  cycles: number
  quality: 'Good' | 'Better' | 'Best'
  wakeQuality: number
}

const sleepTips = [
  "Keep your bedroom cool (60-67°F) for optimal sleep",
  "Avoid screens 1 hour before bed - blue light disrupts melatonin",
  "Consistent sleep schedule trains your circadian rhythm",
  "Morning sunlight exposure helps regulate sleep-wake cycle",
  "Limit caffeine after 2 PM for better sleep quality",
]

const aiResponses: Record<string, string> = {
  "can't sleep": "Try the 4-7-8 breathing technique: Inhale 4s, hold 7s, exhale 8s. Also ensure your room is dark, cool, and quiet. Avoid screens and establish a wind-down routine 30 minutes before bed.",
  "wake up tired": "You might be waking mid-cycle. Sleep cycles are 90 minutes. Try adjusting bedtime by 15-minute increments. Also check sleep debt - aim for 7-9 hours consistently.",
  "fix sleep schedule": "Shift gradually: move bedtime/wake time by 15 minutes every 2 days. Get morning sunlight within 30 minutes of waking. Avoid naps after 3 PM. Be consistent even on weekends.",
  "insomnia": "Cognitive Behavioral Therapy for Insomnia (CBT-I) is most effective. Keep a sleep diary, limit bed to sleep only, get up if awake >20min, and maintain consistent wake time.",
  "nap": "Best nap: 20 minutes (power nap) or 90 minutes (full cycle). Avoid 30-60 minute naps which cause grogginess. Nap before 3 PM to protect nighttime sleep.",
  "sleep debt": "Repay gradually - add 30-60 minutes extra sleep per night, not all at once. Weekend catch-up helps but consistency is key. Aim for 7-9 hours nightly.",
  "default": "Based on sleep science, aim for 5-6 complete 90-minute cycles (7.5-9 hours). Keep consistent schedule, optimize your environment (cool, dark, quiet), and wind down 60 minutes before bed. Would you like specific advice for your situation?"
}

const blogPosts = [
  {
    title: "The Science of 90-Minute Sleep Cycles",
    excerpt: "Understanding ultradian rhythms and why waking mid-cycle makes you groggy",
    readTime: "4 min",
    category: "Science",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600"
  },
  {
    title: "Why You Wake Up Tired (Even After 8 Hours)",
    excerpt: "Sleep quality matters more than quantity. Learn the 5 hidden disruptors",
    readTime: "5 min",
    category: "Health",
    image: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600"
  },
  {
    title: "Best Time to Sleep by Age Group",
    excerpt: "Optimized bedtimes for teens, adults, and seniors based on circadian science",
    readTime: "6 min",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=600"
  },
  {
    title: "Sleep Debt Calculator: Are You Running on Empty?",
    excerpt: "How to measure, track, and repay your sleep debt without disrupting your rhythm",
    readTime: "7 min",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1455642305367-68834a1d9a72?w=600"
  }
]

const testimonials = [
  { name: "Sarah Chen", location: "San Francisco, USA", text: "Finally waking up refreshed. The 90-minute cycle calculator changed my mornings.", rating: 5, avatar: "SC" },
  { name: "James Mitchell", location: "London, UK", text: "Sleep debt tracker showed I was 12 hours behind. Fixed it in 2 weeks.", rating: 5, avatar: "JM" },
  { name: "Emma Wilson", location: "Toronto, Canada", text: "AI coach gave better advice than my sleep app subscription. And it's free.", rating: 5, avatar: "EW" },
]

export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [calcMode, setCalcMode] = useState<'wake' | 'sleep'>('wake')
  const [targetTime, setTargetTime] = useState('07:00')
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(() => {
    const saved = localStorage.getItem('sleepRecords')
    if (saved) return JSON.parse(saved)
    // Generate demo data
    const records: SleepRecord[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const hours = 6.5 + Math.random() * 2.5
      records.push({
        date: date.toISOString().split('T')[0],
        bedtime: '22:30',
        wakeup: '06:45',
        hours: Math.round(hours * 10) / 10,
        quality: Math.floor(70 + Math.random() * 25)
      })
    }
    return records
  })
  const [dailySleep, setDailySleep] = useState(6.5)
  const [desiredSleep, setDesiredSleep] = useState(8)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const [showPremium, setShowPremium] = useState(false)
  const [bedtimeInput, setBedtimeInput] = useState('22:30')
  const [wakeupInput, setWakeupInput] = useState('06:30')
  const [waterIntake, setWaterIntake] = useState(3)
  const [meditationActive, setMeditationActive] = useState(false)
  const [meditationTime, setMeditationTime] = useState(300)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    localStorage.setItem('sleepRecords', JSON.stringify(sleepRecords))
  }, [sleepRecords])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Meditation timer
  useEffect(() => {
    if (!meditationActive || meditationTime <= 0) return
    const timer = setInterval(() => {
      setMeditationTime(t => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [meditationActive, meditationTime])

  const calculateSleepTimes = useMemo((): TimeOption[] => {
    const [hours, minutes] = targetTime.split(':').map(Number)
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    
    const results: TimeOption[] = []
    const cycleMinutes = 90
    const fallAsleepMinutes = 14
    
    for (let cycles = 6; cycles >= 3; cycles--) {
      const totalMinutes = cycles * cycleMinutes + fallAsleepMinutes
      const calcTime = new Date(target)
      
      if (calcMode === 'wake') {
        calcTime.setMinutes(calcTime.getMinutes() - totalMinutes)
      } else {
        calcTime.setMinutes(calcTime.getMinutes() + totalMinutes)
      }
      
      const timeStr = calcTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      let quality: 'Good' | 'Better' | 'Best' = 'Good'
      let wakeQuality = 70
      if (cycles === 5) { quality = 'Better'; wakeQuality = 85 }
      if (cycles === 6) { quality = 'Best'; wakeQuality = 95 }
      if (cycles === 4) { quality = 'Good'; wakeQuality = 75 }
      if (cycles === 3) { quality = 'Good'; wakeQuality = 65 }
      
      results.push({ time: timeStr, cycles, quality, wakeQuality })
    }
    
    return results
  }, [targetTime, calcMode])

  const sleepDebt = useMemo(() => {
    const dailyDebt = desiredSleep - dailySleep
    const weeklyDebt = dailyDebt * 7
    const recoveryNights = Math.ceil(Math.abs(weeklyDebt) / 1.5)
    return { dailyDebt, weeklyDebt, recoveryNights }
  }, [dailySleep, desiredSleep])

  const avgSleep = useMemo(() => {
    if (sleepRecords.length === 0) return 0
    return sleepRecords.reduce((sum, r) => sum + r.hours, 0) / sleepRecords.length
  }, [sleepRecords])

  const sleepStreak = useMemo(() => {
    let streak = 0
    for (let i = sleepRecords.length - 1; i >= 0; i--) {
      if (sleepRecords[i].hours >= 7) streak++
      else break
    }
    return streak
  }, [sleepRecords])

  const handleAiQuery = () => {
    const query = aiQuery.toLowerCase()
    let response = aiResponses.default
    
    for (const [key, value] of Object.entries(aiResponses)) {
      if (query.includes(key)) {
        response = value
        break
      }
    }
    
    setAiResponse(response)
  }

  const playSleepSound = (type: string) => {
    if (playingSound === type) {
      // Stop
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch {}
      })
      oscillatorsRef.current = []
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
      setPlayingSound(null)
      return
    }

    // Stop previous
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop() } catch {}
    })
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = ctx
    oscillatorsRef.current = []
    
    const createNoise = (freq: number, gain: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)
      gainNode.gain.setValueAtTime(gain, ctx.currentTime)
      
      osc.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start()
      oscillatorsRef.current.push(osc)
      
      // Add subtle modulation
      if (type === 'sine') {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, ctx.currentTime + 3)
      }
    }
    
    switch(type) {
      case 'rain':
        for (let i = 0; i < 5; i++) {
          createNoise(200 + Math.random() * 400, 0.03, 'sawtooth')
        }
        break
      case 'ocean':
        createNoise(80, 0.08, 'sine')
        createNoise(120, 0.05, 'triangle')
        break
      case 'forest':
        createNoise(300, 0.02, 'sine')
        createNoise(600, 0.015, 'triangle')
        break
      case 'white':
        for (let i = 0; i < 3; i++) {
          createNoise(100 + i * 200, 0.04, 'sawtooth')
        }
        break
      case 'fan':
        createNoise(60, 0.06, 'sine')
        createNoise(120, 0.03, 'triangle')
        break
    }
    
    setPlayingSound(type)
  }

  const addSleepRecord = () => {
    const [bh, bm] = bedtimeInput.split(':').map(Number)
    const [wh, wm] = wakeupInput.split(':').map(Number)
    
    let hours = wh + wm/60 - (bh + bm/60)
    if (hours < 0) hours += 24
    
    const newRecord: SleepRecord = {
      date: new Date().toISOString().split('T')[0],
      bedtime: bedtimeInput,
      wakeup: wakeupInput,
      hours: Math.round(hours * 10) / 10,
      quality: Math.floor(65 + Math.random() * 30)
    }
    
    setSleepRecords(prev => [...prev.slice(-6), newRecord])
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowPremium(true), 45000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen font-[Inter] antialiased transition-colors duration-500 ${
      darkMode 
        ? 'bg-[#050816] text-white' 
        : 'bg-[#f8fafc] text-gray-900'
    }`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        h1, h2, .display { font-family: 'Fraunces', Georgia, serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px]"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #3b82f6 50%, transparent 70%)' }} />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, #8b5cf6 50%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        darkMode ? 'bg-[#050816]/70 border-white/5' : 'bg-white/70 border-black/5'
      }`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600 blur-xl opacity-30 rounded-full" />
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <MoonStar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="font-semibold text-[17px] tracking-tight">SleepCycle Pro</div>
                <div className={`text-[11px] -mt-1 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>AI Sleep Intelligence</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Calculator', 'Tracker', 'AI Coach', 'Sounds', 'Blog'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className={`text-[14px] transition-colors hover:text-violet-400 ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer">
                Sign In
              </button>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden w-9 h-9 flex items-center justify-center cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden fixed top-[72px] left-0 right-0 z-30 backdrop-blur-xl border-b ${
              darkMode ? 'bg-[#050816]/95 border-white/5' : 'bg-white/95 border-black/5'
            }`}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {['Calculator', 'Tracker', 'AI Coach', 'Sounds', 'Blog'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  onClick={() => setMobileMenu(false)}
                  className="py-2 text-[15px]">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border"
                style={{
                  background: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
                  borderColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'
                }}>
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[12px] font-medium tracking-wide text-violet-400">TRUSTED BY 500K+ USERS IN USA, UK, CA, AU</span>
              </div>
              
              <h1 className="display text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.02em] mb-6">
                Wake up
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  refreshed
                </span>
                <br />
                every day
              </h1>
              
              <p className={`text-[18px] leading-relaxed mb-8 max-w-[520px] ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                Calculate perfect sleep times using 90-minute cycles. AI-powered insights for deeper sleep, more energy, and better health.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#calculator" className="group relative inline-flex items-center justify-center gap-2 px-7 h-[48px] rounded-2xl bg-white text-black font-medium text-[15px] hover:translate-y-[-1px] transition-all cursor-pointer">
                  <span>Calculate Your Perfect Sleep Time</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <button className={`inline-flex items-center justify-center gap-2 px-7 h-[48px] rounded-2xl backdrop-blur-md border font-medium text-[15px] transition-all cursor-pointer ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                    : 'bg-black/5 border-black/10 hover:bg-black/10 text-black'
                }`}>
                  <Play className="w-4 h-4" />
                  <span>Watch demo</span>
                </button>
              </div>

              <div className="flex items-center gap-6 mt-12">
                {[
                  { label: 'App Store', rating: '4.9' },
                  { label: 'Google Play', rating: '4.8' },
                  { label: 'Product Hunt', rating: '#1' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className={`text-[13px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                      {item.rating} • {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden">
                <img src="/images/hero-sleep.jpg" alt="Sleep" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/60 to-transparent" />
                
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[11px] text-white/50 uppercase tracking-wide">Sleep Quality</div>
                      <div className="text-[20px] font-semibold text-white">94%</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-6 left-6 right-6 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-[11px] text-white/50">Next optimal bedtime</div>
                        <div className="text-[18px] font-semibold text-white">10:24 PM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-white/50">5 cycles • 7.5h</div>
                      <div className="text-[13px] text-emerald-400 font-medium">Best quality</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Glow */}
              <div className="absolute -inset-10 bg-gradient-to-r from-violet-600/20 to-blue-600/20 blur-[80px] -z-10" />
            </motion.div>
          </div>
        </section>

        {/* AdSense Placeholder */}
        <div className={`mb-16 p-4 rounded-2xl border text-center ${
          darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'
        }`}>
          <div className={`text-[11px] uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Advertisement</div>
          <div className={`h-[90px] flex items-center justify-center text-[13px] ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
            AdSense - 728x90 Leaderboard
          </div>
        </div>

        {/* Sleep Calculator */}
        <section id="calculator" className="scroll-mt-24 mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-medium uppercase tracking-wider text-violet-400">Sleep Cycle Calculator</span>
            </div>
            <h2 className="display text-[36px] sm:text-[48px] leading-[1.1] tracking-[-0.02em] mb-4">
              Find your perfect
              <br />sleep window
            </h2>
            <p className={`text-[17px] max-w-[600px] mx-auto ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
              Based on 90-minute sleep cycles. Wake up between cycles, not during them.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <div className={`relative overflow-hidden rounded-[28px] border backdrop-blur-xl ${
                darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <div className="absolute inset-0">
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                  }} />
                </div>
                
                <div className="relative p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {(['wake', 'sleep'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setCalcMode(mode)}
                        className={`flex-1 h-[52px] rounded-2xl font-medium text-[15px] transition-all cursor-pointer ${
                          calcMode === mode
                            ? 'bg-white text-black shadow-lg shadow-black/10'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 text-white/70'
                              : 'bg-black/5 hover:bg-black/10 text-black/70'
                        }`}
                      >
                        {mode === 'wake' ? 'I want to wake up at' : 'I want to sleep at'}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                      <input
                        type="time"
                        value={targetTime}
                        onChange={(e) => setTargetTime(e.target.value)}
                        className={`w-[200px] h-[72px] rounded-2xl text-[32px] font-medium text-center outline-none transition-all cursor-pointer ${
                          darkMode
                            ? 'bg-white/5 border border-white/10 focus:border-violet-500/50 text-white'
                            : 'bg-black/5 border border-black/10 focus:border-violet-500/50 text-black'
                        }`}
                      />
                      <Clock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${darkMode ? 'text-white/30' : 'text-black/30'}`} />
                    </div>
                    <div className={`text-[14px] leading-relaxed ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Accounts for 14 min to fall asleep</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Based on 90-min ultradian cycles</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {calculateSleepTimes.map((option, idx) => (
                      <motion.div
                        key={option.time}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:scale-[1.01] cursor-pointer ${
                          option.quality === 'Best'
                            ? 'border-violet-500/50 bg-violet-500/10'
                            : darkMode
                              ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                              : 'border-black/10 bg-black/[0.02] hover:bg-black/[0.04]'
                        }`}
                      >
                        {option.quality === 'Best' && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                              Recommended
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              option.quality === 'Best' ? 'bg-violet-500/20' :
                              option.quality === 'Better' ? 'bg-blue-500/20' : 'bg-white/5'
                            }`}>
                              {calcMode === 'wake' ? 
                                <Sunset className={`w-6 h-6 ${option.quality === 'Best' ? 'text-violet-400' : 'text-white/70'}`} /> :
                                <Sunrise className={`w-6 h-6 ${option.quality === 'Best' ? 'text-violet-400' : 'text-white/70'}`} />
                              }
                            </div>
                            <div>
                              <div className="text-[28px] font-semibold tracking-tight leading-none">{option.time}</div>
                              <div className={`text-[13px] mt-1 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                                {option.cycles} cycles • {option.cycles * 1.5} hours
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium ${
                              option.quality === 'Best' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              option.quality === 'Better' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-white/10 text-white/70 border border-white/10'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                option.quality === 'Best' ? 'bg-emerald-400' :
                                option.quality === 'Better' ? 'bg-blue-400' : 'bg-white/50'
                              }`} />
                              {option.quality}
                            </div>
                            <div className={`text-[11px] mt-1.5 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                              Wake quality: {option.wakeQuality}%
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nap Calculator */}
            <div className="space-y-6">
              <div className={`rounded-[28px] border backdrop-blur-xl p-6 ${
                darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <h3 className="font-semibold text-[18px] mb-1 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  Nap Calculator
                </h3>
                <p className={`text-[13px] mb-5 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Quick refresh without grogginess</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Power Nap', duration: 20, desc: 'Alertness boost', icon: Zap, color: 'amber' },
                    { name: 'Recovery', duration: 90, desc: 'Full cycle', icon: Brain, color: 'violet' },
                    { name: 'Siesta', duration: 60, desc: 'Memory boost', icon: Heart, color: 'rose' },
                  ].map(nap => {
                    const wakeTime = new Date()
                    wakeTime.setMinutes(wakeTime.getMinutes() + nap.duration + 5)
                    const timeStr = wakeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    
                    return (
                      <button
                        key={nap.name}
                        className={`w-full group relative overflow-hidden rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] cursor-pointer ${
                          darkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10' : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${nap.color}-500/15`}>
                              <nap.icon className={`w-5 h-5 text-${nap.color}-400`} />
                            </div>
                            <div>
                              <div className="font-medium text-[15px]">{nap.name}</div>
                              <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{nap.desc}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[17px] font-semibold">{timeStr}</div>
                            <div className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-black/40'}`}>{nap.duration} min</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sleep Debt */}
              <div className={`rounded-[28px] border backdrop-blur-xl p-6 ${
                darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <h3 className="font-semibold text-[18px] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                  Sleep Debt
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[13px] mb-2">
                      <span className={darkMode ? 'text-white/60' : 'text-black/60'}>You sleep</span>
                      <span className="font-medium">{dailySleep}h / night</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.25"
                      value={dailySleep}
                      onChange={(e) => setDailySleep(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((dailySleep-4)/6)*100}%, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${((dailySleep-4)/6)*100}%, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 100%)`
                      }}
                    />
                  </div>
                  
                  <div className={`p-4 rounded-2xl ${
                    sleepDebt.weeklyDebt < -3 ? 'bg-rose-500/10 border border-rose-500/20' :
                    sleepDebt.weeklyDebt < 0 ? 'bg-amber-500/10 border border-amber-500/20' :
                    'bg-emerald-500/10 border border-emerald-500/20'
                  }`}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[13px] opacity-70">Weekly debt</span>
                      <span className={`text-[24px] font-semibold ${
                        sleepDebt.weeklyDebt < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {sleepDebt.weeklyDebt > 0 ? '+' : ''}{sleepDebt.weeklyDebt.toFixed(1)}h
                      </span>
                    </div>
                    <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                      {sleepDebt.weeklyDebt < 0 
                        ? `Recover with ${sleepDebt.recoveryNights} nights of +90 min`
                        : 'You’re in sleep surplus!'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sleep Tracker Dashboard */}
        <section id="tracker" className="scroll-mt-24 mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="display text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] mb-2">
                Sleep tracker
              </h2>
              <p className={darkMode ? 'text-white/60' : 'text-black/60'}>Your last 7 nights</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-[14px] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
              View full history <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Avg Sleep', value: `${avgSleep.toFixed(1)}h`, change: '+0.3h', icon: Clock, color: 'violet' },
              { label: 'Sleep Streak', value: `${sleepStreak} days`, change: 'Best: 12', icon: Award, color: 'amber' },
              { label: 'Quality', value: '84%', change: '+5%', icon: Heart, color: 'rose' },
              { label: 'Consistency', value: '92%', change: 'Excellent', icon: Activity, color: 'emerald' },
            ].map((stat) => (
              <div key={stat.label} className={`group relative overflow-hidden rounded-[24px] border backdrop-blur-xl p-5 transition-all hover:scale-[1.02] ${
                darkMode ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]' : 'bg-white/60 border-black/5 hover:bg-white/80'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${stat.color}-500/15`}>
                    <stat.icon className={`w-4.5 h-4.5 text-${stat.color}-400`} />
                  </div>
                  <span className={`text-[11px] px-2 py-1 rounded-full ${
                    stat.change.includes('+') ? 'bg-emerald-500/15 text-emerald-400' : darkMode ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className={`text-[12px] mb-1 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{stat.label}</div>
                <div className="text-[26px] font-semibold tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 rounded-[28px] border backdrop-blur-xl p-6 ${
              darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Weekly pattern</h3>
                <div className="flex items-center gap-4 text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className={darkMode ? 'text-white/50' : 'text-black/50'}>Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className={darkMode ? 'text-white/50' : 'text-black/50'}>Quality</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end gap-3 h-[160px]">
                {sleepRecords.map((record, idx) => {
                  const height = (record.hours / 10) * 100
                  const qualityHeight = (record.quality / 100) * 100
                  const date = new Date(record.date)
                  const day = date.toLocaleDateString('en-US', { weekday: 'short' })
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="relative w-full flex items-end justify-center gap-1 h-[120px]">
                        <div 
                          className="w-[60%] rounded-t-lg bg-gradient-to-t from-violet-600 to-violet-400 transition-all group-hover:from-violet-500 group-hover:to-violet-300"
                          style={{ height: `${height}%` }}
                        />
                        <div 
                          className="w-[30%] rounded-t-lg bg-gradient-to-t from-emerald-600/60 to-emerald-400/60 transition-all"
                          style={{ height: `${qualityHeight}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap backdrop-blur-xl border ${
                            darkMode ? 'bg-black/80 border-white/20 text-white' : 'bg-white/90 border-black/20 text-black'
                          }`}>
                            {record.hours}h • {record.quality}%
                          </div>
                        </div>
                      </div>
                      <div className={`text-[11px] ${darkMode ? 'text-white/40' : 'text-black/40'}`}>{day}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`rounded-[28px] border backdrop-blur-xl p-6 ${
              darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
            }`}>
              <h3 className="font-semibold mb-4">Log tonight</h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-[12px] mb-1.5 block ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Bedtime</label>
                  <input
                    type="time"
                    value={bedtimeInput}
                    onChange={(e) => setBedtimeInput(e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl border outline-none transition-all cursor-pointer ${
                      darkMode ? 'bg-white/5 border-white/10 focus:border-violet-500/50' : 'bg-black/5 border-black/10 focus:border-violet-500/50'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[12px] mb-1.5 block ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Wake up</label>
                  <input
                    type="time"
                    value={wakeupInput}
                    onChange={(e) => setWakeupInput(e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl border outline-none transition-all cursor-pointer ${
                      darkMode ? 'bg-white/5 border-white/10 focus:border-violet-500/50' : 'bg-black/5 border-black/10 focus:border-violet-500/50'
                    }`}
                  />
                </div>
                <button
                  onClick={addSleepRecord}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-[14px] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save sleep
                </button>
                
                <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px]">Water intake</span>
                    <span className="text-[13px] font-medium">{waterIntake}/8</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(8)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setWaterIntake(i + 1)}
                        className={`flex-1 h-7 rounded-lg transition-all cursor-pointer ${
                          i < waterIntake ? 'bg-cyan-500' : darkMode ? 'bg-white/10' : 'bg-black/10'
                        }`}
                      >
                        <Droplets className={`w-3.5 h-3.5 mx-auto ${i < waterIntake ? 'text-white' : 'opacity-30'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Sleep Coach */}
        <section id="ai-coach" className="scroll-mt-24 mb-24">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[13px] font-medium uppercase tracking-wider text-violet-400">AI Sleep Coach</span>
              </div>
              <h2 className="display text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] mb-4">
                Ask anything about sleep
              </h2>
              <p className={`text-[16px] leading-relaxed mb-6 ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                Trained on sleep science research. Get personalized advice for insomnia, tiredness, schedule shifts, and more.
              </p>
              <div className="space-y-2">
                {sleepTips.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className={`text-[14px] ${darkMode ? 'text-white/70' : 'text-black/70'}`}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className={`relative overflow-hidden rounded-[28px] border backdrop-blur-xl ${
                darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <div className="p-6 sm:p-8">
                  <div className="flex gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                        placeholder="I can't sleep... I wake up tired... How to fix my schedule?"
                        className={`w-full h-12 px-4 rounded-2xl border outline-none text-[15px] transition-all ${
                          darkMode 
                            ? 'bg-white/5 border-white/10 focus:border-violet-500/50 placeholder:text-white/30' 
                            : 'bg-black/5 border-black/10 focus:border-violet-500/50 placeholder:text-black/30'
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleAiQuery}
                      className="h-12 px-5 rounded-2xl bg-white text-black font-medium text-[14px] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Ask
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {["I can't sleep", "Wake up tired", "Fix sleep schedule", "Best nap length"].map(q => (
                      <button
                        key={q}
                        onClick={() => { setAiQuery(q); setTimeout(handleAiQuery, 100) }}
                        className={`px-3 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                          darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {aiResponse ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-5 rounded-2xl border ${
                          darkMode ? 'bg-violet-500/5 border-violet-500/20' : 'bg-violet-50 border-violet-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[14px] mb-1.5 text-violet-400">AI Coach</div>
                            <p className={`text-[14px] leading-relaxed ${darkMode ? 'text-white/80' : 'text-black/80'}`}>
                              {aiResponse}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center py-12 ${darkMode ? 'text-white/30' : 'text-black/30'}`}
                      >
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-[14px]">Ask a sleep question to get started</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sleep Sounds */}
        <section id="sounds" className="scroll-mt-24 mb-24">
          <div className="text-center mb-12">
            <h2 className="display text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] mb-3">
              Fall asleep faster
            </h2>
            <p className={darkMode ? 'text-white/60' : 'text-black/60'}>Scientifically crafted soundscapes</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1100px] mx-auto">
            {[
              { id: 'rain', name: 'Rain', icon: Cloud, desc: 'Gentle rainfall', color: 'blue' },
              { id: 'ocean', name: 'Ocean', icon: Wind, desc: 'Waves', color: 'cyan' },
              { id: 'forest', name: 'Forest', icon: Moon, desc: 'Night sounds', color: 'emerald' },
              { id: 'white', name: 'White Noise', icon: Volume2, desc: 'Pure focus', color: 'violet' },
              { id: 'fan', name: 'Fan', icon: Wind, desc: 'Consistent hum', color: 'slate' },
            ].map(sound => (
              <motion.button
                key={sound.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playSleepSound(sound.id)}
                className={`group relative overflow-hidden rounded-[24px] border backdrop-blur-xl p-6 text-left transition-all cursor-pointer ${
                  playingSound === sound.id
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : darkMode
                      ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                      : 'bg-white/60 border-black/5 hover:bg-white/80'
                }`}
              >
                {playingSound === sound.id && (
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                      backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                )}
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                    playingSound === sound.id
                      ? 'bg-violet-500 text-white'
                      : `bg-${sound.color}-500/15 group-hover:bg-${sound.color}-500/25`
                  }`}>
                    {playingSound === sound.id ? 
                      <Pause className="w-6 h-6" /> : 
                      <sound.icon className={`w-6 h-6 text-${sound.color}-400`} />
                    }
                  </div>
                  <div className="font-semibold text-[17px] mb-1">{sound.name}</div>
                  <div className={`text-[13px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{sound.desc}</div>
                  
                  {playingSound === sound.id && (
                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-violet-400 rounded-full"
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Meditation Timer */}
          <div className="max-w-[500px] mx-auto mt-12">
            <div className={`rounded-[28px] border backdrop-blur-xl p-6 text-center ${
              darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold">Meditation Timer</h3>
              </div>
              <div className="text-[48px] font-medium tracking-tight mb-4">
                {Math.floor(meditationTime / 60)}:{(meditationTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex justify-center gap-3">
                {[5, 10, 15].map(min => (
                  <button
                    key={min}
                    onClick={() => { setMeditationTime(min * 60); setMeditationActive(false) }}
                    className={`px-4 h-9 rounded-xl text-[13px] border transition-all cursor-pointer ${
                      darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
                <button
                  onClick={() => setMeditationActive(!meditationActive)}
                  className="px-5 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {meditationActive ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="scroll-mt-24 mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="display text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.02em] mb-2">
                Sleep science
              </h2>
              <p className={darkMode ? 'text-white/60' : 'text-black/60'}>Evidence-based guides</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {blogPosts.map((post) => (
              <article key={post.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden mb-4">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-white/15 text-white border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-[17px] leading-snug mb-2 group-hover:text-violet-400 transition-colors">
                  {post.title}
                </h3>
                <p className={`text-[14px] leading-relaxed mb-3 line-clamp-2 ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                  {post.excerpt}
                </p>
                <div className={`flex items-center gap-2 text-[12px] ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className={`rounded-[24px] border backdrop-blur-xl p-6 ${
                darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-[15px] leading-relaxed mb-4 ${darkMode ? 'text-white/80' : 'text-black/80'}`}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-[12px] font-medium">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-[14px]">{t.name}</div>
                    <div className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate Products */}
        <section className="mb-24">
          <div className={`rounded-[28px] border backdrop-blur-xl p-8 sm:p-10 ${
            darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white/40 border-black/5'
          }`}>
            <div className="text-center max-w-[600px] mx-auto">
              <Shield className="w-8 h-8 mx-auto mb-4 text-violet-400" />
              <h3 className="display text-[28px] mb-3">Sleep better tonight</h3>
              <p className={`mb-8 ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                Curated products recommended by sleep scientists
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { name: 'Blue Light Glasses', price: '$49', rating: '4.8' },
                  { name: 'Weighted Blanket', price: '$89', rating: '4.9' },
                  { name: 'Sleep Mask Pro', price: '$29', rating: '4.7' },
                ].map(product => (
                  <div key={product.name} className={`p-4 rounded-2xl border text-left ${
                    darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}>
                    <div className="font-medium mb-1">{product.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-violet-400 font-semibold">{product.price}</span>
                      <span className={`text-[12px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>★ {product.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24 max-w-[800px] mx-auto">
          <h2 className="display text-[32px] text-center mb-10">Frequently asked</h2>
          <div className="space-y-3">
            {[
              { q: 'Why 90-minute cycles?', a: 'Sleep occurs in ultradian rhythms of approximately 90 minutes, cycling through light, deep, and REM sleep. Waking at the end of a cycle prevents sleep inertia (grogginess).' },
              { q: 'Is this accurate for everyone?', a: 'Cycles range from 80-110 minutes. 90 minutes is the average. Track your own patterns for 2 weeks to personalize.' },
              { q: 'What about the 14-minute fall-asleep time?', a: 'Average sleep latency is 10-20 minutes. We use 14 as a conservative estimate. Adjust based on your experience.' },
              { q: 'Does it work across time zones?', a: 'Yes! The calculator works for USA, UK, Canada, and Australia. Your circadian rhythm adapts within 1 day per time zone crossed.' },
            ].map((faq, idx) => (
              <details key={idx} className={`group rounded-2xl border backdrop-blur-xl ${
                darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white/60 border-black/5'
              }`}>
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className={`px-5 pb-5 -mt-1 ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative border-t mt-24 ${darkMode ? 'border-white/5 bg-[#030510]' : 'border-black/5 bg-white'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <MoonStar className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-[18px]">SleepCycle Pro</span>
              </div>
              <p className={`text-[14px] leading-relaxed max-w-[320px] mb-4 ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                AI-powered sleep calculator trusted by 500,000+ users across USA, UK, Canada, and Australia.
              </p>
              <div className="flex items-center gap-3">
                <Globe className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-black/30'}`} />
                <span className={`text-[13px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Available worldwide • Free forever</span>
              </div>
            </div>
            
            {[
              { title: 'Product', links: ['Calculator', 'Sleep Tracker', 'AI Coach', 'Sounds'] },
              { title: 'Resources', links: ['Blog', 'Sleep Science', 'FAQ', 'Support'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Contact'] },
            ].map(section => (
              <div key={section.title}>
                <div className="font-medium text-[14px] mb-3">{section.title}</div>
                <div className="space-y-2.5">
                  {section.links.map(link => (
                    <a key={link} href="#" className={`block text-[14px] transition-colors hover:text-violet-400 cursor-pointer ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] ${
            darkMode ? 'border-white/5 text-white/40' : 'border-black/5 text-black/40'
          }`}>
            <div>© 2025 SleepCycle Pro. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <span>Made for better mornings</span>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Sleep well</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Popup */}
      <AnimatePresence>
        {showPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPremium(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-[420px] rounded-[32px] border backdrop-blur-2xl p-8 ${
                darkMode ? 'bg-[#0a0e1a] border-white/10' : 'bg-white border-black/10'
              }`}
            >
              <button
                onClick={() => setShowPremium(false)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-gradient-to-br from-violet-600 to-blue-600 mb-5">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="display text-[28px] mb-2">Go Pro</h3>
                <p className={`mb-6 ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
                  Unlock advanced sleep analytics, smart alarms, and personalized coaching
                </p>
                
                <div className={`rounded-2xl p-5 mb-6 text-left ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                  {['Unlimited sleep history', 'Smart wake-up alarms', 'Advanced AI coach', 'No ads'].map(feature => (
                    <div key={feature} className="flex items-center gap-2.5 py-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-[14px]">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-[42px] font-semibold tracking-tight">$4.99</span>
                  <span className={darkMode ? 'text-white/50' : 'text-black/50'}>/month</span>
                </div>
                
                <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  Start 7-day free trial
                </button>
                <button
                  onClick={() => setShowPremium(false)}
                  className={`w-full h-11 mt-3 text-[14px] transition-colors cursor-pointer ${darkMode ? 'text-white/50 hover:text-white/70' : 'text-black/50 hover:text-black/70'}`}
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Reminder */}
      <div className="fixed bottom-6 right-6 z-30 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className={`flex items-center gap-3 px-4 h-12 rounded-2xl backdrop-blur-xl border shadow-2xl ${
            darkMode ? 'bg-[#0a0e1a]/90 border-white/10 shadow-black/50' : 'bg-white/90 border-black/10 shadow-black/10'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[12px] font-medium leading-tight">Bedtime in 45 min</div>
            <div className={`text-[11px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Wind down now for best sleep</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}