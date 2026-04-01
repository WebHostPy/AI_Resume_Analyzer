import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = animatedScore / 100;

    const statusColor = score > 69 ? '#10b981' : score > 49 ? '#f59e0b' : '#ef4444';
    const statusText = score > 69 ? 'Excellent' : score > 49 ? 'Good' : 'Needs Work';

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    return (
        <div className="relative group" style={{ width: '200px', height: '200px' }}>
            {/* Outer glow ring */}
            <div className="absolute inset-3 bg-white/40 backdrop-blur-3xl rounded-full border border-white shadow-[0_15px_45px_rgba(0,0,0,0.05)] transition-transform duration-1000 group-hover:scale-105" />

            {/* SVG Gauge */}
            <svg viewBox="0 0 120 120" className="w-full h-full relative z-10">
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background track */}
                <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="301.59"
                    strokeDashoffset="75.4"
                    transform="rotate(135, 60, 60)"
                    opacity="0.5"
                />

                {/* Foreground arc */}
                <circle
                    ref={pathRef as any}
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 - (301.59 - 75.4) * percentage}
                    transform="rotate(135, 60, 60)"
                    filter="url(#glow)"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="text-4xl font-black tracking-tight text-gray-900">{animatedScore}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-0.5">out of 100</div>
                <div
                    className={`mt-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/60 shadow-sm backdrop-blur-md bg-white/60 ${statusText}`}
                    style={{ color: statusColor }}
                >
                    {statusText}
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
