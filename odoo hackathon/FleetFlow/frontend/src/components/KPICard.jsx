const KPICard = ({ title, value, icon, subtitle, colorClass = "text-orange-500 drop-shadow-[0_0_8px_rgba(255,94,0,0.8)]", bgClass = "bg-orange-500/10" }) => {
    return (
        <div className="bg-zinc-900/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(255,94,0,0.15),inset_0_1px_rgba(255,255,255,0.1)] transition-all duration-300 relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div className="z-10 relative">
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-4xl font-black text-white mt-2 tracking-tighter drop-shadow-md group-hover:text-orange-400 transition-colors">{value}</h3>
                    {subtitle && (
                        <p className="text-sm text-zinc-500 mt-1 font-medium tracking-wide">{subtitle}</p>
                    )}
                </div>
                <div className={`p-4 rounded-xl ${bgClass} text-opacity-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300 z-10 relative border border-orange-500/20`}>
                    <div className={colorClass}>
                        {icon}
                    </div>
                </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${bgClass} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
        </div>
    );
};

export default KPICard;
