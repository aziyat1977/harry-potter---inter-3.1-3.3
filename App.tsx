import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SLIDES } from './constants';
import { SlideType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Menu, X, Volume2, CheckCircle, XCircle } from 'lucide-react';

// --- AUDIO UTILS ---
const playFeedbackSound = (isCorrect: boolean) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (isCorrect) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } else {
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
        utterance.lang = 'en-GB';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
};

// --- THE ULTRA ALGORITHM: SCREEN ADAPTATION HOOK ---
const useScreenAlgorithm = () => {
    const [layout, setLayout] = useState({
        isLandscape: true,
        scale: 1,
        rootFontSize: 16,
        containerWidth: '100%',
        containerHeight: '100%',
        mode: 'desktop' // 'desktop' | 'mobile-portrait' | 'mobile-landscape'
    });

    useLayoutEffect(() => {
        const updateLayout = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const aspect = w / h;
            const isLandscape = aspect > 1.1; // Threshold for landscape
            
            // Base resolution for calculations (Standard Laptop/Projector)
            const BASE_W = 1920;
            const BASE_H = 1080;
            
            let scale = 1;
            let rootFontSize = 16;
            let mode = 'desktop';

            if (isLandscape) {
                // LANDSCAPE ALGORITHM (Projector / Desktop / Landscape Tablet)
                // We aim to fit a 16:9 box into the viewport, or fill if it's close.
                mode = 'desktop';
                // Calculate scale to fit 1920x1080 into current window with margins
                const scaleX = w / BASE_W;
                const scaleY = h / BASE_H;
                scale = Math.min(scaleX, scaleY); 
                
                // Adjust font size based on scale to ensure readability on 4k vs Laptop
                // Base 16px at 1080p. 
                rootFontSize = 16 * (Math.max(scale, 0.5)); // Don't let it get microscopic
            } else {
                // PORTRAIT ALGORITHM (Phone / Vertical Tablet)
                mode = 'mobile-portrait';
                // In portrait, width is the constraint.
                // We scale based on width relative to a "standard" mobile width (e.g. 390px)
                const BASE_MOBILE_W = 390;
                scale = w / BASE_MOBILE_W;
                
                // Base font size for mobile
                rootFontSize = 16 * scale; 
            }

            setLayout({
                isLandscape,
                scale,
                rootFontSize,
                containerWidth: isLandscape ? `${BASE_W * scale}px` : '100%',
                containerHeight: isLandscape ? `${BASE_H * scale}px` : '100%',
                mode
            });
        };

        window.addEventListener('resize', updateLayout);
        updateLayout(); // Initial call
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    return layout;
};

// --- 3D SVG DEFINITIONS & FILTERS ---
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
const SceneCrest = () => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><path d="M-180 -220 Q0 -260 180 -220 Q180 50 0 260 Q-180 50 -180 -220 Z" fill="#263238" stroke="url(#gold-grad)" strokeWidth="12" filter="url(#hyper-3d)" /><text x="0" y="25" fontSize="160" fontWeight="900" fill="url(#gold-grad)" textAnchor="middle" filter="url(#hyper-3d)" style={{ fontFamily: 'Cinzel' }}>H</text></g></svg>;
const SceneMap = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><rect x="-150" y="-200" width="300" height="400" fill="#fff9c4" stroke="#5d4037" strokeWidth="3" filter="url(#hyper-3d)" /></g></svg>;
const SceneTraining = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><rect width="800" height="600" fill="#212121" /><g transform="translate(600, 300)"><rect x="-40" y="-100" width="80" height="200" rx="20" fill="#b0bec5" filter="url(#hyper-3d)" /></g></svg>;
const SceneQuiz = ({ variant }: any) => <svg viewBox="0 0 800 600" className="w-full h-full"><g transform="translate(400, 300)"><rect x="-70" y="-130" width="140" height="260" fill="#fbc02d" opacity="0.3" filter="url(#hyper-3d)" /></g></svg>;

const Visuals: Record<string, any> = {
    "crest": SceneCrest,
    "train_success": () => <SceneTraining variant="train_success" />,
    "train_fail": () => <SceneTraining variant="train_fail" />,
    "train_believe": () => <SceneTraining variant="train_believe" />,
    "quiz_hourglass": () => <SceneQuiz variant="quiz_hourglass" />,
    "quiz_decree": () => <SceneQuiz variant="quiz_decree" />,
    "quiz_potion": () => <SceneQuiz variant="quiz_potion" />,
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
    const { isLandscape, scale, rootFontSize, mode } = useScreenAlgorithm();

    // The container style relies on CSS variables and rems for scaling
    const containerStyle = {
        fontSize: `${rootFontSize}px`, // This propagates to all rem units
        lineHeight: 1.5,
    };

    return (
        <div 
            className="relative w-full h-screen bg-[#2c1e12] flex items-center justify-center overflow-hidden"
            style={containerStyle}
        >
            <SVGDefs />
            <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onJump={onJump} currentSlideIndex={slideIndex} />
            
            {/* Menu Button - Scaled */}
            <button 
                onClick={() => setIsMenuOpen(true)} 
                className="absolute top-[2rem] left-[2rem] z-50 text-[#e6d28c] bg-[#3e2723] p-[0.75rem] rounded-full shadow-lg border-[0.2rem] border-[#5a4632] hover:scale-110 transition-transform"
            >
                <Menu size={32} className="w-[2rem] h-[2rem]" />
            </button>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f0a] to-[#0d0705] -z-20"></div>
            
            {/* The Magic Container */}
            <motion.div 
                className={`
                    relative bg-[#f3e5ab] rounded-lg overflow-hidden border-[1rem] border-[#3e2723] flex flex-col shadow-[0_3rem_6rem_rgba(0,0,0,0.9)]
                    ${mode === 'desktop' ? 'aspect-video w-[90vw] max-h-[90vh]' : 'w-full h-full border-[0.5rem] rounded-none'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
                style={{
                    // In portrait we want full height, in landscape we fit nicely
                    maxWidth: mode === 'desktop' ? '1920px' : '100%',
                }}
            >
                <div className="absolute inset-0 pointer-events-none -z-10 w-full h-full"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#parchment-pattern)" /></svg></div>
                
                {/* Content Area - Scrollable */}
                <div className="flex-1 relative z-0 overflow-y-auto custom-scrollbar min-h-0 w-full">
                    {children}
                </div>

                {/* Footer Controls */}
                <div className="h-[5rem] bg-[#e6d28c] border-t-[0.3rem] border-[#3e2723] flex justify-between items-center px-[2rem] relative z-10 shadow-[0_-0.5rem_1.5rem_rgba(0,0,0,0.2)] shrink-0">
                    <button 
                        onClick={onPrev} 
                        disabled={slideIndex === 0} 
                        className="flex items-center gap-[0.5rem] px-[1.5rem] py-[0.75rem] bg-[#3e2723] text-[#fcf5e5] rounded-xl disabled:opacity-50 font-magic font-bold text-[1.25rem] hover:scale-105 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="w-[1.5rem] h-[1.5rem]" /> <span className="hidden sm:inline">Prev</span>
                    </button>
                    
                    <div className="font-magic text-[#2c1e12] text-[1.5rem] font-bold">{slideIndex + 1} / {totalSlides}</div>
                    
                    <button 
                        onClick={onNext} 
                        disabled={slideIndex === totalSlides - 1} 
                        className="flex items-center gap-[0.5rem] px-[1.5rem] py-[0.75rem] bg-[#3e2723] text-[#fcf5e5] rounded-xl disabled:opacity-50 font-magic font-bold text-[1.25rem] hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="hidden sm:inline">Next</span> <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// --- MFP SLIDE COMPONENT ---
const MFPSlide = ({ data }: { data: any }) => {
    const VisualComponent = data.visualId ? Visuals[data.visualId] : null;

    return (
        <div className="h-full flex flex-col md:flex-row p-[2rem] gap-[2rem]">
            {/* Left Content: Meaning & Pronunciation */}
            <div className="flex-1 flex flex-col space-y-[1.5rem] overflow-y-auto custom-scrollbar">
                <div>
                    <h2 className="text-[3rem] leading-none font-magic text-[#2c1e12] mb-[0.5rem]">{data.title}</h2>
                    <h3 className="text-[1.5rem] font-body italic text-[#740001] border-b-2 border-[#740001] pb-2 inline-block">{data.subtitle}</h3>
                </div>

                {/* MEANING TRILINGUAL */}
                <div className="bg-[#fff9c4] p-[1rem] rounded-lg border-2 border-[#fbc02d] shadow-sm">
                    <h4 className="font-bold text-[#5d4037] mb-[0.5rem] text-[0.875rem] uppercase tracking-wide">Meaning</h4>
                    <div className="space-y-[0.5rem] font-body text-[1.25rem]">
                        <div className="flex items-start gap-[0.5rem]"><span className="font-bold text-[#2c1e12] w-[2rem]">🇬🇧</span> <span>{data.mfp.meaning.eng}</span></div>
                        <div className="flex items-start gap-[0.5rem]"><span className="font-bold text-[#2c1e12] w-[2rem]">🇷🇺</span> <span>{data.mfp.meaning.rus}</span></div>
                        <div className="flex items-start gap-[0.5rem]"><span className="font-bold text-[#2c1e12] w-[2rem]">🇺🇿</span> <span>{data.mfp.meaning.uzb}</span></div>
                    </div>
                </div>

                {/* PRONUNCIATION */}
                <div className="flex items-center gap-[1rem] bg-[#e1bee7] p-[1rem] rounded-lg border-2 border-[#8e24aa] shadow-sm">
                     <button 
                        onClick={() => speakText(data.mfp.pronunciation.word)}
                        className="bg-[#8e24aa] text-white p-[0.75rem] rounded-full hover:scale-110 transition-transform shadow-md"
                     >
                        <Volume2 className="w-[1.5rem] h-[1.5rem]" />
                     </button>
                     <div>
                        <div className="font-magic text-[2rem] font-bold text-[#4a148c] leading-none">{data.mfp.pronunciation.word}</div>
                        <div className="font-mono text-[1.125rem] text-[#6a1b9a]">{data.mfp.pronunciation.ipa}</div>
                     </div>
                </div>

                {/* EXAMPLES */}
                <div className="bg-[#c8e6c9] p-[1rem] rounded-lg border-2 border-[#2e7d32] shadow-sm flex-1">
                    <h4 className="font-bold text-[#1b5e20] mb-[0.5rem] text-[0.875rem] uppercase tracking-wide">Usage Examples</h4>
                    <ul className="space-y-[0.75rem]">
                        {data.mfp.examples.map((ex: string, i: number) => (
                            <li key={i} className="flex items-start gap-[0.5rem] font-body text-[1.25rem] text-[#1b5e20]">
                                <span className="mt-[0.6rem] w-[0.5rem] h-[0.5rem] bg-[#2e7d32] rounded-full flex-shrink-0" />
                                {ex}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Content: Form & Visual */}
            <div className="flex-1 flex flex-col gap-[1.5rem] min-h-[300px] md:min-h-0">
                <div className="flex-1 bg-[#1a0f0a] rounded-xl overflow-hidden border-4 border-[#3e2723] relative shadow-2xl min-h-[200px]">
                     {VisualComponent && <VisualComponent />}
                     <div className="absolute bottom-0 inset-x-0 bg-black/60 p-[1rem] text-center">
                         <div className="font-mono text-[1.5rem] text-[#ffd700] font-bold tracking-wider">{data.mfp.form.formula}</div>
                     </div>
                </div>
                <div className="bg-[#bbdefb] p-[1rem] rounded-lg border-2 border-[#1565c0] text-center">
                    <h4 className="font-bold text-[#0d47a1] text-[0.875rem] uppercase tracking-wide mb-1">Form Notes</h4>
                    <p className="font-body text-[1.25rem] text-[#0d47a1] font-bold">{data.mfp.form.notes}</p>
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
        if (selected !== null) return; 
        setSelected(index);
        const correct = index === data.quizQuestion.correctIndex;
        setIsCorrect(correct);
        playFeedbackSound(correct);
    };

    return (
        <div className="h-full flex flex-col p-[2rem] items-center justify-center max-w-[80rem] mx-auto w-full">
             <div className="w-full flex justify-between items-center mb-[2rem]">
                <h2 className="text-[2rem] font-magic text-[#5d4037] opacity-60">{data.title}</h2>
                <div className="w-[4rem] h-[4rem] bg-[#2c1e12] rounded-full border-2 border-[#ffd700] overflow-hidden flex-shrink-0">
                    {VisualComponent && <VisualComponent />}
                </div>
             </div>

             <div className="w-full bg-[#fcf5e5] p-[2rem] rounded-xl border-4 border-[#3e2723] shadow-xl mb-[2rem] relative">
                <h3 className="text-[1.75rem] md:text-[2.25rem] font-body font-bold text-[#2c1e12] leading-snug">
                    {data.quizQuestion.question}
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem] w-full">
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
                            className={`p-[1.5rem] text-left rounded-lg border-2 text-[1.25rem] font-bold transition-all shadow-sm flex items-center justify-between ${stateClass}`}
                        >
                            <span>{opt}</span>
                            {selected !== null && idx === data.quizQuestion.correctIndex && <CheckCircle className="text-green-600 w-[1.5rem] h-[1.5rem]" />}
                            {selected !== null && idx === selected && idx !== data.quizQuestion.correctIndex && <XCircle className="text-red-600 w-[1.5rem] h-[1.5rem]" />}
                        </button>
                    )
                })}
             </div>

             <AnimatePresence>
                {selected !== null && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-[2rem] p-[1.5rem] rounded-lg w-full border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                    >
                        <h4 className={`font-magic text-[1.5rem] font-bold mb-[0.5rem] ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? "Correct! 10 Points!" : "Incorrect!"}
                        </h4>
                        <p className="font-body text-[1.25rem] text-gray-800">{data.quizQuestion.explanation}</p>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
    );
};

const GenericContentSlide = ({ data }: { data: any }) => (
    <div className="h-full flex flex-col items-center justify-center text-center p-[3rem]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-[2rem] w-[15rem] h-[15rem]">
            {data.visualId && Visuals[data.visualId] && React.createElement(Visuals[data.visualId])}
        </motion.div>
        <h1 className="text-[5rem] font-magic text-[#2c1e12] mb-[1.5rem] leading-none">{data.title}</h1>
        {data.subtitle && <h2 className="text-[2.5rem] font-body text-[#740001] italic font-bold">{data.subtitle}</h2>}
        {data.content && <p className="mt-[2rem] text-[2rem] font-body font-bold text-[#5d4037]">{data.content}</p>}
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
            <motion.div key={currentSlideIndex} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full w-full">
                {renderSlideContent()}
            </motion.div>
        </AnimatePresence>
    </SlideFrame>
  );
}
