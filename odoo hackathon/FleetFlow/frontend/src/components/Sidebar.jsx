import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Map, Wrench, FileText, Users, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
        { name: 'Trips', path: '/trips', icon: <Map size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
        { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: ['Fleet Manager', 'Dispatcher'] },
        { name: 'Expenses', path: '/expenses', icon: <FileText size={20} />, roles: ['Fleet Manager', 'Financial Analyst'] },
        { name: 'Drivers', path: '/drivers', icon: <Users size={20} />, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
        { name: 'Analytics', path: '/analytics', icon: <LayoutDashboard size={20} />, roles: ['Fleet Manager', 'Financial Analyst'] },
    ];

    return (
        <div className="w-64 bg-zinc-950/95 backdrop-blur-md text-zinc-400 flex flex-col h-screen fixed top-0 left-0 border-r-4 border-zinc-400 shadow-[10px_0_30px_rgba(0,0,0,0.8)] z-50 relative overflow-hidden">
            {/* Silver Chain Accent */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#a1a1aa_5px,#a1a1aa_10px)] opacity-50 border-l border-zinc-600 shadow-inner mix-blend-screen pointer-events-none"></div>

            <div className="p-6 border-b border-zinc-800 flex items-center justify-center bg-zinc-900/80 shadow-[inset_0_-5px_15px_rgba(0,0,0,0.8)] relative z-10">
                <h1 className="text-2xl font-black text-white tracking-widest flex items-center gap-2 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <Truck className="text-orange-500 drop-shadow-[0_0_10px_rgba(255,94,0,0.8)]" size={28} /> FleetFlow
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4 relative z-10">
                <ul className="space-y-3 px-4">
                    {links.filter(link => user && link.roles.includes(user.role)).map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-[0_5px_15px_rgba(255,94,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)] border-orange-500/50 scale-105 translate-x-2 relative z-20' : 'border-transparent text-zinc-400 hover:bg-zinc-900/80 hover:text-white hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(200,200,200,0.1),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:scale-105 hover:translate-x-1'
                                    }`
                                }
                            >
                                <div className="p-1 rounded-lg bg-zinc-950/50 shadow-inner group-hover:text-orange-400 transition-colors">
                                    {link.icon}
                                </div>
                                <span className="font-bold tracking-wider uppercase text-sm drop-shadow-sm">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 relative z-10">
                <div className="mb-4 px-2">
                    <p className="text-sm font-black text-white tracking-wider truncate">{user?.email}</p>
                    <p className="text-xs text-orange-500 font-bold tracking-widest uppercase mt-1">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-gradient-to-r hover:from-red-900 hover:to-zinc-900 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.02)] hover:shadow-[0_5px_15px_rgba(255,0,0,0.3)] rounded-xl transition-all duration-300 uppercase font-black text-sm tracking-widest hover:scale-105"
                >
                    <LogOut size={18} className="drop-shadow-md" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
