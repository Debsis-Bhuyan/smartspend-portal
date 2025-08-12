import { Activity, Bell, Calendar, Database, FileText, Heart, Shield, Stethoscope, User, UserCheck, Users } from 'lucide-react';
import { UserRole } from './type';
const ProfileTabs: React.FC<{ 
  activeTab: string; 
  onTabChange: (tab: string) => void; 
  userRole: UserRole;
}> = ({ activeTab, onTabChange, userRole }) => {
  const getTabsForRole = () => {
    const commonTabs = [
      { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
      { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
      { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
      { id: 'activity-logs', label: 'Activity Logs', icon: <FileText className="w-4 h-4" /> }
    ];

    const roleSpecificTabs = {
      user: [
        { id: 'medical', label: 'Medical', icon: <FileText className="w-4 h-4" /> },
        { id: 'care-team', label: 'Care Team', icon: <Users className="w-4 h-4" /> },
        { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
        { id: 'insurance', label: 'Insurance', icon: <Shield className="w-4 h-4" /> }
      ],
      admin: [
        { id: 'job-details', label: 'Job Details', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'system-access', label: 'System Access', icon: <Database className="w-4 h-4" /> },
        { id: 'management', label: 'Management', icon: <Users className="w-4 h-4" /> },
        { id: 'reports', label: 'Reports', icon: <Activity className="w-4 h-4" /> }
      ]
    };

    return [...commonTabs, ...roleSpecificTabs[userRole]];
  };

  const tabs = getTabsForRole();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto scrollbar-hide justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default ProfileTabs;