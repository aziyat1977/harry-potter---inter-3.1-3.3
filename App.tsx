import React, { useState, useEffect } from 'react';
import { SLIDES } from './constants';
import { SlideType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Wand2 } from 'lucide-react';

// Components
const SlideFrame = ({ children, slideIndex, totalSlides, onNext, onPrev }: any) => {
    return (
        <div className="relative w-full h-screen bg-parchment-900 flex items-center justify-center p-4 overflow-hidden">
            {/* Ambient Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0.1
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ width: Math.random() * 4 + 2 + 'px', height: Math.random() * 4 + 2 + 'px' }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-6xl aspect-[16/9] bg-parchment-200 rounded-lg shadow-2xl overflow-hidden border-[16px] border-parchment-800 flex flex-col">
                 {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}></div>
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-16 flex justify-center items-center pointer-events-none z-10">
                     <div className="w-1/3 h-px bg-parchment-800 opacity-30"></div>
                     <div className="mx-4 text-parchment-800"><Sparkles size={16}/></div>
                     <div className="w-1/3 h-px bg-parchment-800 opacity-30"></div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative z-0 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer Controls */}
                <div className="h-16 bg-parchment-300 border-t-4 border-parchment-800 flex justify-between items-center px-6 relative z-10">
                    <button 
                        onClick={onPrev} 
                        disabled={slideIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-magic font-bold"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    <div className="font-magic text-parchment-900 text-lg font-bold tracking-widest">
                        Page {slideIndex + 1} of {totalSlides}
                    </div>

                    <button 
                        onClick={onNext} 
                        disabled={slideIndex === totalSlides - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-magic font-bold"
                    >
                        Next <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const TitleSlide = ({ data }: { data: any }) => (
    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Wand2 size={80} className="text-parchment-800 mb-6 animate-float mx-auto" />
        </motion.div>
        
        <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-magic font-black text-parchment-900 drop-shadow-sm tracking-tighter"
        >
            {data.title}
        </motion.h1>
        
        <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-body italic text-gryffindor font-bold"
        >
            {data.subtitle}
        </motion.h2>

        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="mt-12 p-6 border-2 border-parchment-800 border-dashed rounded-lg bg-parchment-100/50"
        >
            <p className="font-body text-xl font-semibold text-parchment-900">{data.content}</p>
            <p className="font-hand text-2xl mt-4 text-parchment-800">- {data.speaker}</p>
        </motion.div>
    </div>
);

const AgendaSlide = ({ data }: { data: any }) => (
    <div className="h-full p-12 flex flex-col items-center">
        <h2 className="text-5xl font-magic text-parchment-900 mb-2 border-b-4 border-parchment-800 pb-2">{data.title}</h2>
        <h3 className="text-2xl font-body italic text-parchment-800 mb-10">{data.subtitle}</h3>
        
        <div className="w-full max-w-3xl space-y-6">
            {data.content.map((item: string, idx: number) => (
                <motion.div 
                    key={idx}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex items-start gap-4 p-4 rounded bg-parchment-100 shadow-sm border border-parchment-300 hover:scale-105 transition-transform cursor-pointer group"
                >
                    <div className="mt-1 text-parchment-800 group-hover:rotate-12 transition-transform">
                        <img src="https://img.icons8.com/ios-filled/50/5a4632/footprints.png" alt="footsteps" className="w-8 h-8 opacity-60" />
                    </div>
                    <p className="text-2xl font-body text-parchment-900">{item}</p>
                </motion.div>
            ))}
        </div>
    </div>
);

const StorySlide = ({ data }: { data: any }) => (
    <div className="h-full flex flex-row">
        <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-magic text-parchment-900 mb-2">{data.title}</h2>
            <h3 className="text-xl font-magic text-gryffindor mb-6">{data.subtitle}</h3>
            <div className="font-body text-lg text-parchment-900 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {Array.isArray(data.content) ? data.content.map((line: string, i: number) => {
                     const parts = line.split("**");
                     return (
                         <motion.p 
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="leading-relaxed"
                         >
                            {parts.length > 1 ? (
                                <>
                                    <span className="font-bold text-parchment-900 text-xl block mb-1">{parts[1]}</span>
                                    <span>{parts[2]}</span>
                                </>
                            ) : line}
                         </motion.p>
                     )
                }) : <p>{data.content}</p>}
            </div>
        </div>
        <div className="w-1/2 relative bg-parchment-900 overflow-hidden border-l-8 border-parchment-800">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay hover:scale-110 transition-transform duration-[20s]"
                style={{ backgroundImage: `url(${data.imagePrompt})` }}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-t from-parchment-900 via-transparent to-transparent"></div>
        </div>
    </div>
);

const QuizSlide = ({ data }: { data: any }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});

    const handleSelect = (qId: number, optId: string, correct: string) => {
        setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
        setFeedback(prev => ({ ...prev, [qId]: optId === correct }));
    };

    return (
        <div className="h-full p-12 overflow-y-auto">
            <h2 className="text-4xl font-magic text-parchment-900 mb-2 text-center">{data.title}</h2>
            <h3 className="text-xl font-body text-parchment-800 mb-8 text-center">{data.subtitle}</h3>

            <div className="space-y-8 max-w-4xl mx-auto">
                {data.questions.map((q: any) => (
                    <div key={q.id} className="bg-parchment-100 p-6 rounded-lg shadow-md border-2 border-parchment-300">
                        <p className="text-2xl font-body text-parchment-900 font-bold mb-4">{q.id}. {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt: any) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelect(q.id, opt.id, q.correctAnswer)}
                                    className={`
                                        text-left px-4 py-3 rounded border-2 font-body text-lg transition-all
                                        ${selectedAnswers[q.id] === opt.id 
                                            ? feedback[q.id] 
                                                ? 'bg-green-100 border-green-600 text-green-900' 
                                                : 'bg-red-100 border-red-600 text-red-900'
                                            : 'bg-white border-parchment-300 hover:bg-parchment-200'
                                        }
                                    `}
                                >
                                    <span className="font-bold mr-2">{opt.id})</span> {opt.text}
                                </button>
                            ))}
                        </div>
                        {selectedAnswers[q.id] && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className={`mt-3 font-magic font-bold ${feedback[q.id] ? 'text-green-700' : 'text-red-700'}`}
                            >
                                {feedback[q.id] ? "Correct! 10 points to Gryffindor!" : "Incorrect! Confundus Charm?"}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const GapFillSlide = ({ data }: { data: any }) => {
    return (
        <div className="h-full p-12 flex flex-col items-center overflow-y-auto">
            <h2 className="text-4xl font-magic text-parchment-900 mb-4">{data.title}</h2>
            <div className="bg-parchment-800 text-parchment-100 p-4 rounded mb-8 font-body text-xl">
                {data.content}
            </div>

            <div className="max-w-4xl w-full bg-parchment-100 p-8 rounded border-2 border-parchment-300 shadow-inner">
                {data.gapFillExercises.map((ex: any, idx: number) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-2xl font-magic text-parchment-900 mb-4 underline decoration-wavy decoration-parchment-800">{ex.title}</h3>
                        {ex.sentences.map((s: any) => (
                            <div key={s.id} className="text-xl font-body leading-loose">
                                <span>{s.id}. {s.textBefore} </span>
                                <span className="inline-block border-b-2 border-parchment-800 min-w-[120px] text-center font-bold text-gryffindor mx-2">
                                     {/* Simple self-check logic could be added here, for now it's static/printable style with hover reveal */}
                                     <span className="opacity-0 hover:opacity-100 cursor-pointer transition-opacity bg-parchment-200 px-2 rounded">
                                         {s.answer}
                                     </span>
                                </span>
                                <span> {s.textAfter}</span>
                            </div>
                        ))}
                    </div>
                ))}
                 <p className="mt-8 text-sm text-parchment-800 italic text-center">(Hover over the blanks to reveal the answers via Revelio charm)</p>
            </div>
        </div>
    );
}

