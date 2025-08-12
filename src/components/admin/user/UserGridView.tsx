import React from 'react';
import {
  MoreVertical,
  Edit,
  Mail,
  Phone,
  MapPin,
  Star,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar: string;
  joinDate: string;
  lastActive: string;
  location: string;
  permissions: number;
  rating: number;
}

interface StatusColor {
  bg: string;
  text: string;
  border: string;
}

interface UserGridViewProps {
  users: User[];
  selectedUsers: Set<string>;
  onToggleUserSelection: (userId: string) => void;
  onUserClick: (user: User) => void;
  getStatusColor: (status: string) => StatusColor;
  getStatusIcon: (status: string) => React.ReactElement;
}

const UserGridView: React.FC<UserGridViewProps> = ({ 
  users, 
  selectedUsers, 
  onToggleUserSelection, 
  onUserClick,
  getStatusColor,
  getStatusIcon 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map((user) => {
        const statusColor = getStatusColor(user.status);
        const isSelected = selectedUsers.has(user.id);

        return (
          <div
            key={user.id}
            className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => onUserClick(user)}
                >
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleUserSelection(user.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border"
                  style={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    borderColor: statusColor.border
                  }}
                >
                  {getStatusIcon(user.status)}
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{user.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Department</span>
                  <span className="font-medium">{user.department}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Permissions</span>
                  <span className="font-medium">{user.permissions}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Last Active</span>
                  <span className="font-medium">{user.lastActive}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => onUserClick(user)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserGridView;