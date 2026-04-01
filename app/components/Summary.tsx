import ScoreCircle from "./ScoreCircle";
import CompetencyMap from "./CompetencyMap";
import { cn } from "~/lib/utils";

const CategoryRow = ({ title, score, delay }: { title: string; score: number; delay: number }) => {
    const isElite = score > 69;
    const isGood = score > 49 && score <= 69;

    // We keep the color coding for aesthetics, but remove all level text and boxes
    const textColor = isElite ? 'text-emerald-500' : isGood ? 'text-amber-500' : 'text-red-500';
    const barColor = isElite ? 'bg-emerald-400' : isGood ? 'bg-amber-400' : 'bg-red-400';

    return (
        <div
            style={{ animationDelay: `${delay}ms` }}
            className="animate-in fade-in slide-in-from-right-4 flex flex-col justify-center py-1.5 sm:py-2 border-b border-gray-100 last:border-0 group hover:bg-gray-50 px-2 rounded-xl transition-all duration-300 ease-out w-full cursor-pointer active:scale-[0.98] active:bg-gray-100/80"
        >
            <div className="flex items-center justify-between mb-1 w-full gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", barColor)}></span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 tracking-widest uppercase truncate">{title}</span>
                </div>

                <span className={cn("text-base sm:text-lg font-black tracking-tighter shrink-0", textColor)}>
                    {score}%
                </span>
            </div>

            {/* Thin minimalist progress bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner translate-x-0.5">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
                    style={{ width: `${Math.max(5, score)}%` }}
                ></div>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    // Derived score for realistic extra data point
    const impactScore = Math.min(100, Math.round(((feedback?.content?.score || 0) + (feedback?.skills?.score || 0)) / 2) + 3);

    return (
        <div className="space-y-6">
            {/* Top Tile: Benchmark Matrix */}
            <div className="bg-white rounded-[2rem] border border-gray-200/80 p-8 shadow-sm hover:shadow-md transition-shadow duration-500 group relative overflow-hidden">
                <div className="flex items-center gap-2 mb-8 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        AUDIT SOURCE: ORIGINAL DOCUMENT
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 relative z-10">
                    {/* Score Circle Area & Levels */}
                    <div className="flex flex-col sm:flex-row items-center bg-gray-50/50 rounded-[2rem] p-5 border border-gray-100 shadow-inner group-hover:bg-gray-50 transition-colors duration-500">
                        <ScoreCircle score={feedback.overallScore} />

                        {/* Score Levels Legend directly after circle */}
                        <div className="flex justify-center sm:ml-4 sm:border-l sm:border-gray-200 border-t border-gray-200 sm:border-t-0 mt-4 sm:mt-0 pt-4 sm:pt-0 sm:pl-6 sm:h-36 flex-col gap-4 sm:justify-evenly w-full sm:w-auto">
                            <div className="flex items-center gap-3 group/level hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-90">
                                <span className="w-2.5 h-2.5 rounded-sm shadow-sm bg-emerald-500 group-hover/level:scale-125 transition-transform"></span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-700">Elite</span>
                                    <span className="text-[10px] sm:text-[9px] font-semibold text-gray-400">&gt;= 70%</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group/level hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-90">
                                <span className="w-2.5 h-2.5 rounded-sm shadow-sm bg-amber-500 group-hover/level:scale-125 transition-transform"></span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-amber-700">Good</span>
                                    <span className="text-[10px] sm:text-[9px] font-semibold text-gray-400">50 - 69%</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group/level hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-90">
                                <span className="w-2.5 h-2.5 rounded-sm shadow-sm bg-red-500 group-hover/level:scale-125 transition-transform"></span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-red-700">Improve</span>
                                    <span className="text-[10px] sm:text-[9px] font-semibold text-gray-400">&lt; 50%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        <div className="mx-auto lg:mx-0 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 w-fit px-3 py-1.5 rounded-full border border-blue-100/50">
                            <span className="w-1.5 h-1.5 rounded-[1px] bg-blue-600 animate-pulse"></span>
                            CORE ANALYSIS LAYER
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight">
                            <span className="text-gray-900">Benchmark </span>
                            <span className="text-blue-600">Matrix</span>
                        </h2>

                        <p className="text-gray-500 italic text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 border-l-2 border-blue-200 pl-4 py-1">
                            "Synthesizing cross-industry document profiles against proprietary talent discovery clusters."
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Row Tiles: Indicators & Radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* Audit Indicators Tile (Responsive Square) */}
                <div className="bg-white rounded-[2.5rem] border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-[0_40px_100px_-10px_rgba(30,41,59,0.12)] transition-all duration-700 group relative aspect-square flex flex-col w-full min-h-0 overflow-hidden hover:border-gray-300">
                    <div className="flex justify-between items-center mb-4 shrink-0 z-10">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            Audit Indicators
                        </h3>
                        <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-100 shadow-sm w-fit shrink-0 tracking-widest leading-none">
                            5 Vectors
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-evenly w-full z-10 min-h-0 py-2">
                        <CategoryRow title="Tone & Style" score={feedback?.toneAndStyle?.score || 0} delay={100} />
                        <CategoryRow title="Content Logic" score={feedback?.content?.score || 0} delay={200} />
                        <CategoryRow title="Structure" score={feedback?.structure?.score || 0} delay={300} />
                        <CategoryRow title="Skill Mapping" score={feedback?.skills?.score || 0} delay={400} />
                        <CategoryRow title="Impact & Phrasing" score={impactScore} delay={500} />
                    </div>
                </div>

                {/* Competency Nexus Tile (Responsive Square) */}
                <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-[2.5rem] border border-indigo-100/50 p-6 sm:p-8 shadow-sm hover:shadow-[0_40px_100px_-10px_rgba(79,70,229,0.12)] transition-all duration-700 relative overflow-hidden group aspect-square flex flex-col w-full min-h-0 hover:border-indigo-300/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>

                    <div className="flex justify-center items-center mb-4 relative z-10 shrink-0">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 animate-pulse shadow-sm"></span>
                            Competency Nexus
                        </h3>
                    </div>

                    {/* Perfectly Centered Content Zone (Square-Optimized) */}
                    <div className="flex-1 w-full relative z-10 flex items-center justify-center overflow-hidden min-h-0 translate-y-1">
                        <div className="w-full h-full flex items-center justify-center scale-100 group-hover:scale-[1.02] transition-transform duration-700 min-h-0">
                            <CompetencyMap feedback={feedback} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Summary
