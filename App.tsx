import React, { useState, useEffect } from 'react';
import { SLIDES } from './constants';
import { SlideType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Menu, X, Volume2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

// --- AUDIO UTILS ---
const playFeedbackSound = (isCorrect: boolean) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (isCorrect) {
        // High pitch "ding"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } else {
        // Low pitch "buzz"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }
};

const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB'; // British accent for Harry Potter theme
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
};

// --- 3D SVG DEFINITIONS & FILTERS ---
// (Keeping existing definitions intact)
const SVGDefs = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <filter id="hyper-3d" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
        <feOffset in="blur" dx="6" dy="6" result="offsetBlur" />
        <feSpecularLighting in="blur" surfaceScale="10" specularConstant="1.5" specularExponent="35" lightingColor="#ffffff" result="specOut">
          <fePointLight x="-5000" y="-10000" z="20000" />
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="litPaint" />
        </feMerge>
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
      </filter>

      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="parchment-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0.2" />
      </filter>
      <pattern id="parchment-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
         <rect width="200" height="200" fill="#f3e5ab" />
         <rect width="200" height="200" filter="url(#parchment-noise)" opacity="0.1" />
      </pattern>

      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff176" />
        <stop offset="50%" stopColor="#fbc02d" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>

      <linearGradient id="magic-blue" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stopColor="#00ffff" />
         <stop offset="100%" stopColor="#2962ff" />
      </linearGradient>

      <linearGradient id="magic-purple" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stopColor="#e040fb" />
         <stop offset="100%" stopColor="#6200ea" />
      </linearGradient>

      <linearGradient id="emerald-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#69f0ae" />
          <stop offset="100%" stopColor="#00695c" />
      </linearGradient>
    </defs>
  </svg>
);

// --- 3D SCENE COMPONENTS (Reused) ---
// Simplified access for brevity, keeping all scene components logic
const SceneCrest = () => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><path d="M-180 -220 Q0 -260 180 -220 Q180 50 0 260 Q-180 50 -180 -220 Z" fill="#263238" stroke="url(#gold-grad)" strokeWidth="12" filter="url(#hyper-3d)" /><text x="0" y="25" fontSize="160" fontWeight="900" fill="url(#gold-grad)" textAnchor="middle" filter="url(#hyper-3d)" style={{ fontFamily: 'Cinzel' }}>H</text></g></svg>;
const SceneMap = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><rect x="-150" y="-200" width="300" height="400" fill="#fff9c4" stroke="#5d4037" strokeWidth="3" filter="url(#hyper-3d)" /></g></svg>;
const SceneTraining = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><rect width="800" height="600" fill="#212121" /><g transform="translate(600, 300)"><rect x="-40" y="-100" width="80" height="200" rx="20" fill="#b0bec5" filter="url(#hyper-3d)" /></g></svg>;
const SceneQuiz = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><rect x="-70" y="-130" width="140" height="260" fill="#fbc02d" opacity="0.3" filter="url(#hyper-3d)" /></g></svg>;

// Mapping visuals
const Visuals: Record<string, any> = {
    "crest": SceneCrest,
    "train_success": () => <SceneTraining variant="train_success" />,
    "train_fail": () => <SceneTraining variant="train_fail" />,
    "train_believe": () => <SceneTraining variant="train_believe" />,
    "quiz_hourglass": () => <SceneQuiz variant="quiz_hourglass" />,
    "quiz_decree": () => <SceneQuiz variant="quiz_decree" />, // Placeholder reuse
    "quiz_potion": () => <SceneQuiz variant="quiz_potion" />, // Placeholder reuse
    "map_reveal": () => <SceneMap variant="map_reveal" />,
};

// --- UI COMPONENTS ---

const NavigationMenu = ({ isOpen, onClose, onJump, currentSlideIndex }: any) => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 h-full w-80 md:w-96 bg-[#2c1e12] border-r-8 border-[#3e2723] z-50 shadow-[10px_0_30px_rgba(0,0,0,0.8)] flex flex-col">
             <div className="p-6 border-b-2 border-[#5a4632] flex justify-between items-center bg-[#1a0f0a]">
                <h2 className="text-[#ffd700] font-magic text-2xl">Training Map</h2>
                <button onClick={onClose} className="text-[#e6d28c]"><X size={28} /></button>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                {SLIDES.map((slide, index) => (
                   <button key={slide.id} onClick={() => { onJump(index); onClose(); }} className={`w-full text-left px-4 py-3 rounded-lg transition-all ${index === currentSlideIndex ? 'bg-[#3e2723] border-[#ffd700] border' : 'hover:bg-[#3e2723]/50'}`}>
                      <div className="flex justify-between"><span className="text-[#ffd700] font-bold text-xs">{slide.type}</span></div>
                      <div className="font-magic text-lg text-[#f3e5ab]">{slide.title}</div>
                   </button>
                ))}
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
);

