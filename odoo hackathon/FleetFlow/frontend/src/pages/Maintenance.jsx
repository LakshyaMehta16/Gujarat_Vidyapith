import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import api from '../api/axios';
import { Wrench } from 'lucide-react';
import Modal from '../components/Modal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Maintenance = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        cost: '',
        details: ''
    });
    const { user } = useContext(AuthContext);
    const canEdit = ['Fleet Manager'].includes(user?.role);

    const fetchData = async () => {
        try {
            const [expensesRes, vehiclesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            setExpenses(expensesRes.data.filter(e => e.maintenanceCost > 0));
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
            await api.post('/maintenance', {
                ...formData,
                cost: Number(formData.cost)
            });
            setIsModalOpen(false);
            setFormData({ vehicleId: '', cost: '', details: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error logging maintenance');
        }
    };

    const columns = [
        { key: 'vehicle', label: 'Vehicle', render: (_, row) => row.vehicleId?.name || 'N/A' },
        { key: 'maintenanceCost', label: 'Cost ($)', render: (val) => val?.toLocaleString() },
        { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
    ];

    if (loading) return <div>Loading records...</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Maintenance Logs</h1>
                {canEdit && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border border-orange-500/50 shadow-[0_0_15px_rgba(255,94,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Wrench size={20} className="drop-shadow-md" /> Log Maintenance
                    </button>
                )}
            </div>
            <DataTable columns={columns} data={expenses} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Vehicle Maintenance">
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
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Maintenance Cost ($)</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. 500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Service Details</label>
                        <textarea name="details" value={formData.details} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. Replaced front tires and oil change"></textarea>
                    </div>
                    <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white uppercase font-bold tracking-wider hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(255,94,0,0.5)] border border-orange-500 font-bold uppercase tracking-wider">Save Log</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;
