import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Languages, Award, Upload, Camera } from 'lucide-react';
import { Guide } from '../../types';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock state for form fields - casting user to Guide for demo purposes
  // In a real app, we'd have proper type guards
  const guideUser = user as Guide;
  
  const [formData, setFormData] = useState({
    name: guideUser?.name || '',
    email: guideUser?.email || '',
    phone: guideUser?.phone || '',
    serviceArea: guideUser?.serviceArea || '',
    languages: guideUser?.languages?.join(', ') || '',
    experience: guideUser?.experience || '',
    bio: guideUser?.bio || '',
    pricePerDay: guideUser?.pricePerDay || 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Update logic
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guide Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#1E6B4A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#165a3d] transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-[#1E6B4A]/10"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-8">
            <div className="relative inline-block">
              <img
                src={guideUser?.avatar || `https://ui-avatars.com/api/?name=${guideUser?.name}`}
                alt={guideUser?.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#1E6B4A]">
                  <Camera size={16} />
                </button>
              )}
            </div>
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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.serviceArea}
                    onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location Settings</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Set your location to appear in the "Nearby Guides" map for tourists.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={guideUser?.latitude || ''}
                        disabled
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="7.2906"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={guideUser?.longitude || ''}
                        disabled
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                        placeholder="80.6337"
                      />
                    </div>
                  </div>
                  <button type="button" className="mt-3 text-xs text-[#1E6B4A] font-medium hover:underline">
                    Use my current location
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Languages className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.languages}
                    onChange={(e) => setFormData({...formData, languages: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Day ($)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({...formData, pricePerDay: parseInt(e.target.value)})}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E6B4A] text-white rounded-lg text-sm font-medium hover:bg-[#165a3d]"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