const SlideFrame = ({ children, slideIndex, totalSlides, onNext, onPrev, onJump }: any) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="relative w-full h-screen bg-[#2c1e12] flex items-center justify-center p-4 overflow-hidden perspective-1000">
            <SVGDefs />
            <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onJump={onJump} currentSlideIndex={slideIndex} />
            <button onClick={() => setIsMenuOpen(true)} className="absolute top-6 left-6 z-50 text-[#e6d28c] bg-[#3e2723] p-3 rounded-full shadow-lg border-2 border-[#5a4632]"><Menu size={32} /></button>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f0a] to-[#0d0705] -z-20"></div>
            <motion.div className="relative w-full md:w-auto md:h-[90vh] aspect-[16/9] max-w-[95vw] max-h-[90vh] bg-[#f3e5ab] rounded-lg overflow-hidden border-[8px] md:border-[16px] border-[#3e2723] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
                <div className="absolute inset-0 pointer-events-none -z-10 w-full h-full"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#parchment-pattern)" /></svg></div>
                <div className="flex-1 relative z-0 overflow-y-auto custom-scrollbar min-h-0">{children}</div>
                <div className="h-16 md:h-24 bg-[#e6d28c] border-t-4 border-[#3e2723] flex justify-between items-center px-4 md:px-10 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                    <button onClick={onPrev} disabled={slideIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-[#3e2723] text-[#fcf5e5] rounded-xl disabled:opacity-50 font-magic font-bold text-lg"><ChevronLeft /> Prev</button>
                    <div className="font-magic text-[#2c1e12] text-xl font-bold">{slideIndex + 1} / {totalSlides}</div>
                    <button onClick={onNext} disabled={slideIndex === totalSlides - 1} className="flex items-center gap-2 px-4 py-2 bg-[#3e2723] text-[#fcf5e5] rounded-xl disabled:opacity-50 font-magic font-bold text-lg">Next <ChevronRight /></button>
                </div>
            </motion.div>
        </div>
    );
}

