import { Heart, Shield, Stethoscope, User } from "lucide-react";
import { AdminProfile, DoctorProfile, NurseProfile, PatientProfile, UserProfile } from "./type";

const ProfileHeader: React.FC<{ user: UserProfile }> = ({ user }) => {
  const getRoleIcon = () => {
    switch (user.role) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'nurse': return <Heart className="w-5 h-5" />;
      case 'patient': return <User className="w-5 h-5" />;
      case 'admin': return <Shield className="w-5 h-5" />;
    }
  };

  const getRoleStats = () => {
    switch (user.role) {
      case 'doctor':
        const doctorUser = user as DoctorProfile;
        return [
          { label: 'Active Patients', value: doctorUser.patients.activePatients },
          { label: 'Satisfaction', value: `${doctorUser.patients.careStatistics.patientSatisfaction}/5` },
          { label: 'Experience', value: `${doctorUser.professionalInfo.experience} years` }
        ];
      case 'nurse':
        const nurseUser = user as NurseProfile;
        return [
          { label: 'Current Patients', value: nurseUser.assignments.patientCount },
          { label: 'Care Score', value: `${nurseUser.performance.patientCareScore}%` },
          { label: 'Ward', value: nurseUser.assignments.currentWard }
        ];
      case 'patient':
        const patientUser = user as PatientProfile;
        return [
          { label: 'Care Team', value: patientUser.currentCare.assignedProviders.length },
          { label: 'Upcoming Visits', value: patientUser.currentCare.upcomingAppointments.length },
          { label: 'Last Vitals', value: patientUser.vitals.lastUpdated }
        ];
      case 'admin':
        const adminUser = user as AdminProfile;
        return [
          { label: 'Team Size', value: adminUser.management.supervisedStaff },
          { label: 'Goal Progress', value: `${adminUser.performance.goalCompletion}%` },
          { label: 'Department', value: adminUser.jobInfo.department }
        ];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <img
            src={user.personalInfo.profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
            {getRoleIcon()}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.personalInfo.firstName} {user.personalInfo.lastName}
              </h1>
              <p className="text-lg text-blue-600 capitalize font-medium">{user.role}</p>
              <p className="text-gray-600">{user.personalInfo.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRoleStats().map((stat, index) => (
                <div key={index} className="text-center md:text-right">
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;