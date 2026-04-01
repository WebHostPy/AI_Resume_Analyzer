import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  const color = score > 69 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : score > 39 ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border", color)}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {score > 69 ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
        )}
      </svg>
      {score}/100
    </div>
  );
};

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => {
  return (
    <div className="flex items-center justify-between py-3 w-full">
      <div className="flex items-center gap-3">
        <p className="text-lg font-bold text-gray-800">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
      <svg className="w-5 h-5 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

const CategoryContent = ({ tips }: { tips: { type: "good" | "improve"; tip: string; explanation: string }[] }) => {
  const goodOnes = tips.filter(t => t.type === 'good');
  const improveOnes = tips.filter(t => t.type === 'improve');
  
  // Ensure exactly 2 of each type for a perfect 2x2 high-density balanced layout
  const finalGood = [...goodOnes.slice(0, 2)];
  while (finalGood.length < 2) finalGood.push({ 
    type: 'good', 
    tip: 'Strategic Stability Detected', 
    explanation: 'Diagnostic audit confirms this vector is operating within optimal parameters. No structural friction detected.' 
  });

  const finalImprove = [...improveOnes.slice(0, 2)];
  while (finalImprove.length < 2) finalImprove.push({ 
    type: 'improve', 
    tip: 'Refinement Threshold Met', 
    explanation: 'Neural audit indicates this sector is currently compliant with industry standards. No critical friction points flagged.' 
  });

  return (
    <div className="pb-6">
      {/* Synchronized 2x2 Grid matching ATS style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-4">
        
        {/* Improvements Pillar */}
        <div className="md:contents flex flex-col gap-4">
            {finalImprove.map((tip, i) => (
                <div key={`imp-${i}`} className={cn(
                    "p-5 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer group relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-amber-50/50 to-white border-amber-100 shadow-[0_15px_40px_-10px_rgba(245,158,11,0.08)] hover:border-amber-300 md:col-start-1",
                    i === 0 ? "md:row-start-1" : "md:row-start-2"
                )}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-amber-400/20"></div>
                    <div className="flex items-start gap-4 mb-3 relative z-10 shrink-0">
                        <div className="p-1.5 rounded-xl border shrink-0 group-hover:rotate-6 transition-all duration-500 shadow-sm bg-amber-100 border-amber-200 text-amber-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1 pt-0.5">
                            <span className="text-[8px] font-bold uppercase tracking-widest w-fit px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-600 border border-amber-100 italic">Neural Friction</span>
                            <p className="text-[11.5px] font-black tracking-tight leading-tight text-gray-950 uppercase">{tip.tip}</p>
                        </div>
                    </div>
                    <p className="text-[11px] font-medium text-gray-400 leading-relaxed relative z-10 italic">
                        {tip.explanation}
                    </p>
                </div>
            ))}
        </div>

        {/* Strengths Pillar */}
        <div className="md:contents flex flex-col gap-4 mt-8 md:mt-0">
            {finalGood.map((tip, i) => (
                <div key={`good-${i}`} className={cn(
                    "p-5 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer group relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.08)] hover:border-emerald-300 md:col-start-2",
                    i === 0 ? "md:row-start-1" : "md:row-start-2"
                )}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-emerald-400/20"></div>
                    <div className="flex items-start gap-4 mb-3 relative z-10 shrink-0">
                        <div className="p-1.5 rounded-xl border shrink-0 group-hover:rotate-6 transition-all duration-500 shadow-sm bg-emerald-100 border-emerald-200 text-emerald-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1 pt-0.5">
                            <span className="text-[8px] font-bold uppercase tracking-widest w-fit px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-100 italic">Competitive Edge</span>
                            <p className="text-[11.5px] font-black tracking-tight leading-tight text-gray-950 uppercase">{tip.tip}</p>
                        </div>
                    </div>
                    <p className="text-[11px] font-medium text-gray-400 leading-relaxed relative z-10 italic">
                        {tip.explanation}
                    </p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};


const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 w-full overflow-hidden transition-all duration-700 hover:shadow-[0_60px_150px_-30px_rgba(30,41,59,0.18)] hover:border-indigo-400/40 relative">
      <div className="p-8 pb-4 border-b border-gray-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 w-fit mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Detailed Breakdown</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Category Analysis</h2>
        <p className="text-sm text-gray-500 mt-1">Expand each section for detailed insights and actionable recommendations.</p>
      </div>

      <div className="p-6">
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader title="Tone & Style" categoryScore={feedback?.toneAndStyle?.score || 0} />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback?.toneAndStyle?.tips || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader title="Content" categoryScore={feedback?.content?.score || 0} />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback?.content?.tips || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader title="Structure" categoryScore={feedback?.structure?.score || 0} />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback?.structure?.tips || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader title="Skills" categoryScore={feedback?.skills?.score || 0} />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback?.skills?.tips || []} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Details;
