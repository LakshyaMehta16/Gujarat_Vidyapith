import { useState, useContext } from 'react';
import { Truck, LogIn, Mail, Lock, User, UserPlus, FileText, Briefcase } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Fleet Manager');
    const [error, setError] = useState(null);
    const { login, register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isRegister) {
                await register(name, email, password, role);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform -rotate-6">
                        <Truck className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">FleetFlow</h1>
                    <p className="text-blue-200 mt-2 font-medium">Logistics Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium animate-in slide-in-from-top flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    {isRegister && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
                                <User size={16} /> Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:bg-white/10"
                                placeholder="John Doe"
                                required={isRegister}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:bg-white/10"
                            placeholder="you@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:bg-white/10"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {isRegister && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
                                    <Briefcase size={16} /> Role
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:bg-white/10 appearance-none"
                                    required={isRegister}
                                >
                                    <option value="Fleet Manager" className="text-slate-900">Fleet Manager</option>
                                    <option value="Dispatcher" className="text-slate-900">Dispatcher</option>
                                    <option value="Safety Officer" className="text-slate-900">Safety Officer</option>
                                    <option value="Financial Analyst" className="text-slate-900">Financial Analyst</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        {isRegister ? <><UserPlus size={20} /> Register</> : <><LogIn size={20} /> Sign In</>}
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-sm text-blue-300 hover:text-white transition-colors"
                        >
                            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
