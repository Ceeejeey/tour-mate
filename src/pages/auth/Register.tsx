import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Globe, Upload, Loader2 } from 'lucide-react';
import { Role } from '../../types';

export default function Register() {
  const [role, setRole] = useState<Role>('tourist');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login('newuser@example.com', role);
      setIsLoading(false);
      if (role === 'tourist') navigate('/tourist/home');
      else navigate('/guide/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E6B4A] mb-2">Create an Account</h1>
          <p className="text-gray-500">Join TourMate today</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setRole('tourist')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'tourist'
                ? 'bg-white text-[#1E6B4A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I'm a Tourist
          </button>
          <button
            type="button"
            onClick={() => setRole('guide')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'guide'
                ? 'bg-white text-[#1E6B4A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            I'm a Guide
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                  placeholder="John Doe"
                  required
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                  placeholder="you@example.com"
                  required
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                  placeholder="+94 77 123 4567"
                  required
                />
              </div>
            </div>

            {role === 'tourist' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                    placeholder="Sri Lankan"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                    placeholder="e.g. Kandy, Ella"
                    required
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {role === 'guide' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                    placeholder="English, Sinhala, Tamil (comma separated)"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience & Skills</label>
                  <textarea
                    rows={3}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                    placeholder="Tell us about your experience and skills..."
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#1E6B4A] transition-colors cursor-pointer bg-gray-50">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#1E6B4A] hover:text-[#165a3d] focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-[#1E6B4A] focus:ring-[#1E6B4A] border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-[#1E6B4A] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1E6B4A] hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1E6B4A] hover:bg-[#165a3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E6B4A] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#1E6B4A] hover:text-[#165a3d]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
