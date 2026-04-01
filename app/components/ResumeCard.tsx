import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    const { id, companyName, jobTitle, feedback, imagePath, resumePath } = resume;
    const { fs, kv } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm("Are you sure you want to wipe this intelligence audit? This action cannot be undone.")) return;
        
        setIsDeleting(true);
        console.log(`[Neural Wipe] Initiating teardown for: ${id}`);
        try {
            // Immediate KV Purge
            await kv.delete(`resume:${id}`);
            
            // Background Asset Cleanup (Don't let this block the UI refresh)
            const assetCleanup = Promise.all([
                fs.delete(imagePath),
                fs.delete(resumePath)
            ]).catch(err => console.warn("[Wipe Warning] Asset cleanup incomplete:", err));

            // Force Dashboard Resync
            window.location.href = "/"; // Use authoritative redirect to clear local cache
        } catch (err) {
            console.error("[Wipe Error] Critical failure in teardown:", err);
            alert("Neural Wipe failed. Please check network connectivity.");
            setIsDeleting(false);
        }
    }

    return (
        <div className="relative group/card h-[360px] w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Delete Trigger - Moved to Header Bottom Right */}
            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-[4.5rem] right-6 z-40 p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 border border-gray-100 shadow-sm opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
                title="Wipe Intelligence Audit"
            >
                {isDeleting ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                )}
            </button>

            <Link
                to={`/resume/${id}`}
                className="flex flex-col h-full w-full bg-white border border-gray-200/80 shadow-sm rounded-2xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200/50 transition-all duration-500 overflow-hidden relative"
            >
                {/* Header Information */}
                <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100 bg-gray-50/30">
                    <div className="flex flex-col gap-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-[9px] font-black tracking-[0.3em] text-gray-400 uppercase">Neural Audit</span>
                        </div>
                        <h2 className="text-gray-900 text-xl font-black tracking-tight truncate leading-tight">{companyName || 'Resume Profile'}</h2>
                        <h3 className="text-sm text-gray-400 font-bold tracking-tight truncate uppercase opacity-80">{jobTitle || 'General Analysis'}</h3>
                    </div>
                    
                    <div className="flex flex-col items-center bg-white px-4 py-2 rounded-[1.25rem] border border-gray-100 shadow-sm">
                        <span className="text-2xl font-black text-gray-900 leading-none">{feedback?.overallScore || 0}</span>
                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest leading-none">Score</span>
                    </div>
                </div>

                {/* Body/Preview Section */}
                {resumeUrl ? (
                    <div className="flex-1 bg-gray-50 overflow-hidden relative group/preview">
                        {/* Professional Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] z-20 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                            <div className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-black/20 transform translate-y-4 group-hover/preview:translate-y-0 transition-transform duration-500">
                                Expand Intelligence Audit →
                            </div>
                        </div>

                        <img
                            src={resumeUrl}
                            alt="resume preview"
                            className="w-full h-full object-cover object-top opacity-80 group-hover/preview:scale-110 group-hover/preview:opacity-100 transition-all duration-1000 grayscale group-hover/preview:grayscale-0"
                        />
                    </div>
                ) : (
                    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capturing Vectors...</p>
                    </div>
                )}
            </Link>
        </div>
    )
}
export default ResumeCard