const TheorySlide = ({ data }: { data: any }) => (
    <div className="h-full flex items-center justify-center p-12 bg-parchment-100">
        <div className="max-w-4xl w-full border-4 border-double border-parchment-800 p-8 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-parchment-800 text-parchment-100 px-6 py-2 font-magic text-xl rounded">
                Ministry Decree
            </div>
            <h2 className="text-5xl font-magic text-center text-parchment-900 mb-8 mt-4">{data.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body text-xl">
                 {data.content.map((item: string, i: number) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded ${item.includes("**") ? 'col-span-1 md:col-span-2 bg-parchment-200 font-bold text-2xl border-b border-parchment-800' : 'bg-white/50 border border-parchment-300'}`}
                     >
                         {item.replace(/\*\*/g, '')}
                     </motion.div>
                 ))}
            </div>
        </div>
    </div>
);

const EndSlide = ({ data }: { data: any }) => (
    <div className="h-full flex flex-col items-center justify-center bg-parchment-900 text-parchment-100 text-center p-12">
        <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="mb-8"
        >
             <Sparkles size={100} className="text-hufflepuff" />
        </motion.div>
        <h1 className="text-8xl font-magic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-hufflepuff to-gryffindor">{data.title}</h1>
        <h2 className="text-4xl font-body italic mb-12">{data.subtitle}</h2>
        <div className="p-6 border border-parchment-300 rounded bg-parchment-800/50 max-w-2xl">
            <p className="text-2xl font-hand">{data.content}</p>
        </div>
    </div>
);


export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));

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
      case SlideType.TITLE: return <TitleSlide data={currentSlide} />;
      case SlideType.AGENDA: return <AgendaSlide data={currentSlide} />;
      case SlideType.STORY: return <StorySlide data={currentSlide} />;
      case SlideType.THEORY: return <TheorySlide data={currentSlide} />;
      case SlideType.QUIZ: return <QuizSlide data={currentSlide} />;
      case SlideType.GAP_FILL: return <GapFillSlide data={currentSlide} />;
      case SlideType.KEY: return <AgendaSlide data={{...currentSlide, title: "Answer Key"}} />; // Reusing Agenda layout for key
      case SlideType.END: return <EndSlide data={currentSlide} />;
      default: return <div className="p-12">Slide type not found</div>;
    }
  };

  return (
    <SlideFrame 
        slideIndex={currentSlideIndex} 
        totalSlides={SLIDES.length}
        onNext={nextSlide}
        onPrev={prevSlide}
    >
        <AnimatePresence mode="wait">
            <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="h-full"
            >
                {renderSlideContent()}
            </motion.div>
        </AnimatePresence>
    </SlideFrame>
  );
}
