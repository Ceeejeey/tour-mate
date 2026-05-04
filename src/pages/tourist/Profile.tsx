import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Globe, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Mock state for form fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    bio: user?.bio || 'I love traveling and exploring new cultures.',
  });

  // Store original values to track changes
  const [originalData, setOriginalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    bio: user?.bio || 'I love traveling and exploring new cultures.',
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationality: formData.nationality,
      bio: formData.bio,
    });
  };

  const getChangedFields = () => {
    const changes: string[] = [];
    const fieldLabels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      nationality: 'Nationality',
      bio: 'Bio'
    };

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof typeof formData;
      if (formData[fieldKey] !== originalData[fieldKey]) {
        changes.push(fieldLabels[fieldKey]);
      }
    });

    if (avatarFile) {
      changes.push('Profile Picture');
    }

    return changes;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const changedFields = getChangedFields();

    if (changedFields.length === 0) {
      toast('No changes detected', {
        icon: 'ℹ️',
        style: { background: '#eff6ff', color: '#1e40af', border: '1px solid #93c5fd' }
      });
      setIsSaving(false);
      setIsEditing(false);
      return;
    }

    try {
      const token = localStorage.getItem('tourmate_token');

      let updatedAvatarUrl = user?.avatar;

      if (avatarFile) {
        const imgData = new FormData();
        imgData.append('file', avatarFile);
        const avatarRes = await fetch('http://localhost:5066/api/users/me/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: imgData
        });

        if (avatarRes.ok) {
          const avatarData = await avatarRes.json();
          updatedAvatarUrl = avatarData.avatarUrl;
        } else {
          toast.error("Failed to upload profile picture");
        }
      }

      const response = await fetch('http://localhost:5066/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          nationality: formData.nationality,
          bio: formData.bio,
          avatar: updatedAvatarUrl
        })
      });

      if (response.ok) {
        setIsEditing(false);
        setAvatarFile(null);
        const updatedUser = {
          ...user,
          ...formData,
          avatar: updatedAvatarUrl
        };
        updateUser(updatedUser);

        // Show specific toast for each changed field
        changedFields.forEach((field, index) => {
          setTimeout(() => {
            toast.success(`${field} updated successfully!`, {
              style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }
            });
          }, index * 150);
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile', {
          style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' }
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile. Please try again.', {
        style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' }
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-forest-600/10"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <img
                src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-forest-600"
                >
                  <Camera size={16} />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={4}
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-medium hover:bg-forest-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="animate-spin h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
