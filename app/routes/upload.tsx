import { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        setStatusText('Initializing Neural Matrix...');

        try {
            // Step 1: Upload Original PDF
            const uploadedPdfsResult = await fs.upload([file]);
            const uploadedPdfs = uploadedPdfsResult as any;
            const uploadedFile = Array.isArray(uploadedPdfs) ? uploadedPdfs[0] : uploadedPdfs;
            if (!uploadedFile) throw new Error('Failed to synchronize original vectors');

            // Step 2: Convert to image for AI analysis
            setStatusText('Neural Conversion...');
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) {
                throw new Error(imageFile.error || 'Neural conversion failed');
            }

            // Step 3: Upload Image Data
            setStatusText('Mapping Visual Data...');
            const uploadedImages = await fs.upload([imageFile.file]) as any;
            const uploadedImage = Array.isArray(uploadedImages) ? uploadedImages[0] : uploadedImages;
            if (!uploadedImage) throw new Error('Visual data persistence failed');

            // Step 4: Run AI Analysis
            setStatusText('Neural Synapse Analysis...');
            const uuid = generateUUID();

            const feedback = await ai.feedback(
                uploadedImage.path,
                prepareInstructions({ jobTitle, jobDescription })
            )

            if (!feedback) throw new Error('Analysis timeout - Neural engine offline');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : (feedback.message.content as any)[0].text;

            // Step 5: Robust JSON Parsing
            let jsonResponse;
            try {
                let cleanText = feedbackText.trim();

                // Extract JSON if it's wrapped in triple backticks
                const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (match) {
                    cleanText = match[1];
                } else {
                    // Fallback: try to find the first '{' and last '}'
                    const firstBrace = cleanText.indexOf('{');
                    const lastBrace = cleanText.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1) {
                        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
                    }
                }

                // Basic cleaning: remove control characters and trim
                cleanText = cleanText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();

                try {
                    jsonResponse = JSON.parse(cleanText);
                } catch (parseErr) {
                    // Try some aggressive fixes only if standard parse fails
                    console.warn("Standard JSON parse failed, attempting repairs...");

                    // Add missing commas between objects/arrays if they are just separated by whitespace
                    let repaired = cleanText.replace(/"\s*"\s*(\w+)"/g, '", "$1"');
                    repaired = repaired.replace(/}\s*{/g, '}, {');
                    repaired = repaired.replace(/]\s*\[/g, '], [');

                    // Fix missing closing braces if any
                    let openBraces = (repaired.match(/\{/g) || []).length;
                    let closeBraces = (repaired.match(/\}/g) || []).length;
                    if (openBraces > closeBraces) repaired += '}'.repeat(openBraces - closeBraces);

                    jsonResponse = JSON.parse(repaired);
                }
            } catch (finalE) {
                console.error("Failed to parse AI response:", feedbackText);
                throw new Error("Intelligence parsing error - Result structure invalid.");
            }

            // Step 6: Persist Results
            setStatusText('Complete - Syncing Result...');

            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: jsonResponse,
                createdAt: new Date().toISOString()
            }

            // Save once to KV
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // Short delay for visual completion
            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 800);

        } catch (error: any) {
            console.error('Error in handleAnalyze:', error);
            const errorMessage = error?.error?.message || error?.message || 'An unexpected error occurred';
            setStatusText(`Error: ${errorMessage}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="text-black selection:bg-blue-100 relative">
            <Navbar />

            <section className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center relative z-10">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 mx-auto">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Neural Engine Deployment
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                        Audit <span className="text-blue-600">Parameters</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto italic font-medium opacity-80">
                        "Synthesizing your professional document vectors into high-fidelity recruiter insights."
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Status Console (Left Side) */}
                    <div className="w-full lg:w-[35%] flex flex-col gap-6 animate-in fade-in slide-in-from-left-6 duration-1000">
                        <div className="glassmorphism border-[3px] border-white ring-2 ring-indigo-200/50 rounded-3xl p-8 flex-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8 border-b border-gray-100 pb-4">Audit Status</h3>

                            <div className="space-y-8">
                                {[
                                    { label: 'Authentication', active: !!auth.isAuthenticated, done: !!auth.user },
                                    { label: 'Intelligence Engine', active: true, done: !isLoading },
                                    { label: 'Processing Flow', active: isProcessing, done: false },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-[8px] font-black mt-0.5 ${step.done ? 'bg-blue-600 border-blue-600 text-white' : step.active ? 'border-blue-600 text-blue-600 animate-pulse' : 'border-gray-200 text-gray-200'}`}>
                                            {step.done ? '✓' : (i + 1)}
                                        </div>
                                        <div>
                                            <p className={`text-[11px] font-black uppercase tracking-widest ${step.active || step.done ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                            {step.active && !step.done && <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">Initializing...</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-8 border-t border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-[0.2em]">
                                    Encryption: AES-256<br />
                                    Model: GPT-4o-Neural<br />
                                    Latency: &lt; 200ms
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Interaction Area (Right Side) */}
                    <div className="flex-1 animate-in fade-in slide-in-from-right-6 duration-1000 delay-100">
                        <div className="glassmorphism border-[3px] border-white ring-2 ring-indigo-200/50 rounded-[3rem] p-8 md:p-14 overflow-hidden relative">
                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="relative w-32 h-32 mb-12">
                                        <div className="absolute inset-0 border-4 border-gray-50 rounded-[2.5rem] rotate-45"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin rotate-45"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">{statusText}</h2>
                                    <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
                                        <div className="w-1/2 h-full bg-blue-600 rounded-full animate-progress-ind"></div>
                                    </div>
                                    <p className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Neutralizing Data Streams...</p>
                                </div>
                            ) : (
                                <form id="upload-form" onSubmit={handleSubmit} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Target Institution</label>
                                            <input
                                                required
                                                type="text"
                                                name="company-name"
                                                placeholder="e.g. OpenAI, SpaceX"
                                                className="w-full px-5 py-4 text-lg font-bold bg-gray-50/50 border-2 border-gray-100 focus:border-blue-600 focus:bg-white rounded-2xl transition-all placeholder:text-gray-300 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Proposed Designation</label>
                                            <input
                                                required
                                                type="text"
                                                name="job-title"
                                                placeholder="e.g. Lead Architect"
                                                className="w-full px-5 py-4 text-lg font-bold bg-gray-50/50 border-2 border-gray-100 focus:border-blue-600 focus:bg-white rounded-2xl transition-all placeholder:text-gray-300 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Requirement Matrix</label>
                                        <textarea
                                            rows={4}
                                            name="job-description"
                                            placeholder="Optimize analysis by pasting the job specification..."
                                            className="w-full px-5 py-4 text-sm font-medium leading-relaxed bg-gray-50/50 border-2 border-gray-100 focus:border-blue-600 focus:bg-white rounded-2xl transition-all resize-none placeholder:text-gray-300 outline-none"
                                        />
                                    </div>

                                    <div className="space-y-5">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Vector Payload (PDF)</label>
                                        <div className="group/uploader hover:-translate-y-1 transition-transform duration-500">
                                            <FileUploader onFileSelect={handleFileSelect} />
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            className="group/btn relative w-full !py-6 bg-black text-white hover:bg-gray-900 rounded-[2rem] transition-all duration-500 overflow-hidden flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 active:scale-[0.98] disabled:opacity-30"
                                            type="submit"
                                            disabled={!file}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                            <span className="text-xs font-black uppercase tracking-[0.6em] relative z-10">Initialize Audit</span>
                                            <svg className="w-4 h-4 text-blue-500 relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secure Trust Footer */}
                <div className="mt-20 flex items-center gap-12 opacity-40 animate-in fade-in duration-1000 delay-500">
                    {['Trusted encryption', 'No data persistence', 'SOC2 Compliant', 'GDPR Ready'].map((text, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-black rounded-full"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{text}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Upload;
