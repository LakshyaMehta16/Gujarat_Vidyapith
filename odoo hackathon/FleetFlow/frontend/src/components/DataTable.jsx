import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const DataTable = ({ columns, data, searchable = true }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(null);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = data.filter((item) =>
        Object.values(item).some(
            (val) => String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
    });

    return (
        <div className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.05)] border border-zinc-800 overflow-hidden">
            {searchable && (
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500/70" size={18} />
                        <input
                            type="text"
                            placeholder="Search data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-950 border-b border-zinc-800">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-sm font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-900 transition-colors"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {sortConfig?.key === col.key && (
                                            sortConfig.direction === 'ascending'
                                                ? <ChevronUp size={14} className="text-orange-500 drop-shadow-[0_0_5px_rgba(255,94,0,0.5)]" />
                                                : <ChevronDown size={14} className="text-orange-500 drop-shadow-[0_0_5px_rgba(255,94,0,0.5)]" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {sortedData.length > 0 ? (
                            sortedData.map((row, i) => (
                                <tr key={row._id || i} className="hover:bg-zinc-800/80 transition-colors group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-zinc-300 whitespace-nowrap group-hover:text-zinc-100 transition-colors">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500 font-medium">
                                    No Data Found in Database
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
