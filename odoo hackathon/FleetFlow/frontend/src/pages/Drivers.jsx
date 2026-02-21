import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { UserPlus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        licenseNumber: '',
        licenseExpiry: ''
    });
    const { user } = useContext(AuthContext);
    const canEdit = ['Fleet Manager', 'Safety Officer'].includes(user?.role);

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/drivers');
            setDrivers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Calculate age
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18) {
            alert('Driver must be at least 18 years old.');
            return;
        }

        try {
            await api.post('/drivers', formData);
            setIsModalOpen(false);
            setFormData({ name: '', dateOfBirth: '', licenseNumber: '', licenseExpiry: '' });
            fetchDrivers();
        } catch (error) {
            console.error(error);
            alert('Error adding driver');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            try {
                await api.delete(`/drivers/${id}`);
                fetchDrivers();
            } catch (err) {
                console.error(err);
                alert('Error deleting driver');
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'dateOfBirth', label: 'DOB', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        { key: 'licenseNumber', label: 'License Number' },
        { key: 'licenseExpiry', label: 'License Expiry', render: (val) => new Date(val).toLocaleDateString() },
        { key: 'safetyScore', label: 'Safety Score' },
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

    if (loading) return <div>Loading drivers...</div>;

    // Calculate max date for 18 years old
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Driver Profiles</h1>
                {canEdit && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border border-orange-500/50 shadow-[0_0_15px_rgba(255,94,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <UserPlus size={20} className="drop-shadow-md" /> Add Driver
                    </button>
                )}
            </div>
            <DataTable columns={columns} data={drivers} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Driver">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Driver Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} max={maxDateString} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">License Number</label>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors uppercase" placeholder="e.g. DL-123456" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">License Expiry Date</label>
                        <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} required className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-inner transition-colors [color-scheme:dark]" />
                    </div>
                    <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white uppercase font-bold tracking-wider hover:bg-zinc-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(255,94,0,0.5)] border border-orange-500 font-bold uppercase tracking-wider">Save Driver</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Drivers;
