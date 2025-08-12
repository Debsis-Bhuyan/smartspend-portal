import { Download, Edit, Trash2, Upload } from "lucide-react";
interface Rate {
    id: string;
    serviceName: string;
    category: string;
    baseRate: number;
    insuranceRate: number;
    emergencyRate: number;
    effectiveDate: string;
    status: 'Active' | 'Inactive';
}
const RatesTab: React.FC<{
    rates: Rate[];
    onEdit: (rate: Rate) => void;
    onDelete: (id: string) => void;
    searchQuery: string;
}> = ({ rates, onEdit, onDelete, searchQuery }) => {
    const filteredRates = rates.filter(rate =>
        rate.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Service Rates</h3>
                    <div className="flex space-x-2">
                        <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Upload className="h-4 w-4" />
                            <span>Import</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Base Rate</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Insurance Rate</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Emergency Rate</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRates.map(rate => (
                                <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{rate.serviceName}</td>
                                    <td className="py-3 px-4 text-gray-600">{rate.category}</td>
                                    <td className="py-3 px-4">${rate.baseRate}</td>
                                    <td className="py-3 px-4">${rate.insuranceRate}</td>
                                    <td className="py-3 px-4">${rate.emergencyRate}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${rate.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {rate.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEdit(rate)}
                                                className="p-1 text-gray-400 hover:text-blue-600"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(rate.id)}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default RatesTab;
