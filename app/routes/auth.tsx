import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate, Link} from "react-router";

export const meta = () => ([
    { title: 'CVision | Authentication Hub' },
    { name: 'description', content: 'Secure neural pathway access' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1] || '/';
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 bg-cover min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse animation-delay-2000"></div>

            {/* Back to Home Button */}
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white/80 backdrop-blur-md border border-gray-200/50 transition-all duration-300 shadow-sm z-50 group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-xs font-black uppercase tracking-widest">Return</span>
            </Link>

            <div className="relative group w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-1000">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <section className="relative flex flex-col gap-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                    
                    {/* Header Logo & Badges */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-1 shadow-xl shadow-blue-600/30 mb-8 animate-in slide-in-from-top-4 duration-700">
                            <div className="w-full h-full bg-white rounded-[12px] flex items-center justify-center">
                                <div className="w-5 h-5 border-[3px] border-blue-600 rounded-sm"></div>
                            </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_#3b82f6]"></span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Secure Gateway</span>
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Initialize Protocol</h1>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed px-4">
                            Connect your Puter Identity to access the Neural Intelligence Audit architecture.
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="w-full border-t border-gray-100 pt-8">
                        {isLoading ? (
                            <button className="relative w-full overflow-hidden bg-gray-100 text-gray-400 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 cursor-wait">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                                Handshaking...
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button 
                                        className="relative w-full overflow-hidden bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black transition-all duration-500 uppercase tracking-widest text-[11px] shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5 group/btn" 
                                        onClick={auth.signOut}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Disconnect Matrix 
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        </span>
                                    </button>
                                ) : (
                                    <button 
                                        className="relative w-full overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black transition-all duration-500 uppercase tracking-widest text-[11px] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 group/btn" 
                                        onClick={auth.signIn}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Execute Login 
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                        </span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>

                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 flex justify-center items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Endpoints strictly protected by Puter.js
                </p>
            </div>
        </main>
    )
}

export default Auth
