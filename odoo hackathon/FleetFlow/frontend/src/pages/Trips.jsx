import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { Plus, CheckCircle } from 'lucide-react';
import Modal from '../components/Modal';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        driverId: '',
        cargoWeight: '',
        origin: '',
        destination: ''
    });

    const fetchData = async () => {
        try {
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                api.get('/trips'),
                api.get('/vehicles'),
                api.get('/drivers')
            ]);
            setTrips(tripsRes.data);
            setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
            setDrivers(driversRes.data.filter(d => d.status === 'On Duty'));
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
            await api.post('/trips', {
                ...formData,
                cargoWeight: Number(formData.cargoWeight)
            });
            setIsModalOpen(false);
            setFormData({ vehicleId: '', driverId: '', cargoWeight: '', origin: '', destination: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error creating trip');
        }
    };

    const handleComplete = async (id) => {
        if (window.confirm('Mark trip as completed?')) {
            try {
                await api.put(`/trips/${id}/complete`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const columns = [
        { key: 'vehicle', label: 'Vehicle', render: (_, row) => row.vehicleId?.name || 'N/A' },
        { key: 'driver', label: 'Driver', render: (_, row) => row.driverId?.name || 'N/A' },
        { key: 'origin', label: 'Origin' },
        { key: 'destination', label: 'Destination' },
        { key: 'cargoWeight', label: 'Cargo (kg)', render: (val) => val?.toLocaleString() },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => row.status !== 'Completed' ? (
                <button onClick={() => handleComplete(row._id)} className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors" title="Complete Trip">
                    <CheckCircle size={18} />
                </button>
            ) : null
        }
    ];

    if (loading) return <div>Loading trips...</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Dispatch & Trips</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border border-orange-500/50 shadow-[0_0_15px_rgba(255,94,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Plus size={20} className="drop-shadow-md" /> New Trip
                </button>
            </div>
            <DataTable columns={columns} data={trips} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dispatch New Trip">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Select Vehicle</label>
                        <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors">
                            <option value="" className="bg-zinc-900">-- Select Available Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id} className="bg-zinc-900">{v.name} (Capacity: {v.capacity}kg)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Select Driver</label>
                        <select name="driverId" value={formData.driverId} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors">
                            <option value="" className="bg-zinc-900">-- Select On-Duty Driver --</option>
                            {drivers.map(d => (
                                <option key={d._id} value={d._id} className="bg-zinc-900">{d.name} (License: {d.licenseNumber})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Cargo Weight (kg)</label>
                        <input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. 5000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Origin</label>
                            <input type="text" name="origin" value={formData.origin} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. Warehouse A" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Destination</label>
                            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. Store 12B" />
                        </div>
                    </div>
                    <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white uppercase font-bold tracking-wider hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(255,94,0,0.5)] border border-orange-500 font-bold uppercase tracking-wider">Dispatch Trip</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Trips;
