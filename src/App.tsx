import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shuffle, ArrowUpRight, Bookmark, Play, X, Clock, FileText, Volume2, Image as ImageIcon, Type, Menu, ArrowLeft, ExternalLink, Quote } from 'lucide-react'

// Types
type ArchiveItem = {
  id: string
  title: string
  author: string
  year: string
  movement: string
  form: string
  excerpt: string
  recoveredFrom: string
  lang: string
  pages: number
  transcription: string
  color: string
  status: 'scanned' | 'transcribed' | 'audio' | 'partial'
}

type Essay = {
  id: string
  title: string
  author: string
  date: string
  read: string
  kicker: string
  excerpt: string
  linkedIds: string[]
  content: string[]
  pullquote: string
}

const ARCHIVE: ArchiveItem[] = [
  {
    id: "LOY-30",
    title: "Aphorisms on Futurism / Draft for Total Poetry",
    author: "Mina Loy",
    year: "1923-30",
    movement: "Modernism",
    form: "Manifesto",
    excerpt: "No more stanzas. The poem must be a corridor through which the body passes without permission.",
    recoveredFrom: "Unmarked envelope, Bowery estate sale, Box 7 — 2023",
    lang: "EN",
    pages: 4,
    transcription: `FUTURISM IS A SURFACE\nFuturism has taken its hat off — there is nothing inside.\n\nI propose a Total Poetry:\n1. In which the word fails\n2. In which the white space is not silence but a held breath\n3. In which woman is not subject but verb\n\nTo be unreadable is not to be unwritten. It is to be waiting for a different eye.\n\n— M.L., n.d. [corrected in red ink: 1930]`,
    color: "#FFECE8",
    status: "transcribed"
  },
  {
    id: "TZARA-21",
    title: "Letter to Picabia: On Useless Newspapers",
    author: "Tristan Tzara",
    year: "1921",
    movement: "Dada",
    form: "Correspondence",
    excerpt: "We will print the newspaper backwards, so it can only be read in a mirror held to another mirror.",
    recoveredFrom: "Bibliothèque Littéraire Jacques Doucet, uncatalogued folder",
    lang: "FR / EN (t.)",
    pages: 2,
    transcription: `Cher Francis —\n\nJ'ai trouvé un journal que personne n'a lu. Il était imprimé à l'encre blanche. Nous devons faire pareil. Un journal inutile. Un journal qui refuse d'informer.\n\nSi Dada ne sert à rien, alors il réussit.\n\nTristan\n\n[Translation: I found a newspaper that no one read. It was printed in white ink. We must do the same.]`,
    color: "#E8E6FF",
    status: "scanned"
  },
  {
    id: "KHLEB-CHESS",
    title: "Chessboards of Language — Note 27",
    author: "Velimir Khlebnikov",
    year: "1919",
    movement: "Russian Futurism",
    form: "Score / Diagram",
    excerpt: "Let the consonants be black squares. Let time move like a knight: two histories forward, one sideways.",
    recoveredFrom: "RGALI Moscow, digitized 2022, file 1271",
    lang: "RU / Transliteration",
    pages: 1,
    transcription: `Bobeobi peválisya guby\nVeomí — etc.\n\n[Diagram: 8x8 grid with letters instead of pieces]\n\nLanguage is not noun. Language is direction. The word ZANGUEZI means: a god who forgets himself and becomes a throat.`,
    color: "#FFF2C5",
    status: "partial"
  },
  {
    id: "CLAUDE-CAHUN-32",
    title: "Disavowals: Unpublished Chapter, 'The Bottle'",
    author: "Claude Cahun",
    year: "1932",
    movement: "Surrealism",
    form: "Essay / Phototext",
    excerpt: "I bottled myself and labeled it: Do Not Open Until After I Have Become Someone Else.",
    recoveredFrom: "Private collection Jersey, courtesy of family",
    lang: "FR",
    pages: 6,
    transcription: `Masque sous masque à l'infini, et la bouteille au centre, vide. Je suis devenue collectionneuse de mes propres abandons.\n\n[Photo description: Cahun in sailor suit inside a glass bottle twice their size]\n\nTo write avant-garde after 1930 is to write bottled cities — whole worlds you cannot drink from.`,
    color: "#D9F0E6",
    status: "transcribed"
  },
  {
    id: "J-ROD-74",
    title: "How To Perform a Secret",
    author: "Joan Jonas / J. Rodriguez (transc.)",
    year: "1974",
    movement: "Fluxus",
    form: "Performance Score",
    excerpt: "1. Whisper something true into a paper cup. 2. Pass the cup around until it is silent again.",
    recoveredFrom: "Franklin Furnace Archive, flyer verso",
    lang: "EN",
    pages: 1,
    transcription: `FOR THREE WOMEN AND A MIRROR:\n\nAction: Each writes a letter she will never send on the inside of her forearm, then washes it off in same bowl.\nAudience: Must read the water afterwards.\nTime: Until water is still.\n\nDocument only the steam.`,
    color: "#E5E5E5",
    status: "scanned"
  },
  {
    id: "G-ZB-68",
    title: "Concrete City: Letters That Hold Weight",
    author: "Greta Z. Blum",
    year: "1968",
    movement: "Concrete Poetry",
    form: "Concrete Poem",
    excerpt: "TTTT TTTT → city skyline. The Ts hold up the sky because no one else will.",
    recoveredFrom: "U. of Iowa Special Collections, Lost Press proof",
    lang: "DE / Visual",
    pages: 3,
    transcription: `TTTTTTTTTTTT\nT          T\nT   CITY   T\nT  OF TYPE T\nTTTTTTTTTTTT\n\nAll cities are typographic. We live inside the kerning.\n\n[Note: Blum printed this with lead type she melted and re-cast herself]`,
    color: "#FFD9CE",
    status: "partial"
  },
  {
    id: "BB-42-SOUND",
    title: "Sound Poem #9 — 'Vowel Factory Strike'",
    author: "Bob Brown",
    year: "1942",
    movement: "Sound Poetry",
    form: "Sound Text / Audio",
    excerpt: "eeeeeee ooooooo — machines refusing to say i.",
    recoveredFrom: "Brown's Readies archive, Ransom Center",
    lang: "EN / Phonic",
    pages: 1,
    transcription: `eeeeeeeeeeeeee\n            ooooooooo\n         [crank sound]\n           i i i i — STRIKE!\n\naaaaaaa—\n(machines humming low)\n\nTo be read with a sewing machine running.`,
    color: "#CBE8FF",
    status: "audio"
  },
  {
    id: "LET-58",
    title: "Isou's Marginalia on Disappearance",
    author: "Isidore Isou",
    year: "1958",
    movement: "Lettrism",
    form: "Marginalia",
    excerpt: "The letter is lonely. We must give the alphabet friends it never met.",
    recoveredFrom: "Letterist journals, Rue de Seine",
    lang: "FR",
    pages: 12,
    transcription: `Lettrie = destruction of word in favor of letter. But even letter must disappear.\n\nI am composing with dust now. [ink smudge]\n\nWhen everything is letter, nothing is legible — this is paradise.`,
    color: "#F0E0FF",
    status: "transcribed"
  },
]

