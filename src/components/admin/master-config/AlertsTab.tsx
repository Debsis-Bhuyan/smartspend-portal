import { Edit, Trash2 } from "lucide-react";

interface Alert {
    id: string;
    name: string;
    description: string;
    type: 'System' | 'Patient' | 'Inventory' | 'Maintenance';
    triggerConditions: string;
    recipients: string[];
    deliveryMethods: string[];
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    active: boolean;
  }
const AlertsTab: React.FC<{
    alerts: Alert[];
    onEdit: (alert: Alert) => void;
    onDelete: (id: string) => void;
    searchQuery: string;
  }> = ({ alerts, onEdit, onDelete, searchQuery }) => {
    const filteredAlerts = alerts.filter(alert =>
      alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'Critical': return 'bg-red-100 text-red-800';
        case 'High': return 'bg-orange-100 text-orange-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${alert.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
  
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Type:</span>
                  <span className="text-gray-900">{alert.type}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Trigger:</span>
                  <span className="text-gray-900">{alert.triggerConditions}</span>
                </div>
                <div className="flex items-start text-sm">
                  <span className="text-gray-500 w-20 mt-0.5">Methods:</span>
                  <div className="flex flex-wrap gap-1">
                    {alert.deliveryMethods.map((method, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
  
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {alert.recipients.length} recipient{alert.recipients.length !== 1 ? 's' : ''}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(alert)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(alert.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
export default AlertsTab;