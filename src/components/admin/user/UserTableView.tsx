import React from 'react';
import {
  Edit,
  Eye,
  MoreVertical,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Lock
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

interface UserTableViewProps {
  users: User[];
  selectedUsers: Set<string>;
  onToggleUserSelection: (userId: string) => void;
  onSelectAllUsers: () => void;
  onUserClick: (user: User) => void;
  getStatusColor: (status: string) => StatusColor;
  getStatusIcon: (status: string) => React.ReactElement;
}

const UserTableView: React.FC<UserTableViewProps> = ({ 
  users, 
  selectedUsers, 
  onToggleUserSelection, 
  onSelectAllUsers, 
  onUserClick,
  getStatusColor,
  getStatusIcon 
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={onSelectAllUsers}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const statusColor = getStatusColor(user.status);
              const isSelected = selectedUsers.has(user.id);

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
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
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
                    <div className="text-sm text-gray-900">{user.role}</div>
                    <div className="text-sm text-gray-500">{user.department}</div>
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
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
                  </td>
                  <td 
                    className="px-6 py-4 text-sm text-gray-500 cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
                    {user.lastActive}
                  </td>
                  <td 
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-900">{user.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUserClick(user);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTableView;
  