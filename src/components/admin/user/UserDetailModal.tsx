import React from 'react';
import {
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  Activity,
  Edit,
  Settings,
  Trash2,
  Star
} from 'lucide-react';
import { colors } from '@/src/theme';

interface UserType {
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

interface UserDetailModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  getStatusColor: (status: string) => StatusColor;
  getStatusIcon: (status: string) => React.ReactElement;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  getStatusColor, 
  getStatusIcon 
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - User Info */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl lg:text-5xl">{user.avatar}</div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-base lg:text-lg text-gray-600">{user.role}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border"
                      style={{
                        backgroundColor: getStatusColor(user.status).bg,
                        color: getStatusColor(user.status).text,
                        borderColor: getStatusColor(user.status).border
                      }}
                    >
                      {getStatusIcon(user.status)}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{user.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department & Role Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Department</h4>
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">{user.department}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Permissions</h4>
                  </div>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{user.permissions}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium">Last Active</h4>
                  </div>
                  <p className="text-sm font-bold text-purple-600">{user.lastActive}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                style={{ backgroundColor: colors.primary[600] }}
              >
                <Edit className="h-4 w-4" />
                Edit User
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Right Panel - Activity & Analytics */}
          <div className="w-full lg:w-80 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>

            {/* Activity Timeline */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Logged in</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Updated patient record</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Completed surgery</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Meeting attended</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance Metrics</h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Patient Satisfaction</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: colors.success[500], width: '98%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Task Completion</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: colors.primary[500], width: '94%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span className="font-medium">99%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: colors.success[500], width: '99%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-4 w-4" />
                  Send Message
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="h-4 w-4" />
                  Manage Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;