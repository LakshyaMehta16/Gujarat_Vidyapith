import { useState, useEffect } from 'react';
import api from '../api/axios';
import KPICard from '../components/KPICard';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [expensesHistory, setExpensesHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [analyticsRes, expensesRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/expenses')
                ]);
                setData(analyticsRes.data);

                // Process expenses history
                const sortedExpenses = expensesRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                const historyMap = {};
                sortedExpenses.forEach(e => {
                    const d = new Date(e.date).toLocaleDateString();
                    if (!historyMap[d]) historyMap[d] = { date: d, fuel: 0, maintenance: 0, total: 0 };
                    historyMap[d].fuel += (e.fuelCost || 0);
                    historyMap[d].maintenance += (e.maintenanceCost || 0);
                    historyMap[d].total += ((e.fuelCost || 0) + (e.maintenanceCost || 0));
                });
                setExpensesHistory(Object.values(historyMap));

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 font-bold text-zinc-500 animate-pulse uppercase tracking-widest text-xl">Loading comprehensive analytics...</div>;

    const chartData = data ? [
        {
            name: 'Financial Overview',
            Revenue: data.totalRevenue || 0,
            Expenses: data.totalExpenses || 0,
        }
    ] : [];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Analytics & ROI</h1>
                <p className="text-orange-500 mt-1 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_5px_rgba(255,94,0,0.5)]">Financial and operational breakdown.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Vehicle ROI"
                    value={data?.vehicleROI}
                    icon={<TrendingUp size={32} />}
                    subtitle="Estimated Return on Investment"
                    colorClass="text-green-500"
                    bgClass="bg-green-50"
                />
                <KPICard
                    title="Total Revenue"
                    value={`$${data?.totalRevenue?.toLocaleString()}`}
                    icon={<DollarSign size={32} />}
                    subtitle="Gross income from trips"
                    colorClass="text-blue-500"
                    bgClass="bg-blue-50"
                />
                <KPICard
                    title="Total Expenses"
                    value={`$${data?.totalExpenses?.toLocaleString()}`}
                    icon={<Activity size={32} />}
                    subtitle="Fuel and Maintenance"
                    colorClass="text-red-500"
                    bgClass="bg-red-50"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-zinc-900/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 rounded-full blur-3xl opacity-10"></div>
                    <h2 className="text-xl font-black text-white mb-8 uppercase tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Revenue vs Expenses</h2>
                    <div className="h-80 relative z-10">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                    <XAxis dataKey="name" stroke="#a1a1aa" tickFormatter={() => ''} />
                                    <YAxis stroke="#a1a1aa" tickFormatter={(val) => `$${val}`} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#27272a' }}
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ff5e00', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(255,94,0,0.2)' }}
                                    />
                                    <Legend wrapperStyle={{ fontWeight: 'bold', color: '#e4e4e7', paddingTop: '20px' }} />
                                    <Bar dataKey="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 font-bold uppercase">No Financial Data Available</div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-10"></div>
                    <h2 className="text-xl font-black text-white mb-8 uppercase tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Expenses History Over Time</h2>
                    <div className="h-80 relative z-10">
                        {expensesHistory.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={expensesHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                    <XAxis dataKey="date" stroke="#a1a1aa" />
                                    <YAxis stroke="#a1a1aa" tickFormatter={(val) => `$${val}`} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ff5e00', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(255,94,0,0.2)' }}
                                    />
                                    <Legend wrapperStyle={{ fontWeight: 'bold', color: '#e4e4e7', paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="fuel" stroke="#f59e0b" fillOpacity={1} fill="url(#colorFuel)" name="Fuel Costs" />
                                    <Area type="monotone" dataKey="maintenance" stroke="#ef4444" fillOpacity={1} fill="url(#colorMaint)" name="Maintenance Costs" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 font-bold uppercase">No Expense History Available</div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Analytics;
