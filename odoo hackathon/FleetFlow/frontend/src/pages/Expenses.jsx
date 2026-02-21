import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { DollarSign } from 'lucide-react';
import Modal from '../components/Modal';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        fuelLiters: '',
        fuelCost: ''
    });

    const fetchData = async () => {
        try {
            const [expensesRes, vehiclesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            setExpenses(expensesRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', {
                ...formData,
                fuelLiters: Number(formData.fuelLiters),
                fuelCost: Number(formData.fuelCost)
            });
            setIsModalOpen(false);
            setFormData({ vehicleId: '', fuelLiters: '', fuelCost: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error tracking expense');
        }
    };

    const columns = [
        { key: 'vehicle', label: 'Vehicle', render: (_, row) => row.vehicleId?.name || 'N/A' },
        { key: 'fuelLiters', label: 'Fuel (L)' },
        { key: 'fuelCost', label: 'Fuel Cost ($)', render: (val) => val?.toLocaleString() },
        { key: 'maintenanceCost', label: 'Maintenance Cost ($)', render: (val) => val?.toLocaleString() },
        { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
        { key: 'total', label: 'Total ($)', render: (_, row) => ((row.fuelCost || 0) + (row.maintenanceCost || 0)).toLocaleString() }
    ];

    if (loading) return <div>Loading expenses...</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Expense Tracking</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border border-orange-500/50 shadow-[0_0_15px_rgba(255,94,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                    <DollarSign size={20} className="drop-shadow-md" /> Add Record
                </button>
            </div>
            <DataTable columns={columns} data={expenses} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Fuel Expense">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Select Vehicle</label>
                        <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors">
                            <option value="" className="bg-zinc-900">-- Choose a Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id} className="bg-zinc-900">{v.name} ({v.licensePlate})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Fuel Logged (Liters)</label>
                            <input type="number" name="fuelLiters" value={formData.fuelLiters} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. 150" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Cost ($)</label>
                            <input type="number" name="fuelCost" value={formData.fuelCost} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. 200" />
                        </div>
                    </div>
                    <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white uppercase font-bold tracking-wider hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(255,94,0,0.5)] border border-orange-500 font-bold uppercase tracking-wider">Save Record</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Expenses;
