import {Link} from "react-router";
import {usePuterStore} from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] w-full animate-in slide-in-from-top-4 fade-in duration-700 bg-white/40 backdrop-blur-xl border-b border-indigo-200/30 shadow-sm flex justify-center">
            <div className="w-full max-w-[1700px] px-8 h-20 flex items-center justify-between">
                
                {/* LOGO SECTION - Neural Core */}
                <Link to="/" className="flex items-center gap-5 group/logo">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        {/* THE EXTRAORDINARY NEURAL CORE */}
                        {/* Atmosphere Glow */}
                        <div className="absolute inset-[-4px] bg-blue-500/20 rounded-2xl blur-xl animate-pulse group-hover/logo:bg-blue-500/40 transition-all duration-1000"></div>
                        
                        {/* Outer Structural Shield */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(37,99,235,0.1)] group-hover/logo:scale-110 transition-transform duration-700"></div>
                        
                        {/* Rotating Prism Node */}
                        <div className="relative w-7 h-7 flex items-center justify-center animate-[spin_8s_linear_infinite]">
                            <svg className="w-full h-full text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="11" r="3" className="fill-blue-600 shadow-xl" />
                            </svg>
                        </div>
                        
                        {/* Synaptic Beams (Hover Effect) */}
                        <div className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-1000">
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <span className="text-3xl font-black tracking-[-0.08em] text-gray-900 leading-none">C</span>
                            {/* ULTRA STYLISH PRISM-SLASH V */}
                            <div className="relative w-10 h-10 mx-[-4px] flex items-center justify-center -translate-y-0.5">
                                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                                    {/* Main Indigo Stroke (The Base) */}
                                    <path d="M4 6L10 20" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" className="text-indigo-600" />
                                    {/* Razor Laser Slash (The Style) */}
                                    <path d="M7 20L18 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-blue-400 drop-shadow-[0_0_10px_#60a5fa]" />
                                    {/* Glow Detail */}
                                    <circle cx="10" cy="20" r="1.5" className="fill-blue-500 shadow-xl" />
                                </svg>
                            </div>
                            <span className="text-3xl font-black tracking-[-0.08em] text-gray-900 leading-none">ISION</span>
                        </div>
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.4em] mt-0.5 opacity-80">
                            Neural intelligence
                        </p>
                    </div>
                </Link>

                {/* CENTER STATUS - Structural */}
                <div className="hidden lg:flex items-center gap-3 px-5 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100/50 group/status">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover/status:text-blue-600 transition-colors">
                        Core System: <span className="text-gray-900">Operational</span>
                    </span>
                </div>

                {/* RIGHT ACTIONS - High Density */}
                <div className="flex items-center gap-6">
                    {auth.isAuthenticated && (
                        <button
                            onClick={() => auth.signOut()}
                            className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            Disconnect
                        </button>
                    )}
                    
                    <Link to="/upload" className="primary-button !py-3 !px-8 !text-xs !tracking-[0.2em] font-black uppercase rounded-2xl shadow-[0_8px_20px_-5px_rgba(37,99,235,0.4)]">
                        Initialize New Audit
                    </Link>
                </div>
                
            </div>
        </nav>
    )
}
export default Navbar
