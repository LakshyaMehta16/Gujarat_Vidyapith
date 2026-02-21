import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const DashboardLayout = () => {
    const location = useLocation();
    return (
        <div className="flex h-screen font-sans text-zinc-200 relative overflow-hidden">
            {/* Dark Graphic Background */}
            <div className="absolute inset-0 z-[-2] bg-zinc-950 pointer-events-none"></div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 overflow-y-auto w-full h-full relative z-0">
                {/* Top Navbar / Header optional */}
                <header className="bg-zinc-900/80 backdrop-blur-md px-8 py-5 border-b border-orange-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] sticky top-0 z-10 hidden md:flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-100 tracking-wide uppercase drop-shadow-sm">Module Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-700 shadow-[0_0_15px_rgba(255,94,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-orange-400/50 flex items-center justify-center text-white font-black text-lg">
                            {/* Generic Avatar */}
                            {/* <img src="https://i.pravatar.cc/150?u=admin" className="w-full h-full rounded-full border border-black" /> */}
                            FF
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 max-w-7xl mx-auto h-full">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
