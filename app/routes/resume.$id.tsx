import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import Summary from '../components/Summary';
import ATS from '../components/ATS';
import Details from '../components/Details';
import Chatbot from '../components/Chatbot';
import InterviewBot from '../components/InterviewBot';

export default function Resume() {
    const { id: resumeId } = useParams();
    const { fs, kv, isLoading: storeLoading } = usePuterStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'original' | 'enhancv'>('original');
    const [feedback, setFeedback] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [enhancedBlobUrl, setEnhancedBlobUrl] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const sheetRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const parentWidth = entry.contentRect.width;
                // Subtract 48px to exactly mirror the padding/margin formatting of the p-6 container
                const availableWidth = parentWidth - 48;
                setScale(Math.min(availableWidth / 794, 1));
            }
        });
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [activeTab]);

    useEffect(() => {
        const loadResumeData = async () => {
            if (!resumeId || storeLoading) return;
            setIsLoading(true);
            try {
                const rawData = await kv.get(`resume:${resumeId}`);
                console.log(`[Neural Fetch] Key: resume:${resumeId} | Found: ${!!rawData}`);
                
                if (!rawData) {
                    console.error("Resume mapping not found in Neural Core.");
                    setIsLoading(false);
                    return;
                }

                const parsed = JSON.parse(rawData);
                
                // Validate feedback structure
                if (!parsed.feedback || typeof parsed.feedback !== 'object') {
                    console.warn("Incomplete intelligence payload detected.");
                }
                
                setFeedback(parsed.feedback);

                // Fetch public read URLs from Puter Cloud FS
                const [iUrl, rUrl] = await Promise.all([
                    fs.getReadURL(parsed.imagePath),
                    fs.getReadURL(parsed.resumePath)
                ]);

                setImageUrl(iUrl || '');
                setResumeUrl(rUrl || '');
            } catch (err) {
                console.error("Hydration Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadResumeData();
    }, [resumeId, kv, fs, storeLoading, navigate]);

    // Background PDF Generation
    useEffect(() => {
        let isMounted = true;
        const generate = async () => {
            if (activeTab === 'enhancv' && !isEnhancing && sheetRef.current) {
                try {
                    const { toPng } = await import('html-to-image');
                    const jsPDF = (await import('jspdf')).default;

                    const sheetEl = sheetRef.current;
                    const dataUrl = await toPng(sheetEl, { pixelRatio: 2.5, backgroundColor: "#ffffff", skipFonts: false });
                    if (!isMounted) return;

                    // Create Standard A4 PDF
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const margin = 10;
                    const availWidth = 210 - (margin * 2);
                    const availHeight = 297 - (margin * 2);

                    const aspectRatio = sheetEl.offsetHeight / sheetEl.offsetWidth;
                    let pdfWidth = availWidth;
                    let pdfHeight = availWidth * aspectRatio;

                    if (pdfHeight > availHeight) {
                        pdfHeight = availHeight;
                        pdfWidth = availHeight / aspectRatio;
                    }

                    const xOffset = margin + (availWidth - pdfWidth) / 2;
                    const yOffset = margin + (availHeight - pdfHeight) / 2;

                    pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
                    const url = URL.createObjectURL(pdf.output('blob'));
                    setEnhancedBlobUrl(url);
                } catch (e) { console.error("BG Gen Error:", e); }
            }
        };
        generate();
        return () => { isMounted = false; };
    }, [activeTab, isEnhancing, enhancedBlobUrl]);

    const handleTabSwitch = (tab: 'original' | 'enhancv') => {
        if (tab === 'enhancv' && activeTab !== 'enhancv') {
            setIsEnhancing(true);
            setTimeout(() => setIsEnhancing(false), 800);
        }
        setActiveTab(tab);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium text-xs tracking-wider uppercase">Loading Audit Data...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen text-gray-900 selection:bg-blue-100 pb-20 font-sans">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-200 shadow-sm flex justify-center h-16">
                <div className="w-full max-w-[1800px] px-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-gray-900">Neural Intelligence</h1>
                            <p className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">Audit Dashboard</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm active:scale-95 hover:scale-105">
                            New Audit
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16 min-h-screen max-lg:flex-col mx-auto max-w-[1800px]">
                {/* Left Section - Document Viewer */}
                <section className="w-[45%] p-8 flex flex-col items-center sticky top-16 h-[calc(100vh-4rem)] overflow-hidden max-lg:relative max-lg:w-full max-lg:h-auto border-r border-gray-200/60">
                    <div className="w-full flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
                        {/* Header of Viewer */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="text-xs font-semibold text-gray-600">Document Viewer</span>
                            </div>
                            <div className="bg-gray-100/80 p-1 rounded-lg flex gap-1">
                                {['original', 'enhancv'].map((tab: any) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabSwitch(tab)}
                                        className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ease-out active:scale-95 ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50 scale-100' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 hover:scale-105'}`}
                                    >
                                        {tab === 'original' ? 'Original PDF' : 'Enhanced Version'}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (activeTab === 'original') window.open(resumeUrl, '_blank');
                                    else if (enhancedBlobUrl) window.open(enhancedBlobUrl, '_blank');
                                    else {
                                        // Force immediate open for enhanced
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write("<div style='font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fafafa;'><div style='width:40px;height:40px;border:4px solid #00c2ff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;'></div><p style='margin-top:20px;font-weight:bold;color:#333;text-transform:uppercase;'>Synthesizing Professional PDF...</p><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>");
                                            const gen = async () => {
                                                try {
                                                    const { toPng } = await import('html-to-image');
                                                    const jsp = (await import('jspdf')).default;

                                                    const sheetEl = sheetRef.current!;
                                                    const dataUrl = await toPng(sheetEl, { pixelRatio: 2.5, backgroundColor: "#ffffff" });

                                                    const pdf = new jsp('p', 'mm', 'a4');
                                                    const margin = 10;
                                                    const availWidth = 210 - (margin * 2);
                                                    const availHeight = 297 - (margin * 2);

                                                    const aspectRatio = sheetEl.offsetHeight / sheetEl.offsetWidth;
                                                    let pdfWidth = availWidth;
                                                    let pdfHeight = availWidth * aspectRatio;

                                                    if (pdfHeight > availHeight) {
                                                        pdfHeight = availHeight;
                                                        pdfWidth = availHeight / aspectRatio;
                                                    }

                                                    const xOffset = margin + (availWidth - pdfWidth) / 2;
                                                    const yOffset = margin + (availHeight - pdfHeight) / 2;

                                                    pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
                                                    const url = URL.createObjectURL(pdf.output('blob'));

                                                    win.document.body.innerHTML = `<iframe src="${url}" style="width:100vw;height:100vh;border:none;margin:0;padding:0;overflow:hidden;position:fixed;top:0;left:0;"></iframe>`;
                                                    win.document.body.style.margin = "0";

                                                    setEnhancedBlobUrl(url);
                                                } catch (e) { win.close(); }
                                            };
                                            gen();
                                        }
                                    }
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-blue-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-200 active:scale-90"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Open Full PDF
                            </button>
                        </div>

                        {/* Viewer Canvas */}
                        <div
                            onClick={() => {
                                if (activeTab === 'original') window.open(resumeUrl, '_blank');
                                else if (enhancedBlobUrl) window.open(enhancedBlobUrl, '_blank');
                                else {
                                    const win = window.open("", "_blank");
                                    if (win) {
                                        win.document.write("<div style='font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fafafa;'><div style='width:40px;height:40px;border:4px solid #00c2ff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;'></div><p style='margin-top:20px;font-weight:bold;color:#333;text-transform:uppercase;'>Synthesizing Professional PDF...</p><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>");
                                        const gen = async () => {
                                            try {
                                                const { toPng } = await import('html-to-image');
                                                const jsp = (await import('jspdf')).default;

                                                const sheetEl = sheetRef.current!;
                                                const dataUrl = await toPng(sheetEl, { pixelRatio: 2.5, backgroundColor: "#ffffff" });

                                                const pdf = new jsp('p', 'mm', 'a4');
                                                const margin = 10;
                                                const availWidth = 210 - (margin * 2);
                                                const availHeight = 297 - (margin * 2);

                                                const aspectRatio = sheetEl.offsetHeight / sheetEl.offsetWidth;
                                                let pdfWidth = availWidth;
                                                let pdfHeight = availWidth * aspectRatio;

                                                if (pdfHeight > availHeight) {
                                                    pdfHeight = availHeight;
                                                    pdfWidth = availHeight / aspectRatio;
                                                }

                                                const xOffset = margin + (availWidth - pdfWidth) / 2;
                                                const yOffset = margin + (availHeight - pdfHeight) / 2;

                                                pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
                                                const url = URL.createObjectURL(pdf.output('blob'));

                                                win.document.body.innerHTML = `<iframe src="${url}" style="width:100vw;height:100vh;border:none;margin:0;padding:0;overflow:hidden;position:fixed;top:0;left:0;"></iframe>`;
                                                win.document.body.style.margin = "0";

                                                setEnhancedBlobUrl(url);
                                            } catch (e) { win.close(); }
                                        };
                                        gen();
                                    }
                                }
                            }}
                            className="flex-1 relative bg-gray-100 overflow-hidden group/canvas"
                            style={{ aspectRatio: '210/297' }}
                        >
                            <div className={`absolute inset-0 transition-opacity duration-500 overflow-y-auto custom-scrollbar p-6 bg-gray-100/50 flex align-top justify-center ${activeTab === 'original' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                                <img src={imageUrl} alt="Original" className="w-[95%] h-auto shadow-lg border border-gray-200 object-contain mx-auto my-0 self-start bg-white cursor-zoom-in" />
                            </div>
                            <div
                                ref={wrapperRef}
                                className={`absolute inset-0 transition-opacity duration-500 overflow-y-auto overflow-x-hidden custom-scrollbar p-6 bg-gray-100/50 flex flex-col items-center pt-8 ${activeTab === 'enhancv' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <div style={{ height: `${(1123 * scale)}px`, width: '100%', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '794px', height: '1123px' }}>
                                        <div
                                            ref={sheetRef}
                                            className={`w-[794px] h-[1123px] shrink-0 bg-white shadow-xl shadow-gray-200/50 relative flex flex-col p-10 overflow-hidden transition-all duration-500 origin-top transform-gpu cursor-zoom-in ${activeTab === 'enhancv' ? 'scale-100' : 'scale-[0.98] translate-y-2'}`}
                                        >
                                            {isEnhancing && (
                                                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none">
                                                    <div className="w-8 h-8 border-2 border-[#0084ff] border-t-transparent rounded-full animate-spin mb-3"></div>
                                                    <p className="text-[10px] font-bold uppercase text-[#0084ff] tracking-wider">Rendering Document...</p>
                                                </div>
                                            )}
                                            {feedback?.extractedData ? (
                                                <div className="flex flex-col h-full text-left font-sans text-gray-900 leading-tight">
                                                    <header className="mb-4 flex justify-between items-start">
                                                        <div className="flex flex-col">
                                                            <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-1 leading-none">{feedback.extractedData.name}</h1>
                                                            <p className="text-[#0084ff] font-bold text-sm tracking-wide mb-2">{feedback.extractedData.jobTitle}</p>
                                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8.5px] font-bold text-gray-700">
                                                                <span className="flex items-center gap-1">📞 {feedback.extractedData.phone || "N/A"}</span>
                                                                <span className="flex items-center gap-1">✉️ {feedback.extractedData.email || "N/A"}</span>
                                                                <span className="flex items-center gap-1">🔗 {feedback.extractedData.website || "linkedin.com"}</span>
                                                                <span className="flex items-center gap-1">📍 {feedback.extractedData.location || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-16 h-16 bg-[#0084ff] rounded-full flex items-center justify-center text-white text-xl font-normal shrink-0 mt-1">{feedback.extractedData.initials || 'CV'}</div>
                                                    </header>

                                                    <div className="grid grid-cols-12 gap-5 mt-1">
                                                        {/* Left Column */}
                                                        <div className="col-span-12 md:col-span-7 space-y-3.5">
                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Summary</h2>
                                                                <p className="text-[8px] leading-relaxed text-gray-700 font-medium text-justify">{feedback.extractedData.summary}</p>
                                                            </section>

                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Experience</h2>
                                                                <div className="space-y-2.5">
                                                                    {feedback.extractedData.experience?.map((exp: any, i: number) => (
                                                                        <div key={i} className={i > 0 ? "border-t border-dashed border-gray-300 pt-1.5" : ""}>
                                                                            <h3 className="text-[10px] font-bold text-black mb-0">{exp.title}</h3>
                                                                            <p className="text-[#0084ff] font-bold text-[9px] mb-0.5">{exp.company}</p>
                                                                            <div className="flex gap-4 text-[8px] text-gray-500 font-medium mb-1">
                                                                                <span>📅 {exp.date || 'Present'}</span>
                                                                                <span>📍 {exp.location || 'Remote'}</span>
                                                                            </div>
                                                                            {exp.description && (
                                                                                <p className="text-[8px] text-gray-600 font-medium leading-relaxed mb-1">{exp.description}</p>
                                                                            )}
                                                                            {exp.bullets && exp.bullets.length > 0 && (
                                                                                <ul className="list-disc pl-3 text-[8px] text-gray-700 leading-relaxed font-medium">
                                                                                    {exp.bullets.map((bull: string, j: number) => (
                                                                                        <li key={j}>{bull}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </section>

                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Education</h2>
                                                                <div className="space-y-2">
                                                                    {feedback.extractedData.education?.map((e: any, i: number) => (
                                                                        <div key={i} className={i > 0 ? "border-t border-dashed border-gray-300 pt-2" : ""}>
                                                                            <h3 className="text-[10px] font-bold text-black mb-0.5">{e.degree}</h3>
                                                                            <p className="text-[#0084ff] font-bold text-[9px] mb-0.5">{e.school}</p>
                                                                            <div className="flex gap-4 text-[8px] text-gray-500 font-medium">
                                                                                <span>📅 {e.date || 'N/A'}</span>
                                                                                <span>📍 {e.location || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </section>

                                                            {/* Optional Training / Courses Section */}
                                                            {(feedback.extractedData.courses?.length > 0 || feedback.extractedData.certifications?.length > 0) && (
                                                                <section>
                                                                    <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5 mt-4">Training / Courses</h2>
                                                                    <div className="space-y-2">
                                                                        {(feedback.extractedData.courses || feedback.extractedData.certifications || []).map((c: any, i: number) => (
                                                                            <div key={i} className={i > 0 ? "border-t border-dashed border-gray-300 pt-2" : ""}>
                                                                                <h3 className="text-[10px] font-bold text-black mb-0.5">{c.name || c.title || 'Coursework'}</h3>
                                                                                <p className="text-[8.5px] text-gray-500 font-medium leading-relaxed">{c.description || c.issuer || (c.skills ? c.skills.join(', ') : '')}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </section>
                                                            )}
                                                        </div>

                                                        {/* Right Column */}
                                                        <div className="col-span-12 md:col-span-5 space-y-3.5">
                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Strengths</h2>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-start gap-1.5">
                                                                        <span className="text-[#0084ff] text-sm leading-none mt-0">⭐</span>
                                                                        <div>
                                                                            <h3 className="text-[10px] font-bold text-black mb-0">Soft Skills</h3>
                                                                            <p className="text-[8px] text-gray-700 font-medium leading-relaxed">{feedback.extractedData.softSkills}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </section>

                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Key Achievements</h2>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-start gap-1.5">
                                                                        <span className="text-[#0084ff] text-sm leading-none mt-0">🏆</span>
                                                                        <div>
                                                                            <h3 className="text-[10px] font-bold text-black mb-0">Key Achievements</h3>
                                                                            <p className="text-[8px] text-gray-700 font-medium leading-relaxed">{feedback.extractedData.achievements}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </section>

                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Skills</h2>
                                                                <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
                                                                    {feedback.extractedData.skills?.map((s: any, i: number) => (
                                                                        <span key={i} className="px-1 text-[8px] font-bold text-gray-700 border-b-[1.5px] border-gray-300 pb-0.5">{s}</span>
                                                                    ))}
                                                                </div>
                                                            </section>

                                                            <section>
                                                                <h2 className="text-xs font-black uppercase tracking-widest text-black border-b-[1.5px] border-black pb-1 mb-1.5">Projects</h2>
                                                                <div className="space-y-2.5">
                                                                    {feedback.extractedData.projects?.map((p: any, i: number) => (
                                                                        <div key={i} className={i > 0 ? "border-t border-dashed border-gray-300 pt-1.5" : ""}>
                                                                            <h3 className="text-[10px] font-bold text-black mb-0">{p.name}</h3>
                                                                            <p className="text-[8px] text-gray-500 font-medium mb-1">📅 {p.date || 'Recent'}</p>
                                                                            {p.description && (
                                                                                <p className="text-[8px] text-gray-700 font-medium leading-relaxed mb-0.5">{p.description}</p>
                                                                            )}
                                                                            {p.bullets && p.bullets.length > 0 && (
                                                                                <ul className="list-disc pl-3 text-[8px] text-gray-700 leading-relaxed font-medium">
                                                                                    {p.bullets.map((b: string, j: number) => <li key={j}>{b}</li>)}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center gap-4">
                                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest animate-pulse">Processing Document...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section - Analysis Report */}
                <section className="w-[55%] p-12 overflow-y-auto max-lg:w-full">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50/50 w-max px-3 py-1 rounded-full border border-blue-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                Analysis Complete
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                                Professional <span className="text-blue-600">Audit Report</span>
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">
                                Comprehensive evaluation mapped against industry benchmarks.
                            </p>
                        </div>

                        {feedback ? (
                            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Summary feedback={feedback} />
                                <ATS score={feedback?.ATS?.score || 0} suggestions={feedback?.ATS?.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : !isLoading ? (
                            <div className="py-24 flex flex-col items-center gap-6 bg-white rounded-2xl border border-red-100 shadow-xl shadow-red-500/5 text-center px-10">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Intelligence Data Missing</h2>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">The requested audit results could not be retrieved from the Neural Core. This may be due to a sync delay or a session timeout.</p>
                                <Link to="/upload" className="primary-button !py-4 !px-8 text-xs font-black uppercase tracking-widest mt-4">
                                    Start New Audit
                                </Link>
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm tracking-tight">Synthesizing Audit...</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Accessing Neural Database</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            {feedback && (
                <>
                    <Chatbot feedback={feedback} />
                    <InterviewBot feedback={feedback} />
                </>
            )}
        </main>
    );
}
