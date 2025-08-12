import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Eye, EyeOff, Camera, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';
interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profileImage: string | null;
    joinedDate: string;
    lastLogin: string;
}

interface EditFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordVisibility {
    current: boolean;
    new: boolean;
    confirm: boolean;
}

interface MessageState {
    type: '' | 'success' | 'error';
    text: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<UserProfile>({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        dateOfBirth: '1990-05-15',
        profileImage: null,
        joinedDate: '2024-01-15',
        lastLogin: '2024-08-10T14:30:00Z'
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<Partial<EditFormData>>({});
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState<PasswordVisibility>({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

    useEffect(() => {
        // Initialize edit form with user data when editing starts
        if (isEditing) {
            setEditForm({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                dateOfBirth: user.dateOfBirth
            });
        }
    }, [isEditing, user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setMessage({ type: '', text: '' });
    };

    const handleInputChange = (field: keyof EditFormData, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data
            setUser(prev => ({
                ...prev,
                ...editForm
            }));

            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update password. Please check your current password.' });
        }
        setLoading(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setUser(prev => ({
                        ...prev,
                        profileImage: result,
                    }));
                    setMessage({ type: 'success', text: 'Profile image updated!' });
                } else {
                    setMessage({ type: 'error', text: 'Failed to load image.' });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                {/* Message Display */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto">
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                                        )}
                                    </div>
                                    <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Camera className="w-4 h-4 text-gray-600" />
                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                                <p className="text-gray-600 mb-4">{user.email}</p>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {formatDate(user.joinedDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        <span>Last login: {formatDateTime(user.lastLogin)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Personal Information
                                    </h3>
                                    <button
                                        onClick={handleEditToggle}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.firstName || ''}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{user.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.lastName || ''}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{user.lastName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editForm.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{user.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editForm.phone || ''}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{user.phone}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Address
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{user.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editForm.dateOfBirth || ''}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{formatDate(user.dateOfBirth)}</p>
                                        )}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white rounded-xl shadow-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Security Settings
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <button
                                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>

                                {showPasswordForm && (
                                    <div className="border-t pt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.current ? "text" : "password"}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility('current')}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.new ? "text" : "password"}
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility('new')}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPasswords.confirm ? "text" : "password"}
                                                        value={passwordForm.confirmPassword}
                                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePasswordVisibility('confirm')}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handlePasswordUpdate}
                                                    disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {loading ? 'Updating...' : 'Update Password'}
                                                </button>
                                                <button
                                                    onClick={() => setShowPasswordForm(false)}
                                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;