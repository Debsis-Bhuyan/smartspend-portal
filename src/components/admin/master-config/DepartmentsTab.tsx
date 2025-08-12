import { Building2, Clock, Edit, Eye, Trash2, Users } from "lucide-react";
interface Department {
    id: string;
    name: string;
    code: string;
    head: string;
    location: string;
    extension: string;
    description: string;
    status: 'Active' | 'Inactive';
    operatingHours: { start: string; end: string };
    stats: { totalStaff: number; activePatients: number; bedCapacity: number };
}
const DepartmentsTab: React.FC<{
    departments: Department[];
    onEdit: (dept: Department) => void;
    onDelete: (id: string) => void;
    searchQuery: string;
}> = ({ departments, onEdit, onDelete, searchQuery }) => {
    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDepartments.map(dept => (
                <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                                <p className="text-sm text-gray-500">{dept.code}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${dept.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {dept.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Head: {dept.head}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Building2 className="h-4 w-4 mr-2" />
                                <span>{dept.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{dept.operatingHours.start} - {dept.operatingHours.end}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                                <div className="text-lg font-semibold text-blue-600">{dept.stats.totalStaff}</div>
                                <div className="text-xs text-gray-600">Staff</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                                <div className="text-lg font-semibold text-green-600">{dept.stats.activePatients}</div>
                                <div className="text-xs text-gray-600">Patients</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                                <div className="text-lg font-semibold text-purple-600">{dept.stats.bedCapacity}</div>
                                <div className="text-xs text-gray-600">Beds</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => onEdit(dept)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                <Eye className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(dept.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default DepartmentsTab;