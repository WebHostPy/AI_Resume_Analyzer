import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "CVision" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes
        ?.map((r) => {
          try {
            const data = JSON.parse(r.value);
            return data && typeof data === 'object' && data.id ? (data as Resume) : null;
          } catch { return null; }
        })
        .filter((r): r is Resume => r !== null);

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="relative">
    <Navbar />

    {/* Ambient Background glow to frame the center */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center pt-32 md:pt-48 pb-12 md:pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/20 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Neural Engine Powered
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] md:leading-[1.1] lg:leading-[1.1] font-black tracking-tighter text-gray-900 mb-6 md:mb-8 max-w-5xl mx-auto">
          Elevate Your Career with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">CVision Intelligence</span>
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-4 md:px-0">
          The ultimate AI-powered resume strategist. Get an instant ATS scan, targeted gap discovery, and perfectly formulated career feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
          <Link to="/upload" className="primary-button relative overflow-hidden group w-full sm:w-auto !px-8 md:!px-10 !py-3 md:!py-4 text-base md:text-lg font-bold shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-1 rounded-2xl flex items-center justify-center gap-3">
            Analyze Your Resume →
          </Link>
          <a href="#features" className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            See How it Works
          </a>
        </div>
      </div>

      {/* Stats/Social Proof */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto py-12 border-y border-gray-100 mb-20">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">ATS Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Resumes Analyzed</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
          <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">AI Interview Support</div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full py-16 md:py-24 scroll-mt-20 px-4 md:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Master Your Job Search in 3 Strategic Steps</h2>
          <p className="text-gray-500 max-w-xl mx-auto italic font-medium">Strategic bridging from resume upload to final interview mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 group transition-all duration-500 flex flex-col items-center text-center aspect-[4/5] justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-3xl font-black font-mono">01</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Precision Targeting</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Upload your PDF resume and target role. Our AI analyzes alignment with specific job requirements instantly.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 group transition-all duration-500 flex flex-col items-center text-center aspect-[4/5] justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-3xl font-black font-mono">02</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Tactical Gap Audit</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Identify missing technical keywords, experience phrasing, and get an actual ATS score ranking for your profile.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-2 group transition-all duration-500 flex flex-col items-center text-center aspect-[4/5] justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-3xl font-black font-mono">03</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Data Intelligence</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Review a comprehensive visual dashboard to refine your professional storytelling and maximize output.</p>
          </div>
        </div>
      </div>

      {/* Main Content / Resumes */}
      <div id="resumes" className="w-full space-y-12 pb-24 top-10 relative">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-6 gap-4 sm:gap-0 px-4 sm:px-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Applications</h2>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage and track your analyzed resumes</p>
          </div>
          {resumes.length > 0 && (
            <Link to="/upload" className="text-blue-600 font-semibold hover:underline">
              + New Analysis
            </Link>
          )}
        </div>

        {loadingResumes ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium italic">Retrieving your insights...</p>
          </div>
        ) : resumes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-10 pb-16 max-w-5xl mx-auto relative z-20">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glassmorphism rounded-3xl max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No resumes analyzed yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto px-4 md:px-0">Upload your first resume to see the magic of AI analysis and get career-ready.</p>
            <Link to="/upload" className="primary-button !w-fit !px-8 md:!px-10 !py-3 md:!py-4 text-base md:text-lg font-bold hover-scale mx-auto block">
              Getting Started
            </Link>
          </div>
        )}
      </div>
    </section>
  </main>
}
