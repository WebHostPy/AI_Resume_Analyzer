import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const goodSuggestions = suggestions.filter(s => s.type === 'good' && s.tip?.trim()).slice(0, 3);
  while (goodSuggestions.length < 3) goodSuggestions.push({ type: 'good', tip: 'Audit logic stabilized. No primary faults detected in this sector.' });

  const improveSuggestions = suggestions.filter(s => s.type === 'improve' && s.tip?.trim()).slice(0, 3);
  while (improveSuggestions.length < 3) improveSuggestions.push({ type: 'improve', tip: 'Audit logic stabilized. No primary faults detected in this sector.' });
  
  const isHigh = score > 69;
  const isMid = score > 49;
  
  const statusColor = isHigh ? 'text-emerald-600' : isMid ? 'text-amber-600' : 'text-rose-600';
  const statusBg = isHigh ? 'bg-emerald-50/50' : isMid ? 'bg-amber-50/50' : 'bg-rose-50/50';
  const accentColor = isHigh ? '#10b981' : isMid ? '#f59e0b' : '#f43f5e';
  
  const statusLabel = isHigh ? 'Highly Optimized' : isMid ? 'Partial Compatibility' : 'Low Visibility';
  const statusDescription = isHigh 
    ? 'Document successfully passes primary keyword and formatting parses.' 
    : isMid 
      ? 'Structure detected, but key semantic vectors are missing or weak.' 
      : 'Critical formatting or keyword density issues detected by neural audit.';

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-2xl shadow-gray-200/30 w-full overflow-hidden transition-all duration-700 hover:shadow-[0_50px_120px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-400/40 group/main">
      {/* Precision Header */}
      <div className="p-10 pb-8 border-b border-gray-100/50 relative overflow-hidden">
        <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 border border-white shadow-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse ring-4 ring-indigo-500/10"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">ATS Neural Audit</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-gray-950 tracking-tighter mb-2 leading-none uppercase">Compatibility <span className="text-indigo-600">Score</span></h2>
                    <p className="text-sm font-medium text-gray-400 italic max-w-sm">"Quantifying document parsing probability against modern hiring algorithms."</p>
                </div>
                
                <div className="flex items-baseline gap-2 shrink-0">
                    <span className={`text-6xl font-black tracking-tighter ${statusColor}`}>{score}</span>
                    <span className="text-lg font-bold text-gray-300">/ 100</span>
                </div>
            </div>

            {/* Advanced Segmented Progress Bar */}
            <div className="mt-8 relative h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                <div className="absolute inset-0 flex">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex-1 border-r border-white/40 last:border-0" />
                    ))}
                </div>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_-2px_rgba(0,0,0,0.1)]"
                  style={{ 
                    width: `${score}%`, 
                    background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor})` 
                  }}
                />
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full ${statusBg} border border-white shadow-sm flex items-center gap-2.5`}>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor }}></div>
                    <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${statusColor}`}>{statusLabel}</span>
                </div>
                <p className="text-xs font-bold text-gray-400 italic">Audit Verdict: <span className="text-gray-600 not-italic">"{statusDescription}"</span></p>
            </div>
        </div>
      </div>

      {/* Intelligence Insights */}
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr_1fr_1fr] gap-x-10 gap-y-5 bg-gradient-to-b from-transparent to-gray-50/30">
        {/* Core Strengths */}
        <div className="md:contents flex flex-col gap-5">
            <div className="flex items-center gap-3 md:col-start-1 md:row-start-1 mb-1 md:mb-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Structural Wins</h3>
            </div>
            
            <div className="md:contents flex flex-col gap-3">
                {goodSuggestions.map((tip, i) => (
                    <div key={i} className={`group p-5 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.08)] hover:border-emerald-300 md:col-start-1 ${
                        i === 0 ? 'md:row-start-2' : i === 1 ? 'md:row-start-3' : 'md:row-start-4'
                    }`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-emerald-400/20"></div>
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="p-1.5 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-600 group-hover:rotate-6 transition-transform duration-500 shadow-sm text-xs">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded-sm border border-emerald-100 italic">Strength</span>
                        </div>
                        <p className="text-[11.5px] text-gray-900 font-bold leading-relaxed transition-colors duration-300 relative z-10">{tip.tip}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Actionable Points */}
        <div className="md:contents flex flex-col gap-5 mt-10 md:mt-0">
            <div className="flex items-center gap-3 md:col-start-2 md:row-start-1 mb-1 md:mb-0">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/80">Neural Friction</h3>
            </div>
            
            <div className="md:contents flex flex-col gap-3">
                {improveSuggestions.map((tip, i) => (
                    <div key={i} className={`group p-5 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-rose-50/50 to-white border-rose-100 shadow-[0_15px_40px_-10px_rgba(244,63,94,0.08)] hover:border-rose-300 md:col-start-2 ${
                        i === 0 ? 'md:row-start-2' : i === 1 ? 'md:row-start-3' : 'md:row-start-4'
                    }`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-rose-400/20"></div>
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="p-1.5 rounded-lg bg-rose-100 border border-rose-200 text-rose-600 group-hover:rotate-6 transition-transform duration-500 shadow-sm text-xs">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50/50 px-1.5 py-0.5 rounded-sm border border-rose-100 italic">Friction</span>
                        </div>
                        <p className="text-[11.5px] text-gray-900 font-bold leading-relaxed transition-colors duration-300 relative z-10">{tip.tip}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default ATS
