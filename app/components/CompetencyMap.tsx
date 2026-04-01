import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const CustomTick = ({ x, y, payload, index }: any) => {
    // Advanced positioning logic for label breathing room
    const angle = (index * 72 - 90) * (Math.PI / 180);
    const radius = 22; // Healthy gap to prevent grid line/text collision
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;

    return (
        <text
            x={x + offsetX}
            y={y + offsetY}
            fill="#475569"
            fontSize={11}
            fontWeight={900}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}
        >
            {payload.value}
        </text>
    );
};

const CompetencyMap = ({ feedback }: { feedback: Feedback }) => {
    // Derived scores to match our 5 data points
    const impactScore = Math.min(100, Math.round((feedback.content.score + feedback.skills.score) / 2) + 3);

    const data = [
        { subject: 'Style', A: feedback.toneAndStyle.score, fullMark: 100 },
        { subject: 'Content', A: feedback.content.score, fullMark: 100 },
        { subject: 'Structure', A: feedback.structure.score, fullMark: 100 },
        { subject: 'Skills', A: feedback.skills.score, fullMark: 100 },
        { subject: 'Impact', A: impactScore, fullMark: 100 },
    ];

    return (
        <div className="w-full h-full relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    {/* Refined Ultra-Fine Dotted Grids */}
                    <PolarGrid 
                        stroke="#cbd5e1" 
                        strokeWidth={1} 
                        strokeDasharray="2 3" 
                        gridType="polygon"
                    />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={<CustomTick />}
                    />
                    
                    {/* Indigo-Purple filled radar */}
                    <Radar 
                        name="Score" 
                        dataKey="A" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fill="#8b5cf6" 
                        fillOpacity={0.2} 
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CompetencyMap;
