import { DoctorProfile, NurseProfile, PatientProfile, UserProfile } from "./type";

const RoleSpecificContent: React.FC<{ user: UserProfile; activeTab: string }> = ({ user, activeTab }) => {
    const renderCommonContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {user.activity.recentActions.map((action, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.action}</p>
                        <p className="text-xs text-gray-600">{action.details}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.authentication.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.authentication.sessionCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    <span className={`text-sm font-medium ${user.authentication.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {user.authentication.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        
        case 'personal':
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={user.personalInfo.firstName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={user.personalInfo.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.personalInfo.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={user.personalInfo.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={user.personalInfo.address}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>
  
              <h4 className="text-md font-semibold text-gray-900 mt-8 mb-4">Emergency Contacts</h4>
              <div className="space-y-4">
                {user.personalInfo.emergencyContacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input
                        type="text"
                        value={contact.relationship}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
  
        case 'security':
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.authentication.twoFactorEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.authentication.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
  
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Login History</h4>
                  <div className="space-y-3">
                    {user.activity.loginHistory.map((login, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{login.device}</p>
                          <p className="text-xs text-gray-600">{login.location}</p>
                        </div>
                        <span className="text-xs text-gray-500">{login.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
  
        case 'notifications':
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    user.preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      user.preferences.notifications.email ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    user.preferences.notifications.sms ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      user.preferences.notifications.sms ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    user.preferences.notifications.push ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      user.preferences.notifications.push ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>
          );
  
        case 'activity-logs':
          return (
            <div className="space-y-6">
              {/* Daily Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.activity.dailyStats.todayLogin}</div>
                  <div className="text-sm text-gray-600">First Login Today</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{user.activity.dailyStats.sessionsToday}</div>
                  <div className="text-sm text-gray-600">Sessions Today</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.activity.dailyStats.actionsToday}</div>
                  <div className="text-sm text-gray-600">Actions Today</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{user.activity.dailyStats.timeSpentToday}</div>
                  <div className="text-sm text-gray-600">Time Spent Today</div>
                </div>
              </div>
  
              {/* Recent Actions Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Actions</h3>
                <div className="space-y-3">
                  {user.activity.recentActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          action.status === 'completed' ? 'bg-green-500' : 
                          action.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{action.action}</p>
                          <p className="text-sm text-gray-600">{action.details}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              action.category === 'clinical' ? 'bg-blue-100 text-blue-800' :
                              action.category === 'administrative' ? 'bg-purple-100 text-purple-800' :
                              action.category === 'communication' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {action.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              action.status === 'completed' ? 'bg-green-100 text-green-800' :
                              action.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {action.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(action.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Detailed Platform Logs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Platform Activity</h3>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="all">All Modules</option>
                      <option value="clinical">Clinical Systems</option>
                      <option value="communication">Communication</option>
                      <option value="administrative">Administrative</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Search activities..." 
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm w-48"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {user.activity.platformLogs.map((log, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">{log.action.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-blue-600">{log.module}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
                          {log.duration && (
                            <p className="text-xs text-gray-500">Duration: {log.duration}</p>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          IP: {log.ipAddress}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {log.userAgent.split('/')[0]}
                        </span>
                        {log.affectedRecords && log.affectedRecords.length > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Records: {log.affectedRecords.length}
                          </span>
                        )}
                      </div>
                      
                      {log.affectedRecords && log.affectedRecords.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                            View affected records ({log.affectedRecords.length})
                          </summary>
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            {log.affectedRecords.map((record, recordIndex) => (
                              <div key={recordIndex} className="text-xs text-gray-600 font-mono">
                                {record}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Login History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Login History</h3>
                <div className="space-y-3">
                  {user.activity.loginHistory.map((login, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          login.device === 'Desktop' ? 'bg-blue-100 text-blue-600' :
                          login.device === 'Mobile' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {login.device === 'Desktop' ? '🖥️' : login.device === 'Mobile' ? '📱' : '📱'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{login.device}</p>
                          <p className="text-sm text-gray-600">{login.location}</p>
                          <p className="text-xs text-gray-500">IP: {login.ipAddress}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{login.date}</p>
                        <p className="text-xs text-gray-600">Session: {login.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    const renderRoleSpecificContent = () => {
      switch (user.role) {
        case 'doctor':
          const doctorUser = user as DoctorProfile;
          switch (activeTab) {
            case 'professional':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical License</label>
                      <input
                        type="text"
                        value={doctorUser.professionalInfo.medicalLicense}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
                      <input
                        type="text"
                        value={doctorUser.professionalInfo.licenseExpiry}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctorUser.professionalInfo.specializations.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {doctorUser.professionalInfo.certifications.map((cert, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
  
            case 'patients':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{doctorUser.patients.totalPatients}</div>
                      <div className="text-sm text-gray-600">Total Patients</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{doctorUser.patients.activePatients}</div>
                      <div className="text-sm text-gray-600">Active Patients</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{doctorUser.patients.careStatistics.treatmentSuccessRate}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              );
  
            case 'schedule':
              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Schedule</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Availability</h4>
                        <div className="space-y-3">
                          {doctorUser.schedule.availability.map((slot, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="font-medium text-blue-900">{slot.day}</span>
                              <div className="text-right">
                                <div className="text-sm font-medium text-blue-800">{slot.startTime} - {slot.endTime}</div>
                                <div className="text-xs text-blue-600">{slot.location}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Today's Appointments</h4>
                        <div className="space-y-3">
                          {doctorUser.schedule.upcomingAppointments.map((appointment, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <div>
                                <div className="font-medium text-green-900">{appointment.patient}</div>
                                <div className="text-sm text-green-700">{appointment.type}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-800">{appointment.time}</div>
                                <div className="text-xs text-green-600">{appointment.duration} min</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{doctorUser.schedule.weeklyHours}</div>
                        <div className="text-sm text-gray-600">Hours This Week</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{doctorUser.schedule.vacationDays}</div>
                        <div className="text-sm text-gray-600">Vacation Days Left</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{doctorUser.schedule.onCallDuties.length}</div>
                        <div className="text-sm text-gray-600">On-Call Duties</div>
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">On-Call Duties</h3>
                    <div className="space-y-3">
                      {doctorUser.schedule.onCallDuties.map((duty, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{duty.shift}</div>
                            <div className="text-sm text-gray-600">{duty.department}</div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{duty.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
  
            case 'performance':
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">{doctorUser.performance.patientSatisfactionScore}</div>
                      <div className="text-sm text-gray-600">Patient Satisfaction</div>
                      <div className="text-xs text-gray-500">out of 5.0</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{doctorUser.performance.treatmentSuccessRate}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                      <div className="text-xs text-gray-500">treatment outcomes</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600">{doctorUser.performance.averageConsultationTime}</div>
                      <div className="text-sm text-gray-600">Avg Consultation</div>
                      <div className="text-xs text-gray-500">minutes</div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance Trends</h3>
                    <div className="space-y-4">
                      {doctorUser.performance.monthlyMetrics.map((metric, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">{metric.month}</div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{metric.patientsSeenk}</div>
                            <div className="text-xs text-gray-600">Patients</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{metric.satisfaction}</div>
                            <div className="text-xs text-gray-600">Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{metric.efficiency}%</div>
                            <div className="text-xs text-gray-600">Efficiency</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Goals</h3>
                      <div className="space-y-4">
                        {doctorUser.performance.goals.map((goal, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{goal.title}</span>
                              <span className="text-sm text-gray-600">Due: {goal.deadline}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {goal.current}/{goal.target}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Feedback</h3>
                      <div className="space-y-4">
                        {doctorUser.performance.feedback.map((feedback, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900">{feedback.source}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{feedback.comment}</p>
                            <span className="text-xs text-gray-500">{feedback.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
  
            default:
              return renderCommonContent();
          }
  
        case 'nurse':
          const nurseUser = user as NurseProfile;
          switch (activeTab) {
            case 'professional':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nursing License</label>
                      <input
                        type="text"
                        value={nurseUser.nursingInfo.nursingLicense}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
                      <input
                        type="text"
                        value={nurseUser.nursingInfo.licenseExpiry}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {nurseUser.nursingInfo.specializations.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {nurseUser.nursingInfo.certifications.map((cert, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-800">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Training Records</h4>
                    <div className="space-y-3">
                      {nurseUser.skills.trainingRecords.map((training, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{training.course}</div>
                              <div className="text-sm text-gray-600">Completed: {training.completedDate}</div>
                            </div>
                            <div className="text-sm text-gray-600">Expires: {training.expiryDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
  
            case 'schedule':
              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Shift Schedule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{nurseUser.schedule.hoursThisWeek}</div>
                        <div className="text-sm text-gray-600">Hours This Week</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{nurseUser.schedule.hoursThisMonth}</div>
                        <div className="text-sm text-gray-600">Hours This Month</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{nurseUser.schedule.overtimeHours}</div>
                        <div className="text-sm text-gray-600">Overtime Hours</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{nurseUser.schedule.vacationDays}</div>
                        <div className="text-sm text-gray-600">Vacation Days</div>
                      </div>
                    </div>
  
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Upcoming Shifts</h4>
                      <div className="space-y-3">
                        {nurseUser.schedule.currentShifts.map((shift, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{shift.date}</div>
                              <div className="text-sm text-gray-600">{shift.ward}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{shift.startTime} - {shift.endTime}</div>
                              <div className="text-xs text-gray-600">{shift.patients} patients assigned</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Next Shift Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Shift Information</h4>
                        <div className="space-y-1 text-sm text-blue-800">
                          <div>Date: {nurseUser.schedule.nextShift.date}</div>
                          <div>Time: {nurseUser.schedule.nextShift.startTime} - {nurseUser.schedule.nextShift.endTime}</div>
                          <div>Location: {nurseUser.schedule.nextShift.ward}</div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Current Assignment</h4>
                        <div className="space-y-1 text-sm text-green-800">
                          <div>Ward: {nurseUser.assignments.currentWard}</div>
                          <div>Patients: {nurseUser.assignments.patientCount}</div>
                          <div>Supervisor: {nurseUser.assignments.supervisor}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
  
            case 'assignments':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Assignments</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-medium text-pink-900 mb-2">Ward Assignment</h4>
                      <div className="text-2xl font-bold text-pink-600">{nurseUser.assignments.currentWard}</div>
                      <div className="text-sm text-pink-700">{nurseUser.assignments.patientCount} patients assigned</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Supervisor</h4>
                      <div className="text-lg font-bold text-blue-600">{nurseUser.assignments.supervisor}</div>
                      <div className="text-sm text-blue-700">Direct Report</div>
                    </div>
                  </div>
  
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Responsibilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {nurseUser.assignments.responsibilities.map((responsibility, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Clinical Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {nurseUser.skills.clinicalCompetencies.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
  
            case 'performance':
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-pink-600">{nurseUser.performance.patientCareScore}%</div>
                      <div className="text-sm text-gray-600">Patient Care Score</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{nurseUser.performance.medicationAccuracy}%</div>
                      <div className="text-sm text-gray-600">Medication Accuracy</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">{nurseUser.performance.shiftCompletionRate}%</div>
                      <div className="text-sm text-gray-600">Shift Completion</div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Performance</h3>
                    <div className="space-y-4">
                      {nurseUser.performance.monthlyMetrics.map((metric, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">{metric.month}</div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-pink-600">{metric.patientsCarescore}%</div>
                            <div className="text-xs text-gray-600">Care Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{metric.medicationAccuracy}%</div>
                            <div className="text-xs text-gray-600">Med Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{metric.incidentReports}</div>
                            <div className="text-xs text-gray-600">Incidents</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Goals</h3>
                      <div className="space-y-4">
                        {nurseUser.performance.goals.map((goal, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{goal.title}</span>
                              <span className="text-sm text-gray-600">Due: {goal.deadline}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-pink-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {goal.current}/{goal.target}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Evaluations</h3>
                      <div className="space-y-4">
                        {nurseUser.performance.recentEvaluations.map((evaluation, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900">{evaluation.evaluator}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < evaluation.score ? 'text-yellow-400' : 'text-gray-300'}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{evaluation.feedback}</p>
                            <span className="text-xs text-gray-500">{evaluation.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
  
            default:
              return renderCommonContent();
          }
  
        case 'patient':
          const patientUser = user as PatientProfile;
          switch (activeTab) {
            case 'medical':
              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical History</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Current Conditions</h4>
                        <div className="space-y-2">
                          {patientUser.medicalHistory.conditions.map((condition, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg">
                              <span className="text-sm font-medium text-red-800">{condition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
  
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Allergies</h4>
                        <div className="space-y-2">
                          {patientUser.medicalHistory.allergies.map((allergy, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                              <span className="text-sm font-medium text-yellow-800">{allergy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
  
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Current Medications</h4>
                      <div className="space-y-3">
                        {patientUser.medicalHistory.medications.map((med, index) => (
                          <div key={index} className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-blue-900">{med.name}</p>
                                <p className="text-sm text-blue-700">{med.dosage} - {med.frequency}</p>
                              </div>
                              <span className="text-xs text-blue-600">Prescribed by {med.prescribedBy}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Vitals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{patientUser.vitals.bloodPressure}</div>
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{patientUser.vitals.heartRate}</div>
                        <div className="text-sm text-gray-600">Heart Rate</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{patientUser.vitals.temperature}°F</div>
                        <div className="text-sm text-gray-600">Temperature</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{patientUser.vitals.weight} lbs</div>
                        <div className="text-sm text-gray-600">Weight</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Last updated: {patientUser.vitals.lastUpdated}</p>
                  </div>
                </div>
              );
  
            case 'care-team':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Care Team</h3>
                  <div className="space-y-4">
                    {patientUser.currentCare.assignedProviders.map((provider, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{provider.name}</h4>
                            <p className="text-sm text-gray-600">{provider.role}</p>
                            <p className="text-sm text-blue-600">{provider.specialty}</p>
                          </div>
                          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200">
                            Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
  
            case 'appointments':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Appointments</h3>
                  <div className="space-y-4">
                    {patientUser.currentCare.upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                            <p className="text-sm text-gray-600">with {appointment.provider}</p>
                            <p className="text-sm text-blue-600">{appointment.date}</p>
                          </div>
                          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
  
            case 'insurance':
              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                      <input
                        type="text"
                        value={patientUser.insurance.provider}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                      <input
                        type="text"
                        value={patientUser.insurance.policyNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                      <input
                        type="text"
                        value={patientUser.insurance.groupNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Type</label>
                      <input
                        type="text"
                        value={patientUser.insurance.coverageType}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Copay</label>
                      <input
                        type="text"
                        value={`$${patientUser.insurance.copay}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              );
  
            default:
              return renderCommonContent();
          }
  
        default:
          return renderCommonContent();
      }
    };
  
    return renderRoleSpecificContent();
  };

  export default RoleSpecificContent;