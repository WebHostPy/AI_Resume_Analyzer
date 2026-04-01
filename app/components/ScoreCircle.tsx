import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = 64;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = animatedScore / 100;
    const strokeDashoffset = circumference * (1 - progress);

    const statusText = score > 69 ? 'ELITE PERFORMANCE' : score > 49 ? 'GOOD PERFORMANCE' : 'NEEDS IMPROVEMENT';

    useEffect(() => {
        const duration = 800;
        const startTime = performance.now();
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setAnimatedScore(Math.round(eased * score));
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    const primaryColor = score > 69 ? '#10b981' : score > 49 ? '#f59e0b' : '#ef4444';
    const primaryShadowColor = score > 69 ? 'rgba(16,185,129,0.3)' : score > 49 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)';

    return (
        <div className="relative w-[180px] h-[180px] flex shrink-0 items-center justify-center font-sans tracking-tight group/circle">
            
            {/* DYNAMIC MOVING SHADOW / BLOOM */}
            <div 
                style={{ backgroundColor: primaryShadowColor }}
                className="absolute inset-[15%] rounded-full blur-[40px] animate-[pulse_4s_linear_infinite] opacity-40 mix-blend-multiply"
            ></div>

            {/* NEURAL SATELLITE (Rotating Color Dot) */}
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-none animate-[spin_8s_linear_infinite]">
                 <div 
                    style={{ backgroundColor: primaryColor }}
                    className={cn(
                        "absolute top-[18px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full blur-[1px] shadow-[0_0_12px_rgba(0,0,0,0.2)]",
                        score > 69 ? 'shadow-emerald-500/80' : score > 49 ? 'shadow-amber-500/80' : 'shadow-red-500/80'
                    )}
                ></div>
                {/* Subtle light trail effect */}
                <div 
                    style={{ background: `linear-gradient(to right, transparent, ${primaryColor}50)` }}
                    className="absolute top-[21px] left-[35%] w-[15%] h-[1px] opacity-30 blur-sm -rotate-2"
                ></div>
            </div>

            <svg height="100%" width="100%" viewBox="0 0 180 180" className="transform -rotate-90 relative z-10 w-full h-full">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={primaryColor} stopOpacity={0.7} />
                    </linearGradient>

                    {/* MOVEMENT PATTERN (Liquid Scrolling Effect) */}
                    <pattern id="neuralPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line 
                            x1="0" y1="10" x2="10" y2="0" 
                            stroke="white" strokeWidth="2" strokeOpacity="0.2"
                        />
                        <animateTransform 
                            attributeName="patternTransform" 
                            type="translate" 
                            from="0 0" to="10 0" 
                            dur="1s" repeatCount="indefinite" 
                        />
                    </pattern>

                    <mask id="patternMask">
                        <circle
                            cx="90" cy="90" r={normalizedRadius}
                            stroke="white" strokeWidth="8" fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </mask>
                </defs>

                {/* Solid Background Track (Continuous White Neural Ring) */}
                <circle
                    cx="90" cy="90" r={normalizedRadius}
                    stroke="white" strokeWidth="8" 
                    fill="transparent"
                    className="opacity-100"
                />
                
                {/* Main Progress track (Fixed Result Pathway) */}
                <circle
                    cx="90" cy="90" r={normalizedRadius}
                    stroke="url(#scoreGradient)"
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-20"
                />

                {/* MOVING PATTERN OVERLAY */}
                <circle
                    cx="90" cy="90" r={normalizedRadius}
                    stroke="url(#neuralPattern)"
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className="z-30 opacity-60"
                />
            </svg>
            
            {/* Center Text Area */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex flex-col items-center group-hover:scale-105 transition-all duration-700">
                    <div className="flex items-baseline gap-1">
                        {/* THE GEOMETRIC CENTER MARK - COMPACT SCALE */}
                        <span className="text-5xl font-black text-slate-800 tracking-tighter leading-none drop-shadow-[0_4px_12px_rgba(30,41,59,0.12)]">
                            {animatedScore}
                        </span>
                        
                        {/* MICRO-HORIZONTAL DENOMINATOR (Zero-pressure fit) */}
                        <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] opacity-50 uppercase -translate-y-1">
                            / 100
                        </span>
                    </div>
                </div>
            </div>

            {/* EXTERIOR STATUS BADGE */}
            <div className="absolute -bottom-1 flex items-center justify-center w-full z-20 h-8">
                <div className={cn(
                    "px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border transition-all duration-500 bg-white/70 backdrop-blur-sm scale-90 translate-y-2",
                    score > 69 ? 'border-emerald-100 text-emerald-700' : 
                    score > 49 ? 'border-amber-100 text-amber-700' : 
                    'border-red-100 text-red-700'
                )}>
                    <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        score > 69 ? 'bg-emerald-500' : score > 49 ? 'bg-amber-500' : 'bg-red-500'
                    )}></span>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                        {statusText}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScoreCircle;
