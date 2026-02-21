import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        licensePlate: '',
        capacity: '',
        odometer: 0
    });
    const { user } = useContext(AuthContext);
    const canEdit = ['Fleet Manager'].includes(user?.role);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', {
                ...formData,
                capacity: Number(formData.capacity) || 0,
                odometer: Number(formData.odometer) || 0,
            });
            setIsModalOpen(false);
            setFormData({ name: '', model: '', licensePlate: '', capacity: '', odometer: 0 });
            fetchVehicles();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || 'Error adding vehicle';
            alert(`Failed to add vehicle: ${errMsg}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this vehicle?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                fetchVehicles();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'model', label: 'Model' },
        { key: 'licensePlate', label: 'License Plate' },
        { key: 'capacity', label: 'Capacity (kg)', render: (val) => val.toLocaleString() },
        { key: 'odometer', label: 'Odometer (km)', render: (val) => val.toLocaleString() },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
        ...(canEdit ? [{
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button onClick={() => handleDelete(row._id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                </button>
            )
        }] : [])
    ];

    if (loading) return <div>Loading vehicles...</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Fleet Vehicles</h1>
                {canEdit && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border border-orange-500/50 shadow-[0_0_15px_rgba(255,94,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Plus size={20} className="drop-shadow-md" /> Add Vehicle
                    </button>
                )}
            </div>
            <DataTable columns={columns} data={vehicles} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vehicle">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Vehicle Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. Truck Alpha" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Model</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. Volvo VNL" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">License Plate</label>
                        <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors uppercase" placeholder="e.g. ABC 1234" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Max Load Capacity (kg)</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Odometer (km)</label>
                            <input type="number" name="odometer" value={formData.odometer} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" />
                        </div>
                    </div>
                    <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white uppercase font-bold tracking-wider hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(255,94,0,0.5)] border border-orange-500 font-bold uppercase tracking-wider">Save Vehicle</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Vehicles;
