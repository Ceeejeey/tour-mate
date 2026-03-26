import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Languages, Award, Upload, Camera, Navigation, Loader2 } from 'lucide-react';
import { Guide } from '../../types';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    pricePerSession: guideUser?.pricePerSession || 50,
  });

  const [isAvailable, setIsAvailable] = useState(guideUser?.isAvailable ?? true);
  const [latitude, setLatitude] = useState<number | null>(guideUser?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(guideUser?.longitude || null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Store original values to track changes
  const [originalData, setOriginalData] = useState({
    name: guideUser?.name || '',
    email: guideUser?.email || '',
    phone: guideUser?.phone || '',
    serviceArea: guideUser?.serviceArea || '',
    languages: guideUser?.languages?.join(', ') || '',
    experience: guideUser?.experience || '',
    bio: guideUser?.bio || '',
    pricePerSession: guideUser?.pricePerSession || 50,
    isAvailable: guideUser?.isAvailable ?? true,
    latitude: guideUser?.latitude || null,
    longitude: guideUser?.longitude || null,
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceArea: formData.serviceArea,
      languages: formData.languages,
      experience: formData.experience,
      bio: formData.bio,
      pricePerSession: formData.pricePerSession,
      isAvailable,
      latitude,
      longitude,
    });
  };

  const getChangedFields = () => {
    const changes: string[] = [];
    const fieldLabels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      serviceArea: 'Service area',
      languages: 'Languages',
      experience: 'Experience',
      bio: 'Bio',
      pricePerSession: 'Price per session',
      isAvailable: 'Availability status',
      latitude: 'Location',
      longitude: 'Location'
    };

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof typeof formData;
      if (formData[fieldKey] !== originalData[fieldKey]) {
        changes.push(fieldLabels[fieldKey]);
      }
    });

    if (isAvailable !== originalData.isAvailable && !changes.includes('Availability status')) {
      changes.push('Availability status');
    }

    if ((latitude !== originalData.latitude || longitude !== originalData.longitude) && !changes.includes('Location')) {
      changes.push('Location');
    }

    // Remove duplicates
    return [...new Set(changes)];
  };

  const handleAvailabilityToggle = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    if (newStatus) {
      toast.success('Availability status set to Available', {
        style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }
      });
    } else {
      toast('Availability status set to Unavailable', {
        icon: '⏸️',
        style: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }
      });
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
      const response = await fetch('http://localhost:5066/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          isAvailable,
          latitude,
          longitude
        })
      });

      if (response.ok) {
        setIsEditing(false);
        const updatedUser = {
          ...guideUser,
          ...formData,
          languages: formData.languages.split(',').map((s: string)=>s.trim()),
          isAvailable, latitude, longitude
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by your browser.';
      setLocationError(error);
      toast.error(error, {
        style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' }
      });
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
        toast.success('Location retrieved successfully!', {
          style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }
        });
      },
      () => {
        const error = 'Unable to retrieve your location. Please check your browser permissions.';
        setLocationError(error);
        setIsLocating(false);
        toast.error(error, {
          style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' }
        });
      }
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guide Profile</h1>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="bg-forest-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-forest-600/10"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-8">
            <div className="relative inline-block">
              <img
                src={guideUser?.avatar || `https://ui-avatars.com/api/?name=${guideUser?.name}`}
                alt={guideUser?.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-forest-600">
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Availability & Location Settings - always visible */}
            <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-5">
              {/* Availability Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Availability Status</h3>
                  <p className="text-xs text-gray-500 mt-0.5">When available, tourists can find and book you instantly.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAvailabilityToggle}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      isAvailable ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                        isAvailable ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Location Settings */}
              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Current Location</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Set your location to appear on the "Nearby Guides" map for tourists.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-50"
                  >
                    {isLocating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Navigation size={16} />
                    )}
                    {isLocating ? 'Locating...' : 'Use My Current Location'}
                  </button>
                </div>

                {locationError && (
                  <p className="text-xs text-red-500 mb-3">{locationError}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude ?? ''}
                      onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-forest-500 focus:border-forest-600"
                      placeholder="7.2906"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude ?? ''}
                      onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-forest-500 focus:border-forest-600"
                      placeholder="80.6337"
                    />
                  </div>
                </div>

                {latitude && longitude && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                    <MapPin size={12} />
                    <span>Location set: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

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
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Session ($)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.pricePerSession}
                  onChange={(e) => setFormData({...formData, pricePerSession: parseInt(e.target.value)})}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 disabled:bg-gray-50 disabled:text-gray-500"
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
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
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
