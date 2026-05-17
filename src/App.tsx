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
     