// --- MFP SLIDE COMPONENT ---
const MFPSlide = ({ data }: { data: any }) => {
    const VisualComponent = data.visualId ? Visuals[data.visualId] : null;

    return (
        <div className="h-full flex flex-col md:flex-row p-8 gap-8">
            {/* Left Content: Meaning & Pronunciation */}
            <div className="flex-1 flex flex-col space-y-6 overflow-y-auto custom-scrollbar">
                <div>
                    <h2 className="text-5xl font-magic text-[#2c1e12] mb-2">{data.title}</h2>
                    <h3 className="text-2xl font-body italic text-[#740001] border-b-2 border-[#740001] pb-2 inline-block">{data.subtitle}</h3>
                </div>

                {/* MEANING TRILINGUAL */}
                <div className="bg-[#fff9c4] p-4 rounded-lg border-2 border-[#fbc02d] shadow-sm">
                    <h4 className="font-bold text-[#5d4037] mb-2 text-sm uppercase tracking-wide">Meaning</h4>
                    <div className="space-y-2 font-body text-xl">
                        <div className="flex items-start gap-2"><span className="font-bold text-[#2c1e12] w-8">🇬🇧</span> <span>{data.mfp.meaning.eng}</span></div>
                        <div className="flex items-start gap-2"><span className="font-bold text-[#2c1e12] w-8">🇷🇺</span> <span>{data.mfp.meaning.rus}</span></div>
                        <div className="flex items-start gap-2"><span className="font-bold text-[#2c1e12] w-8">🇺🇿</span> <span>{data.mfp.meaning.uzb}</span></div>
                    </div>
                </div>

                {/* PRONUNCIATION */}
                <div className="flex items-center gap-4 bg-[#e1bee7] p-4 rounded-lg border-2 border-[#8e24aa] shadow-sm">
                     <button 
                        onClick={() => speakText(data.mfp.pronunciation.word)}
                        className="bg-[#8e24aa] text-white p-3 rounded-full hover:scale-110 transition-transform shadow-md"
                     >
                        <Volume2 size={24} />
                     </button>
                     <div>
                        <div className="font-magic text-3xl font-bold text-[#4a148c]">{data.mfp.pronunciation.word}</div>
                        <div className="font-mono text-lg text-[#6a1b9a]">{data.mfp.pronunciation.ipa}</div>
                     </div>
                </div>

                {/* EXAMPLES */}
                <div className="bg-[#c8e6c9] p-4 rounded-lg border-2 border-[#2e7d32] shadow-sm flex-1">
                    <h4 className="font-bold text-[#1b5e20] mb-2 text-sm uppercase tracking-wide">Usage Examples</h4>
                    <ul className="space-y-3">
                        {data.mfp.examples.map((ex: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 font-body text-xl text-[#1b5e20]">
                                <span className="mt-1.5 w-2 h-2 bg-[#2e7d32] rounded-full flex-shrink-0" />
                                {ex}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Content: Form & Visual */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 bg-[#1a0f0a] rounded-xl overflow-hidden border-4 border-[#3e2723] relative shadow-2xl">
                     {VisualComponent && <VisualComponent />}
                     <div className="absolute bottom-0 inset-x-0 bg-black/60 p-4 text-center">
                         <div className="font-mono text-2xl text-[#ffd700] font-bold tracking-wider">{data.mfp.form.formula}</div>
                     </div>
                </div>
                <div className="bg-[#bbdefb] p-4 rounded-lg border-2 border-[#1565c0] text-center">
                    <h4 className="font-bold text-[#0d47a1] text-sm uppercase tracking-wide mb-1">Form Notes</h4>
                    <p className="font-body text-xl text-[#0d47a1] font-bold">{data.mfp.form.notes}</p>
                </div>
            </div>
        </div>
    );
};

// --- SINGLE QUESTION SLIDE COMPONENT ---
const SingleQuestionSlide = ({ data }: { data: any }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const VisualComponent = data.visualId ? Visuals[data.visualId] : null;

    const handleAnswer = (index: number) => {
        if (selected !== null) return; // Prevent multiple clicks
        setSelected(index);
        const correct = index === data.quizQuestion.correctIndex;
        setIsCorrect(correct);
        playFeedbackSound(correct);
    };

    return (
        <div className="h-full flex flex-col p-8 items-center justify-center max-w-5xl mx-auto">
             <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-3xl font-magic text-[#5d4037] opacity-60">{data.title}</h2>
                <div className="w-16 h-16 bg-[#2c1e12] rounded-full border-2 border-[#ffd700] overflow-hidden">
                    {VisualComponent && <VisualComponent />}
                </div>
             </div>

             <div className="w-full bg-[#fcf5e5] p-8 rounded-xl border-4 border-[#3e2723] shadow-xl mb-8 relative">
                <h3 className="text-3xl md:text-4xl font-body font-bold text-[#2c1e12] leading-snug">
                    {data.quizQuestion.question}
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {data.quizQuestion.options.map((opt: string, idx: number) => {
                    let stateClass = "bg-white border-[#d7ccc8] hover:bg-[#efebe9]";
                    if (selected !== null) {
                        if (idx === data.quizQuestion.correctIndex) stateClass = "bg-green-100 border-green-600 text-green-900";
                        else if (idx === selected) stateClass = "bg-red-100 border-red-600 text-red-900";
                        else stateClass = "bg-gray-100 border-gray-300 opacity-50";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={selected !== null}
                            className={`p-6 text-left rounded-lg border-2 text-xl font-bold transition-all shadow-sm flex items-center justify-between ${stateClass}`}
                        >
                            <span>{opt}</span>
                            {selected !== null && idx === data.quizQuestion.correctIndex && <CheckCircle className="text-green-600" />}
                            {selected !== null && idx === selected && idx !== data.quizQuestion.correctIndex && <XCircle className="text-red-600" />}
                        </button>
                    )
                })}
             </div>

             <AnimatePresence>
                {selected !== null && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-8 p-6 rounded-lg w-full border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                    >
                        <h4 className={`font-magic text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? "Correct! 10 Points!" : "Incorrect!"}
                        </h4>
                        <p className="font-body text-xl text-gray-800">{data.quizQuestion.explanation}</p>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
    );
};

const GenericContentSlide = ({ data }: { data: any }) => (
    <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
            {data.visualId && Visuals[data.visualId] && React.createElement(Visuals[data.visualId])}
        </motion.div>
        <h1 className="text-7xl font-magic text-[#2c1e12] mb-6">{data.title}</h1>
        {data.subtitle && <h2 className="text-4xl font-body text-[#740001] italic font-bold">{data.subtitle}</h2>}
        {data.content && <p className="mt-8 text-3xl font-body font-bold text-[#5d4037]">{data.content}</p>}
    </div>
);

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  const jumpToSlide = (index: number) => setCurrentSlideIndex(index);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentSlide = SLIDES[currentSlideIndex];

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case SlideType.TITLE: return <GenericContentSlide data={currentSlide} />;
      case SlideType.MFP: return <MFPSlide data={currentSlide} />;
      case SlideType.QUIZ_SINGLE: return <SingleQuestionSlide data={currentSlide} />;
      case SlideType.END: return <GenericContentSlide data={currentSlide} />;
      default: return <div className="p-12 text-4xl">Slide type not found</div>;
    }
  };

  return (
    <SlideFrame slideIndex={currentSlideIndex} totalSlides={SLIDES.length} onNext={nextSlide} onPrev={prevSlide} onJump={jumpToSlide}>
        <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
                {renderSlideContent()}
            </motion.div>
        </AnimatePresence>
    </SlideFrame>
  );
}
