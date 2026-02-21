const StatusBadge = ({ status }) => {
    const getStatusColor = (s) => {
        switch (s) {
            case 'Available':
            case 'Completed':
            case 'On Duty':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'On Trip':
            case 'Dispatched':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Shop':
            case 'Draft':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Suspended':
            case 'Retired':
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)} shadow-sm`}>
            {status}
        </span>
    );
};

export default StatusBadge;
