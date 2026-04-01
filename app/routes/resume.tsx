import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import Summary from '../components/Summary';
import ATS from '../components/ATS';
import Details from '../components/Details';
import Chatbot from '../components/Chatbot';
import InterviewBot from '../components/InterviewBot';

const Resume = () => {
    const { id: resumeId } = useParams();
    const { fs, kv } = usePuterStore();
    const [activeTab, setActiveTab] = useState<'original' | 'enhancv'>('original');
    const [feedback, setFeedback] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [enhancedBlobUrl, setEnhancedBlobUrl] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadResumeData = async () => {
            if (!resumeId || !kv || !fs) return;
            setIsLoading(true);
            try {
                const rawData = await kv.get(`resume:${resumeId}`);
                if (!rawData) throw new Error("Resume mapping not found.");
                
                const parsed = JSON.parse(rawData);
                setFeedback(parsed.feedback);
                
                // Hydrate assets from Puter FS as Blobs
                const [iBlob, rBlob] = await Promise.all([
                    fs.read(parsed.imagePath),
                    fs.read(parsed.resumePath)
                ]);
                
                if (iBlob) {
                    setImageUrl(URL.createObjectURL(iBlob));
                }
                
                if (rBlob) {
                    // Force File object with .pdf extension to assist Chrome's detection
                    const pdfFile = new File([rBlob], 'original_resume.pdf', { type: 'application/pdf' });
                    const rUrl = URL.createObjectURL(pdfFile);
                    setResumeUrl(rUrl);
                }
            } catch (err) {
                console.error("Hydration Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadResumeData();
    }, [resumeId, kv, fs]);

    // Background PDF Generation (Neural Enhancement)
    useEffect(() => {
        let isMounted = true;
        const generate = async () => {
            if (activeTab === 'enhancv' && !isEnhancing && sheetRef.current && !enhancedBlobUrl) {
                try {
                    const html2canvas = (await import('html2canvas')).default;
                    const jsPDF = (await import('jspdf')).default;
                    const canvas = await html2canvas(sheetRef.current, { 
                        scale: 2.5, 
                        useCORS: true, 
                        backgroundColor: "#ffffff",
                        logging: false
                    });
                    if (!isMounted) return;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
                    
                    const blob = pdf.output('blob');
                    const pdfFile = new File([blob], 'enhanced_resume.pdf', { type: 'application/pdf' });
                    const url = URL.createObjectURL(pdfFile);
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-black uppercase text-xs tracking-widest animate-pulse">Hydrating Neural Map...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black selection:bg-blue-100 pb-20">
            <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-center h-20">
                <div className="w-full max-w-[1800px] px-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter leading-none">CVISION</h1>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-60">Neural Engine</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dashboard Return</Link>
                    </div>
                </div>
            </nav>

            <div className="flex pt-20 min-h-screen max-lg:flex-col">
                <section className="w-[40%] p-10 flex flex-col items-center sticky top-20 h-[calc(100vh-5rem)] overflow-hidden max-lg:relative max-lg:w-full max-lg:h-auto">
                    <div className="w-full flex flex-col h-full bg-gray-50 rounded-[3.5rem] p-8 border border-gray-200/50 shadow-inner overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Document Engine v2.0</span>
                            <div className="bg-white/50 backdrop-blur p-1 rounded-full border border-gray-200 flex gap-1">
                                {['original', 'enhancv'].map((tab: any) => (
                                    <button 
                                        key={tab}
                                        onClick={() => handleTabSwitch(tab)}
                                        className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-gray-900 group/tab'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div 
                            className="flex-1 cursor-zoom-in relative bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden group/canvas ring-1 ring-black/5"
                            style={{ aspectRatio: '210/297' }}
                            onClick={() => {
                                const openPdfInNewWindow = (pdfUrl: string) => {
                                    const win = window.open("", "_blank");
                                    if (win) {
                                        // Synchronous Data Injection to force viewer engagement
                                        win.document.write(`
                                            <html>
                                                <head>
                                                    <title>Neural Document Portal</title>
                                                    <style>
                                                        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #525659; }
                                                        embed { width: 100%; height: 100%; border: none; }
                                                    </style>
                                                </head>
                                                <body>
                                                    <embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%"></embed>
                                                </body>
                                            </html>
                                        `);
                                        win.document.close();
                                    }
                                };

                                if (activeTab === 'original' && resumeUrl) {
                                    openPdfInNewWindow(resumeUrl);
                                } else if (activeTab === 'enhancv') {
                                    if (enhancedBlobUrl) {
                                        openPdfInNewWindow(enhancedBlobUrl);
                                    } else {
                                        const win = window.open("", "_blank");
                                        if (win) {
                                            win.document.write("<div style='font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fafafa;'><div style='width:40px;height:40px;border:4px solid #00c2ff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;'></div><p style='margin-top:20px;font-weight:bold;color:#333;text-transform:uppercase;letter-spacing:1px;'>Synthesizing Final PDF...</p><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div>");
                                            const gen = async () => {
                                                try {
                                                    const h2c = (await import('html2canvas')).default;
                                                    const jsp = (await import('jspdf')).default;
                                                    const can = await h2c(sheetRef.current!, { scale: 2.5, useCORS: true, backgroundColor: "#ffffff" });
                                                    const pdf = new jsp('p', 'mm', 'a4');
                                                    pdf.addImage(can.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
                                                    
                                                    const dataUri = pdf.output('datauristring');
                                                    win.document.body.innerHTML = `
                                                        <title>Neural Enhanced Resume</title>
                                                        <style>body,html{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#525659;}embed{width:100%;height:100%;border:none;}</style>
                                                        <embed src="${dataUri}" type="application/pdf" width="100%" height="100%"></embed>
                                                    `;
                                                    setEnhancedBlobUrl(dataUri);
                                                } catch (e) { win.close(); }
                                            };
                                            gen();
                                        }
                                    }
                                }
                            }}
                        >
                            {/* LAYER 1: ORIGINAL (FULL IMAGE SCALING) */}
                            <div className={`absolute inset-0 transition-opacity duration-700 overflow-y-auto custom-scrollbar bg-gray-50 flex items-start justify-center ${activeTab === 'original' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Original Scan" className="w-full h-auto object-contain filter contrast-[1.01]" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center gap-4">
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">Hydrating Scan Vectors...</p>
                                    </div>
                                )}
                            </div>

                            {/* LAYER 2: ENHANCV (STRUCTURED PHYSICAL SHEET) */}
                            <div 
                                ref={sheetRef}
                                className={`absolute inset-0 transition-all duration-700 bg-white p-[5%] overflow-y-auto custom-scrollbar flex flex-col ${activeTab === 'enhancv' ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 translate-y-4 pointer-events-none'}`}
                            >
                                {isEnhancing && (
                                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest animate-pulse">Mapping Intelligence...</p>
                                    </div>
                                )}
                                {feedback?.extractedData ? (
                                    <div className="flex flex-col h-full text-left font-sans text-gray-900">
                                        <header className="mb-8 pb-4 border-b-2 border-black flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h1 className="text-[2.2rem] font-extrabold uppercase tracking-tighter leading-none mb-1 text-black">{feedback.extractedData.name}</h1>
                                                <p className="text-[#00c2ff] font-bold text-lg leading-tight uppercase tracking-widest">{feedback.extractedData.jobTitle}</p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[9px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1.5 uppercase">{feedback.extractedData.email}</span>
                                                    <span className="flex items-center gap-1.5 uppercase">{feedback.extractedData.phone}</span>
                                                    <span className="flex items-center gap-1.5 uppercase">{feedback.extractedData.location}</span>
                                                </div>
                                            </div>
                                            <div className="w-20 h-20 bg-[#00c2ff] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0 group-hover/canvas:scale-110 transition-transform duration-500">
                                                {feedback.extractedData.initials || 'CV'}
                                            </div>
                                        </header>

                                        <div className="grid grid-cols-[1fr_1fr] gap-8 flex-1">
                                            <div className="space-y-10">
                                                <section>
                                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 mb-4 text-black">Strategic Summary</h2>
                                                    <p className="text-[10px] leading-relaxed text-gray-700 font-medium">{feedback.extractedData.summary}</p>
                                                </section>
                                                <section>
                                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 mb-4 text-black">Technology Stack</h2>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {feedback.extractedData.skills?.map((s:any, i:number) => (
                                                            <span key={i} className="px-2 py-0.5 bg-gray-50 text-[8px] font-black uppercase rounded-sm border border-gray-200 text-gray-600">{s}</span>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                            <div className="space-y-10">
                                                <section>
                                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 mb-4 text-black">Academic Background</h2>
                                                    <div className="space-y-5">
                                                        {feedback.extractedData.education?.map((e:any, i:number) => (
                                                            <div key={i}>
                                                                <h3 className="text-[11px] font-extrabold leading-tight mb-1 text-black">{e.degree}</h3>
                                                                <p className="text-[#00c2ff] text-[9px] font-bold tracking-tight">{e.school}</p>
                                                                <p className="text-[8px] text-gray-400 font-bold italic mt-1">{e.date}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                                <section>
                                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 mb-4 text-black">Major Benchmarks</h2>
                                                    <div className="space-y-5">
                                                        {feedback.extractedData.projects?.slice(0, 2).map((p:any, i:number) => (
                                                            <div key={i}>
                                                                <h4 className="text-[11px] font-extrabold leading-tight border-l-2 border-[#00c2ff] pl-3 mb-1 text-black">{p.name}</h4>
                                                                <p className="text-[9px] text-gray-500 font-medium leading-relaxed">{p.description?.slice(0, 150)}...</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center gap-6">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] leading-none animate-pulse">Mapping Intelligence Matrix...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-[60%] p-10 overflow-y-auto max-lg:w-full">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-16 space-y-4">
                            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                                NEURAL INTELLIGENCE STREAM
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                                Professional <span className="text-blue-600">Audit Report</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium italic opacity-70">
                                "Mapping document vectors against proprietary recruitment benchmarks."
                            </p>
                        </div>

                        {feedback ? (
                            <div className="flex flex-col gap-12">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center gap-6">
                                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-bold text-gray-400 italic text-xl uppercase tracking-widest animate-pulse">Synthesizing vectors...</p>
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
};

export default Resume;
