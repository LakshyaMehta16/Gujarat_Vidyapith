import { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { Truck, AlertTriangle, Activity, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [analyticsRes, vehiclesRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/vehicles')
            ]);
            setAnalytics(analyticsRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error("Dashboard data fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const vehicleColumns = [
        { key: 'name', label: 'Vehicle Name' },
        { key: 'licensePlate', label: 'License Plate' },
        { key: 'status', label: 'Status', render: (status) => <StatusBadge status={status} /> },
        { key: 'odometer', label: 'Odometer (km)', render: (val) => val.toLocaleString() },
    ];

    if (loading) return <div className="p-8 font-bold text-zinc-500 animate-pulse uppercase tracking-widest text-xl">Loading dashboard elements...</div>;

    // Calculate chart data from vehicles array
    const statusCounts = vehicles.reduce((acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(statusCounts).map(key => ({
        name: key, value: statusCounts[key]
    }));

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Overview</h1>
                    <p className="text-orange-500 mt-1 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_5px_rgba(255,94,0,0.5)]">Real-time logistics performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Active Fleet"
                    value={analytics?.activeFleetCount || 0}
                    icon={<Truck size={32} />}
                    subtitle="Vehicles currently on trip"
                    colorClass="text-blue-500"
                    bgClass="bg-blue-50"
                />
                <KPICard
                    title="Utilization"
                    value={analytics?.utilizationRate || "0%"}
                    icon={<Activity size={32} />}
                    subtitle="Fleet engaged efficiency"
                    colorClass="text-green-500"
                    bgClass="bg-green-50"
                />
                <KPICard
                    title="Maintenance"
                    value={analytics?.maintenanceAlertsCount || 0}
                    icon={<AlertTriangle size={32} />}
                    subtitle="Vehicles in shop"
                    colorClass="text-orange-500"
                    bgClass="bg-orange-50"
                />
                <KPICard
                    title="Avg Efficiency"
                    value={analytics?.fuelEfficiency || "0 km/l"}
                    icon={<DollarSign size={32} />}
                    subtitle="System wide fuel performance"
                    colorClass="text-indigo-500"
                    bgClass="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
                <div className="col-span-1 lg:col-span-1 bg-zinc-900/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 relative overflow-hidden">
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider relative z-10">Fleet Status Breakdown</h2>
                    <div className="h-64 relative z-10">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }} itemStyle={{ color: '#ff5e00' }} />
                                    <Legend wrapperStyle={{ color: '#a1a1aa', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 font-bold uppercase">No Vehicle Data</div>
                        )}
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 bg-zinc-900/90 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 rounded-full blur-3xl opacity-20"></div>
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Current Fleet Roster</h2>
                    <div className="relative z-10">
                        <DataTable columns={vehicleColumns} data={vehicles} />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