const ESSAYS: Essay[] = [
  {
    id: "bc-001",
    title: "Bottled Cities: Why We Keep What No One Wanted",
    author: "Cass R.",
    date: "DEC 12, 2024",
    read: "11 MIN",
    kicker: "ORIGIN / ISSUE 01",
    excerpt: "Every avant-garde archive is a city in a bottle. You can see it, you can shake it, but you can't live there — until you open it.",
    linkedIds: ["CLAUDE-CAHUN-32", "LOY-30"],
    pullquote: "The archive is not about saving the past. It's about proving the future had already been tried.",
    content: [
      "UbuWeb taught us that scarcity was artificial. That the most radical film you had only heard about in a footnote was, in fact, one right-click away — a 240p RealPlayer file that changed your life in a dorm room at 2:17 AM.",
      "UbuWeb also taught us that interface is ideology. Its endless blue hyperlinks, its rejection of search, its beautiful hostility — it was a monument built like the works it hosted: unsearchable on purpose, anti-friendly as politics.",
      "Undersung is not a replacement. It's a reading room built next door. My grandmother kept bottles — actual glass bottles — with folded paper cities inside. When you held them to light, you could see streets. She never explained them. That is Bottled Cities: worlds that fit in containers but refuse to be contained.",
      "What we do here: we recover the writing that was too small, too strange, too female, too non-English, too handmade to be canonized even by the anti-canon. We clean the scans, we transcribe the crumbling mimeographs, we argue with them.",
      "For example, Mina Loy's 'Total Poetry' was never published. It was found stapled to a rent receipt. It argues that white space is not absence but a held breath. Reading it, you understand that most modernism is still holding its breath.",
      "Claude Cahun's deleted chapter — about bottling herself — is only six pages. But it contains the whole thesis of this site: avant-garde is not destruction. It's preservation in an impossible form."
    ]
  },
  {
    id: "bc-002",
    title: "The Mimeograph as a Lover",
    author: "Cass R. & Jun Lee",
    date: "NOV 28, 2024",
    read: "8 MIN",
    kicker: "TECHNOLOGY / METHOD",
    excerpt: "How a cheap copying machine made more poetry than every small press combined — and why it smudged on purpose.",
    linkedIds: ["G-ZB-68", "J-ROD-74"],
    pullquote: "The mimeo didn't copy. It interpreted. Every streak was an editorial decision.",
    content: [
      "If you have ever touched a mimeograph, you have touched the true avant-garde. Not a manifesto, but a drum full of ink that stained your hands for days.",
      "The mimeograph was invented for bureaucracy. Poets stole it. In the 1960s, a mimeo machine in a basement on East 10th Street could produce 300 copies of something that would be discarded by 1970 and collected by Yale by 1990. This is the lifecycle we archive.",
      "Greta Blum melted her own type. Joan Jonas told people to read water. Both understood that reproduction is performance. When you scan these at 300 dpi, you kill the mimeo. We try to scan the failure instead.",
    ]
  },
  {
    id: "bc-003",
    title: "How to Read a Letter That Was Never Sent",
    author: "Ayo M.",
    date: "NOV 04, 2024",
    read: "6 MIN",
    kicker: "READING LIST",
    excerpt: "Correspondence is the great unpublished genre. Tzara, Cahun, Loy — they wrote better in postscripts.",
    linkedIds: ["TZARA-21", "BB-42-SOUND"],
    pullquote: "Letters are drafts for people.",
    content: [
      "Tzara writing to Picabia about white ink — this is not a letter, it's a press release for an invisible newspaper. That is correspondence's secret: it's always trying to become something else.",
      "We have 43 unpublished letters. The best one is three words long. It just says: 'Don't archive this.' We archived it."
    ]
  },
  {
    id: "bc-004",
    title: "Zangezi's Throat: Khlebnikov Online",
    author: "Sofia K.",
    date: "OCT 19, 2024",
    read: "9 MIN",
    kicker: "TRANSLATION",
    excerpt: "Translating Khlebnikov is like bottling smoke. This is how we failed openly.",
    linkedIds: ["KHLEB-CHESS", "LET-58"],
    pullquote: "Zaum is not nonsense. It's sense that hasn't found a body yet.",
    content: [
      "Zaum — transrational language — is usually translated as gibberish. It's not. It's a language that refuses to be your houseguest. It wants its own apartment.",
      "Khlebnikov's chessboard where consonants are pieces — we built a playable version. It doesn't work. That's why we kept it."
    ]
  }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<'archive' | 'bottled' | 'index' | 'about'>('archive')
  const [query, setQuery] = useState('')
  const [filterMovement, setFilterMovement] = useState<string>('All')
  const [filterForm, setFilterForm] = useState<string>('All')
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null)
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [saved, setSaved] = useState<string[]>([])

  // Derived
  const movements = useMemo(() => ['All', ...Array.from(new Set(ARCHIVE.map(a => a.movement)))], [])
  const forms = useMemo(() => ['All', ...Array.from(new Set(ARCHIVE.map(a => a.form)))], [])

  const filteredArchive = useMemo(() => {
    return ARCHIVE.filter(item => {
      const matchesQ = !query || `${item.title} ${item.author} ${item.excerpt} ${item.movement}`.toLowerCase().includes(query.toLowerCase())
      const matchesMov = filterMovement === 'All' || item.movement === filterMovement
      const matchesForm = filterForm === 'All' || item.form === filterForm
      return matchesQ && matchesMov && matchesForm
    })
  }, [query, filterMovement, filterForm])

  const filteredEssays = useMemo(() => {
    if (!query) return ESSAYS
    return ESSAYS.filter(e => `${e.title} ${e.excerpt} ${e.author}`.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const toggleSave = (id: string) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const randomShuffle = () => {
    const r = ARCHIVE[Math.floor(Math.random() * ARCHIVE.length)]
    setSelectedArchive(r)
  }

  // keyboard close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSelectedArchive(null); setSelectedEssay(null) } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div className="min-h-screen bg-[#FFFCF3] text-[#11110F] selection:bg-[#FF3B1F] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,700&family=Geist+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,300&display=swap');
        h1,h2,h3,.display{font-family:"Fraunces", Georgia, serif}
        .mono{font-family:"Geist Mono", monospace}
        .body{font-family:"Newsreader", Georgia, serif}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#11110F20;border-radius:10px}
      `}</style>

      {/* Top announcement ticker */}
      <div className="w-full bg-[#11110F] text-[#FFFCF3] mono text-[10px] tracking-[0.15em] py-1.5 px-4 flex justify-between uppercase">
        <span>EST. 2025 — RECOVERED WRITING, RECOVERED USING — A FRIENDLIER UBUWEB</span>
        <span className="hidden md:flex gap-6">
          <span>↳ 247 ITEMS CATALOGUED</span>
          <span>↳ BOTTLED CITIES SUBSTACK →</span>
          <span className="w-2 h-2 bg-[#FF3B1F] rounded-full inline-block self-center animate-pulse"/>
        </span>
      </div>

      {/* Masthead */}
      <header className="sticky top-0 z-40 bg-[#FFFCF3]/90 backdrop-blur-xl border-b border-[#11110F]/15">
        <div className="max-w-[1680px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <button onClick={()=>{setActiveTab('archive'); setSelectedArchive(null)}} className="display flex items-baseline gap-2 leading-none">
              <span className="text-[28px] md:text-[34px] font-[700] tracking-[-0.04em]">UNDERSUNG</span>
              <span className="hidden md:inline text-[11px] mono border border-[#11110F] rounded-full px-2 py-0.5 translate-y-[-4px]">ARCHIVE v1</span>
            </button>

            <nav className="hidden lg:flex items-center gap-1 mono text-[12px]">
              {[
                {k:'archive', l:'ARCHIVE'},
                {k:'bottled', l:'BOTTLED CITIES'},
                {k:'index', l:'INDEX'},
                {k:'about', l:'ABOUT'}
              ].map(tab=>(
                <button key={tab.k} onClick={()=>setActiveTab(tab.k as any)}
                  className={`px-3 py-1.5 rounded-full border transition-all ${activeTab===tab.k ? 'bg-[#11110F] text-white border-[#11110F]' : 'border-transparent hover:border-[#11110F]/20 hover:bg-white'}`}>
                  {tab.l}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 opacity-40"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH TITLE, AUTHOR, MOVEMENT…"
                className="mono text-[11px] bg-white border border-[#11110F]/20 rounded-full pl-9 pr-4 py-2 w-[300px] focus:outline-none focus:border-[#11110F] placeholder:opacity-40"/>
              {query && <button onClick={()=>setQuery('')} className="absolute right-3"><X className="w-3.5 h-3.5"/></button>}
            </div>
            <button onClick={randomShuffle} className="mono hidden md:inline-flex items-center gap-2 border border-[#11110F] rounded-full px-4 py-2 text-[11px] hover:bg-[#11110F] hover:text-white transition-colors">
              <Shuffle className="w-3 h-3"/> RANDOM FIND
            </button>
            <button onClick={()=>setShowFilters(!showFilters)} className="lg:hidden p-2 border border-[#11110F]/20 rounded-full"><Menu className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden flex gap-2 px-4 pb-3 overflow-auto mono text-[11px]">
          {['archive','bottled','index','about'].map(k=>(
            <button key={k} onClick={()=>setActiveTab(k as any)} className={`shrink-0 px-3 py-1 rounded-full border uppercase ${activeTab===k ? 'bg-[#11110F] text-white' : 'bg-white border-[#11110F]/10'}`}>{k}</button>
          ))}
          <div className="relative ml-auto flex items-center">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH…" className="mono text-[11px] bg-white border border-[#11110F]/20 rounded-full pl-7 pr-3 py-1 w-[120px]"/>
            <Search className="absolute left-2 w-3 h-3 opacity-40"/>
          </div>
        </div>
      </header>

      <main className="max-w-[1680px] mx-auto px-4 md:px-8">
        {/* ARCHIVE VIEW */}
        {activeTab==='archive' && (
          <div className="py-6 md:py-10">
            {/* Hero */}
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 border border-[#11110F] mb-8">
              <div className="p-6 md:p-10">
                <div className="mono text-[10px] tracking-widest uppercase flex gap-3 mb-6">
                  <span className="bg-[#FF3B1F] text-white px-2 py-0.5 rounded-full">NEW RECOVERY</span>
                  <span className="opacity-60">TUESDAY — MIMEOGRAPH SCAN BATCH #14</span>
                </div>
                <h1 className="display text-[46px] md:text-[76px] leading-[0.9] tracking-[-0.05em] mb-6">
                  A repository of<br/>
                  <span className="italic font-light">recovered</span> writing<br/>
                  for a friendlier<br/>UbuWeb.
                </h1>
                <p className="body text-[18px] md:text-[20px] leading-[1.3] max-w-[56ch] opacity-80">
                  We collect the unwritten, the unkept, the typed twice and then lost. Avant-garde poetry that never made the anthology because someone spilled coffee on it in 1967. Then we put it somewhere you can actually read it.
                </p>
                <div className="flex flex-wrap gap-3 mt-8 mono text-[11px]">
                  <span className="border border-[#11110F] rounded-full px-3 py-1">247 DOCUMENTS</span>
                  <span className="border border-[#11110F] rounded-full px-3 py-1">19 MOVEMENTS</span>
                  <span className="border border-[#11110F] rounded-full px-3 py-1">OPEN FORMAT • NO LOGIN</span>
                </div>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-[#11110F] bg-white p-4 grid grid-cols-1">
                <div className="border border-dashed border-[#11110F]/30 p-4 md:p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between mono text-[10px] uppercase mb-4"><span>FEATURED SCAN</span><span>LOY-30 / BOX 7</span></div>
                    <div className="bg-[#FFECE8] p-6 min-h-[260px] shadow-[8px_8px_0px_#11110F] rotate-[0.5deg] font-mono text-[12px] leading-[1.4] whitespace-pre-wrap">
{ARCHIVE[0].transcription.slice(0,280)}...
                    </div>
                  </div>
                  <button onClick={()=>setSelectedArchive(ARCHIVE[0])} className="mt-6 w-full mono text-[11px] border border-[#11110F] bg-[#11110F] text-white py-2.5 flex justify-center items-center gap-2">OPEN DOCUMENT <ArrowUpRight className="w-3 h-3"/></button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 items-center justify-between border-b border-[#11110F]/10 pb-4 mb-6">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="mono text-[11px] opacity-60">FILTER:</span>
                <select value={filterMovement} onChange={e=>setFilterMovement(e.target.value)} className="mono text-[11px] border border-[#11110F]/15 rounded-full px-3 py-1 bg-white">
                  {movements.map(m=><option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
                <select value={filterForm} onChange={e=>setFilterForm(e.target.value)} className="mono text-[11px] border border-[#11110F]/15 rounded-full px-3 py-1 bg-white">
                  {forms.map(f=><option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
                {(filterMovement!=='All' || filterForm!=='All') && <button onClick={()=>{setFilterMovement('All'); setFilterForm('All')}} className="mono text-[10px] underline">CLEAR</button>}
              </div>
              <div className="mono text-[11px] opacity-60">{filteredArchive.length} ITEMS</div>
            </div>

            {/* Archive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#11110F] border border-[#11110F]">
              {filteredArchive.map(item=>(
                <motion.button key={item.id} layout initial={{opacity:0}} animate={{opacity:1}}
                  onClick={()=>setSelectedArchive(item)}
                  className="group text-left bg-[#FFFCF3] hover:bg-white p-5 md:p-6 flex flex-col justify-between min-h-[300px] transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                        <span className="mono text-[10px] border border-[#11110F]/20 rounded-full px-2 py-0.5">{item.movement.toUpperCase()}</span>
                        <span className="mono text-[10px] border border-[#11110F]/20 rounded-full px-2 py-0.5">{item.form.toUpperCase()}</span>
                      </div>
                      <span className="mono text-[10px] opacity-40">{item.id}</span>
                    </div>
                    <h3 className="display text-[24px] leading-[0.95] tracking-[-0.03em] group-hover:underline decoration-[1.5px] underline-offset-4">{item.title}</h3>
                    <div className="mono text-[11px] mt-2 flex gap-2 opacity-70"><span>{item.author.toUpperCase()}</span><span>•</span><span>{item.year}</span><span className="ml-auto flex items-center gap-1">{item.status==='audio' ? <Volume2 className="w-3 h-3"/> : item.status==='scanned' ? <ImageIcon className="w-3 h-3"/> : <Type className="w-3 h-3"/>} {item.status}</span></div>
                  </div>
                  <div className="mt-8">
                    <p className="body text-[15px] leading-[1.35] italic opacity-80">"{item.excerpt}"</p>
                    <div className="mono text-[10px] mt-4 opacity-50 leading-[1.3]">↳ RECOVERED: {item.recoveredFrom}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="mono text-[11px] border border-[#11110F] rounded-full px-3 py-1 group-hover:bg-[#11110F] group-hover:text-white transition-colors inline-flex items-center gap-1">READ <ArrowUpRight className="w-3 h-3"/></span>
                      <button onClick={(e)=>{e.stopPropagation(); toggleSave(item.id)}} className={`p-1.5 rounded-full border ${saved.includes(item.id) ? 'bg-[#11110F] text-white border-[#11110F]' : 'border-[#11110F]/15'}`}><Bookmark className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTLED CITIES */}
        {activeTab==='bottled' && (
          <div className="py-6 md:py-10">
            <div className="flex flex-col md:flex-row justify-between gap-6 border border-[#11110F] bg-[#11110F] text-[#FFFCF3] p-6 md:p-10 mb-8">
              <div>
                <h2 className="display text-[56px] md:text-[86px] leading-[0.85] tracking-[-0.05em]">BOTTLED<br/><span className="italic font-light">CITIES</span></h2>
                <div className="mono text-[11px] tracking-widest mt-4 opacity-70">ORIGINAL COMMENTARY / SUBSTACK • UNDERSUNG EDITORIAL</div>
              </div>
              <div className="max-w-[48ch]">
                <p className="body text-[18px] leading-[1.35] opacity-80">Original writing from inside the archive. Not academic, not nostalgic — close readings, failed translations, memos from the reading room. Published here first, then to Substack. Each essay is bottled with links back into the archive.</p>
                <button onClick={()=>window.open('#','_blank')} className="mt-6 mono text-[11px] border border-[#FFFCF3]/30 rounded-full px-4 py-2 hover:bg-[#FFFCF3] hover:text-[#11110F] transition-colors inline-flex items-center gap-2">SUBSCRIBE ON SUBSTACK <ExternalLink className="w-3 h-3"/></button>
              </div>
            </div>

            <div className="grid md:grid-cols-[1.6fr_0.9fr] gap-[1px] bg-[#11110F] border border-[#11110F]">
              {/* Featured essay */}
              <button onClick={()=>setSelectedEssay(filteredEssays[0])} className="bg-white p-6 md:p-10 text-left group">
                <div className="mono text-[10px] flex gap-2 mb-6"><span className="bg-[#FF3B1F] text-white px-2 py-0.5 rounded-full">{filteredEssays[0]?.kicker}</span><span className="opacity-60">{filteredEssays[0]?.date} • {filteredEssays[0]?.read} READ</span></div>
                <h3 className="display text-[36px] md:text-[48px] leading-[0.9] tracking-[-0.04em] group-hover:underline decoration-2 underline-offset-4">{filteredEssays[0]?.title}</h3>
                <p className="body text-[18px] leading-[1.35] mt-4 max-w-[60ch] opacity-75">{filteredEssays[0]?.excerpt}</p>
                <div className="mt-8 flex items-center gap-2 mono text-[11px]"><div className="w-6 h-6 rounded-full bg-[#11110F] text-white grid place-items-center">C</div>{filteredEssays[0]?.author.toUpperCase()}</div>
                <div className="mt-8 border-l-2 border-[#FF3B1F] pl-4">
                  <p className="display italic text-[20px] leading-[1.2]">"{filteredEssays[0]?.pullquote}"</p>
                </div>
                <div className="mt-8 flex gap-2 flex-wrap">
                  {filteredEssays[0]?.linkedIds.map(id=><span key={id} className="mono text-[10px] border border-[#11110F]/15 rounded-full px-2 py-0.5">↳ {id}</span>)}
                </div>
              </button>

              {/* List */}
              <div className="bg-[#FFFCF3] grid">
                {filteredEssays.slice(1).map(essay=>(
                  <button key={essay.id} onClick={()=>setSelectedEssay(essay)} className="text-left p-6 border-b border-[#11110F]/10 last:border-0 hover:bg-white group">
                    <div className="mono text-[10px] flex justify-between mb-2 opacity-60"><span>{essay.kicker}</span><span>{essay.date}</span></div>
                    <h4 className="display text-[21px] leading-[1] group-hover:underline">{essay.title}</h4>
                    <p className="body text-[14px] leading-[1.3] mt-2 opacity-70 line-clamp-2">{essay.excerpt}</p>
                    <div className="mono text-[10px] mt-4 flex gap-2">{essay.linkedIds.map(l=><span key={l} className="px-2 py-0.5 rounded-full bg-[#11110F]/05">↳ {l}</span>)}</div>
                  </button>
                ))}
                <div className="p-6 mono text-[11px] bg-[#11110F] text-[#FFFCF3]">
                  <div className="opacity-60 mb-3">ABOUT BOTTLED CITIES</div>
                  <div className="body text-[14px] leading-[1.4] normal-case">Each essay starts with a physical object on the reading table. We don't write about ideas — we write about paper that smells like mildew and still has a paperclip mark.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INDEX - UbuWeb-like but friendly */}
        {activeTab==='index' && (
          <div className="py-10 grid md:grid-cols-[260px_1fr] gap-8">
            <div className="mono text-[11px] leading-[1.8] sticky top-[88px] self-start">
              <div className="font-[600] mb-2 tracking-widest">JUMP TO</div>
              <div className="flex md:flex-col flex-wrap gap-1">
                {movements.filter(m=>m!=='All').map(m=><button key={m} onClick={()=>{setActiveTab('archive'); setFilterMovement(m)}} className="text-left hover:underline">— {m.toUpperCase()} ({ARCHIVE.filter(a=>a.movement===m).length})</button>)}
              </div>
              <div className="mt-8 border-t border-[#11110F]/10 pt-4 opacity-60">Classic UbuWeb listing was alphabetical and unsearchable on purpose. This is alphabetical and searchable because we like you.</div>
            </div>
            <div className="body">
              <div className="flex items-baseline gap-4 mb-8"><h2 className="display text-[48px] leading-none">Index</h2><span className="mono text-[11px] opacity-60">A–Z / {ARCHIVE.length} entries</span></div>
              <div className="border border-[#11110F] divide-y divide-[#11110F]/10">
                {[...filteredArchive].sort((a,b)=>a.author.localeCompare(b.author)).map(item=>(
                  <button key={item.id} onClick={()=>setSelectedArchive(item)} className="w-full flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 p-3 text-left hover:bg-white mono text-[12px]">
                    <span className="font-[600] min-w-[160px]">{item.author.toUpperCase()}</span>
                    <span className="body italic text-[14px]">{item.title}</span>
                    <span className="ml-auto opacity-40 hidden md:inline">{item.year} • {item.id} • {item.form}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeTab==='about' && (
          <div className="py-10 max-w-[1100px]">
            <h2 className="display text-[64px] leading-[0.85] mb-10 tracking-[-0.05em]">We built<br/>a reading<br/>room.</h2>
            <div className="grid md:grid-cols-2 gap-10 body text-[18px] leading-[1.45]">
              <div className="space-y-6">
                <p><span className="font-[600]">Undersung</span> started because UbuWeb is perfect and imperfect in equal measure. Perfect because it exists. Imperfect because it looks like it was built to be slightly difficult — like the art it holds — and after 30 years, difficulty is no longer the point. Access is.</p>
                <p>We are a small group: an archivist, a poet who learned to scan, and a designer who still buys paper. We do not own these documents. Most were rescued from estate sales, uncatalogued boxes at libraries that agreed to let us photograph before deaccession, and one suitcase left in a laundromat on Canal Street (true).</p>
                <p className="border-l-2 border-[#11110F] pl-4 italic">All texts here are believed to be public domain or shared under fair use for scholarly commentary. If you are the rights holder for something you want removed or correctly attributed, write to us — we will answer faster than an institution would.</p>
              </div>
              <div className="space-y-6">
                <div className="bg-[#11110F] text-[#FFFCF3] p-6 mono text-[11px] leading-[1.6]">
                  <div className="opacity-60 mb-4">COLOPHON / METHOD</div>
                  — Scanned at 600 dpi on Epson V850<br/>
                  — Transcribed by hand (no OCR for handwriting)<br/>
                  — Paper texture preserved, not cleaned<br/>
                  — Every item links to provenance<br/>
                  — Bottled Cities originals fund the scanning<br/>
                  — Built with type: Fraunces, Newsreader, Geist Mono<br/>
                  — No trackers. No ads. One orange dot.
                </div>
                <div className="border border-[#11110F] p-6">
                  <div className="display text-[24px] leading-none mb-3">Bottled Cities / Substack</div>
                  <p className="text-[15px]">The writing that houses the archive. Short essays, reading lists, translation diaries. Every post starts with a physical handling: "Today I unfolded..." If Undersung is the shelf, Bottled Cities is the hand that touches the shelf.</p>
                  <button className="mt-4 mono text-[11px] border border-[#11110F] rounded-full px-4 py-2 w-full">SUBSCRIBE → bottledcities.substack.com</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Archive Reader Overlay */}
      <AnimatePresence>
        {selectedArchive && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] flex">
            <div className="absolute inset-0 bg-[#11110F]/40 backdrop-blur-[2px]" onClick={()=>setSelectedArchive(null)}/>
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring', damping:28, stiffness:260}} className="relative ml-auto w-full max-w-[1320px] bg-[#FFFCF3] border-l border-[#11110F] h-full overflow-auto flex flex-col">
              {/* reader header */}
              <div className="sticky top-0 z-10 bg-[#FFFCF3] border-b border-[#11110F] px-6 md:px-10 py-4 flex items-center justify-between">
                <button onClick={()=>setSelectedArchive(null)} className="mono text-[11px] flex items-center gap-2 border border-[#11110F]/20 rounded-full px-3 py-1.5 hover:bg-[#11110F] hover:text-white"><ArrowLeft className="w-3.5 h-3.5"/> BACK TO ARCHIVE</button>
                <div className="flex items-center gap-2 mono text-[11px]">
                  <span className="opacity-60 hidden md:inline">{selectedArchive.id} • {selectedArchive.pages} PGS • {selectedArchive.lang}</span>
                  <button onClick={()=>toggleSave(selectedArchive.id)} className={`p-2 rounded-full border ${saved.includes(selectedArchive.id) ? 'bg-[#11110F] text-white' : 'border-[#11110F]/20'}`}><Bookmark className="w-4 h-4"/></button>
                  <button onClick={()=>setSelectedArchive(null)} className="p-2 rounded-full border border-[#11110F]/20"><X className="w-4 h-4"/></button>
                </div>
              </div>

              <div className="grid md:grid-cols-[1.15fr_0.85fr] flex-1 min-h-0">
                {/* Scan */}
                <div className="bg-[#11110F]/[0.02] p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#11110F]/10">
                  <div className="flex justify-between mono text-[10px] mb-4"><span>ORIGINAL ARTIFACT — SIMULATED SCAN</span><span>{selectedArchive.recoveredFrom.slice(0,40)}</span></div>
                  <div className="relative bg-white border border-[#11110F] shadow-[12px_12px_0px_#11110F] p-8 md:p-12 min-h-[680px] overflow-hidden">
                    {/* paper texture */}
                    <div className="absolute inset-0 opacity-[0.035]" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}/>
                    <div className="relative">
                      <div className="flex justify-between mono text-[10px] opacity-40 mb-8"><span>MS. {selectedArchive.id}</span><span>P. 1 / {selectedArchive.pages}</span></div>
                      <div className="font-mono text-[13px] leading-[1.45] whitespace-pre-wrap">{selectedArchive.transcription}</div>
                      <div className="mt-12 flex gap-2">
                        <div className="w-12 h-8 border border-dashed border-[#11110F]/30 grid place-items-center mono text-[8px]">STAMP: UNREAD</div>
                        <div className="w-16 h-8 bg-[#FF3B1F]/10 border border-[#FF3B1F]/20 grid place-items-center mono text-[8px] text-[#FF3B1F]">RETRIEVED 2023</div>
                      </div>
                    </div>
                    {selectedArchive.status==='audio' && (
                      <div className="absolute bottom-6 left-6 right-6 border border-[#11110F] bg-[#FFFCF3] p-3 flex items-center gap-3 mono text-[11px]">
                        <button className="w-8 h-8 rounded-full bg-[#11110F] text-white grid place-items-center"><Play className="w-4 h-4 ml-0.5"/></button>
                        <div className="flex-1"><div className="h-[2px] bg-[#11110F]/20 relative"><div className="absolute left-0 top-0 h-full w-[33%] bg-[#FF3B1F]"/></div><div className="flex justify-between mt-1 opacity-60 text-[10px]"><span>0:42 / 2:14</span><span>BOB BROWN — VOWEL FACTORY</span></div></div>
                        <Volume2 className="w-4 h-4"/>
                      </div>
                    )}
                  </div>
                  <div className="mono text-[10px] mt-4 opacity-50">This simulation preserves original stains, paperclip rust, and marginal coffee rings. High-res TIFF available on request.</div>
                </div>

                {/* Transcription + commentary */}
                <div className="p-6 md:p-10 flex flex-col">
                  <div className="mb-8">
                    <div className="flex gap-2 mb-4 flex-wrap"><span className="mono text-[10px] bg-[#11110F] text-white px-2 py-0.5 rounded-full">{selectedArchive.movement}</span><span className="mono text-[10px] border border-[#11110F]/20 px-2 py-0.5 rounded-full">{selectedArchive.form}</span></div>
                    <h2 className="display text-[34px] md:text-[40px] leading-[0.9] tracking-[-0.03em] mb-3">{selectedArchive.title}</h2>
                    <div className="mono text-[12px] opacity-60">{selectedArchive.author} — {selectedArchive.year}</div>
                  </div>

                  <div className="body text-[17px] leading-[1.5] space-y-4">
                    <p className="italic opacity-70 border-l-2 border-[#FF3B1F] pl-4">"{selectedArchive.excerpt}"</p>
                    <p>Archival note on recovery: {selectedArchive.recoveredFrom}. The document arrived folded in thirds. The third fold had broken the paper, so we hinged it with Japanese tissue.</p>
                    <p>What matters here is not only what {selectedArchive.author.split(' ')[0]} wrote, but the way the syntax refuses to settle. This is writing that was never intended for publication — and therefore never learned to be polite.</p>
                    <p className="mono text-[11px] bg-[#11110F]/5 p-4 rounded leading-[1.5]"><span className="font-[600]">CURATORIAL POS.</span> We read this against {selectedArchive.movement.toLowerCase()} not as a style but as an administrative problem: how do you file something that refuses a folder? UbuWeb's answer was: you don't. You list it. Our answer is: you give it two places — the scan and the transcription — and let the reader feel the gap.</p>
                  </div>

                  <div className="mt-auto pt-10">
                    <div className="mono text-[11px] tracking-widest mb-3 opacity-60">LINKED IN BOTTLED CITIES</div>
                    <div className="space-y-2">
                      {ESSAYS.filter(e=>e.linkedIds.includes(selectedArchive.id)).map(e=>(
                        <button key={e.id} onClick={()=>{setSelectedArchive(null); setTimeout(()=>setSelectedEssay(e), 200)}} className="w-full text-left border border-[#11110F] p-3 mono text-[11px] hover:bg-[#11110F] hover:text-white transition-colors flex justify-between items-center">
                          <span>{e.title.toUpperCase()}</span><ArrowUpRight className="w-3 h-3"/>
                        </button>
                      ))}
                      {ESSAYS.filter(e=>e.linkedIds.includes(selectedArchive.id)).length===0 && <div className="mono text-[11px] opacity-40">No linked commentary yet — be first to write one.</div>}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2 mono text-[10px]">
                      <button className="border border-[#11110F]/15 rounded-full py-2 flex justify-center items-center gap-1"><FileText className="w-3 h-3"/> DOWNLOAD PDF</button>
                      <button className="border border-[#11110F]/15 rounded-full py-2 flex justify-center items-center gap-1"><Clock className="w-3 h-3"/> CITE THIS • {selectedArchive.id}</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Essay Reader */}
      <AnimatePresence>
        {selectedEssay && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] flex">
            <div className="absolute inset-0 bg-[#11110F]/50 backdrop-blur-sm" onClick={()=>setSelectedEssay(null)}/>
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring', damping:32, stiffness:300}} className="relative mt-auto w-full bg-[#FFFCF3] border-t border-[#11110F] max-h-[92vh] overflow-auto">
              <div className="sticky top-0 bg-[#FFFCF3] border-b border-[#11110F]/10 px-6 md:px-10 py-3 flex items-center justify-between z-10">
                <button onClick={()=>setSelectedEssay(null)} className="mono text-[11px] flex items-center gap-2 border rounded-full px-3 py-1.5"><ArrowLeft className="w-3 h-3"/> CLOSE</button>
                <span className="mono text-[10px] opacity-60 hidden md:inline">BOTTLED CITIES • ORIGINAL • {selectedEssay.date}</span>
                <button onClick={()=>setSelectedEssay(null)} className="p-2"><X className="w-4 h-4"/></button>
              </div>
              <div className="max-w-[780px] mx-auto px-6 md:px-10 py-10 md:py-16">
                <div className="mono text-[11px] flex gap-3 mb-6"><span className="bg-[#11110F] text-white px-2 py-0.5 rounded-full">{selectedEssay.kicker}</span><span className="opacity-60">{selectedEssay.read}</span></div>
                <h1 className="display text-[44px] md:text-[56px] leading-[0.9] tracking-[-0.04em] mb-6">{selectedEssay.title}</h1>
                <div className="flex items-center gap-3 mb-10 border-y border-[#11110F]/10 py-4">
                  <div className="w-9 h-9 rounded-full bg-[#11110F] text-white grid place-items-center mono text-[12px]">{selectedEssay.author[0]}</div>
                  <div className="mono text-[11px] leading-[1.2]"><div className="font-[600]">{selectedEssay.author.toUpperCase()}</div><div className="opacity-60">{selectedEssay.date}</div></div>
                  <button className="ml-auto mono text-[11px] border border-[#11110F] rounded-full px-4 py-1.5">SHARE</button>
                </div>

                <div className="body text-[19px] leading-[1.55] space-y-6">
                  <p className="text-[21px] leading-[1.35] opacity-80">{selectedEssay.excerpt}</p>
                  {selectedEssay.content.map((para,i)=>(
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="my-12 border-l-[3px] border-[#FF3B1F] pl-6 py-2">
                  <Quote className="w-5 h-5 mb-3 opacity-30"/>
                  <p className="display italic text-[22px] leading-[1.25]">{selectedEssay.pullquote}</p>
                </div>

                <div className="mt-12 bg-white border border-[#11110F] p-6">
                  <div className="mono text-[11px] tracking-widest mb-4">DOCUMENTS REFERENCED IN THIS ESSAY</div>
                  <div className="grid gap-2">
                    {selectedEssay.linkedIds.map(id=>{
                      const doc = ARCHIVE.find(a=>a.id===id)
                      if(!doc) return null
                      return <button key={id} onClick={()=>{setSelectedEssay(null); setTimeout(()=>setSelectedArchive(doc), 200)}} className="text-left flex items-start gap-3 mono text-[11px] border border-[#11110F]/10 p-3 hover:bg-[#FFFCF3]"><span className="bg-[#11110F] text-white px-1.5 py-0.5 rounded text-[9px] h-fit">{doc.id}</span><span><span className="font-[600]">{doc.author}</span> — {doc.title}<span className="opacity-50 ml-2">↗ OPEN</span></span></button>
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-[#11110F] mt-12 mono text-[10px] px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between gap-4 opacity-60">
        <span>© 2025 UNDERSUNG ARCHIVE — BUILT AS A READING ROOM, NOT A VAULT • TYPESSET IN FRAUNCES + NEWSREADER + GEIST MONO</span>
        <span className="flex gap-4"><span>BOTTLED CITIES SUBSTACK</span><span>•</span><span>ARE.MAKE / A-Z</span><span>•</span><span className="text-[#FF3B1F]">● LIVE</span></span>
      </footer>
    </div>
  )
}
