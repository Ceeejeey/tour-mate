import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function CompleteGoogleSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const googleData = location.state as { email: string, name: string, avatarUrl: string, role?: string };
  const [role, setRole] = useState<Role>((googleData?.role as Role) || 'tourist');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [languagesList, setLanguagesList] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Removed duplicate googleData access
  if (!googleData) {
    // If accessed directly without Google login state
    navigate('/login');
    return null;
  }

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = languageInput.trim();
      if (val && !languagesList.some(l => l.toLowerCase() === val.toLowerCase())) {
        const formattedLang = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
        setLanguagesList([...languagesList, formattedLang]);
      }
      setLanguageInput('');
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setLanguagesList(languagesList.filter(lang => lang !== langToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === 'guide' && languagesList.length === 0) {
        toast.error('Please add at least one language.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', googleData.name || '');
      formData.append('email', googleData.email || '');
      formData.append('role', role);
      formData.append('phone', phone);
      // Dummy password since they use Google Login
      formData.append('password', 'GoogleLogin@12345'); 
      if (googleData.avatarUrl) {
        formData.append('avatarUrl', googleData.avatarUrl);
      }

      if (role === 'tourist') {
        formData.append('nationality', nationality);
      } else {
        formData.append('serviceArea', serviceArea);
        formData.append('languages', languagesList.join(','));
        formData.append('experience', experience);
      }

      await register(formData);
      
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed', { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex shadow-lg items-center justify-center p-4 bg-forest-50/30">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-forest-600 mb-2">Complete Profile</h1>
        <p className="text-gray-500 mb-6">You're almost there! We just need a few more details to set up your {role} account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            {(['tourist', 'guide'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                  role === r
                    ? 'bg-white text-forest-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-forest-500 focus:border-forest-500"
              required
            />
          </div>

          {role === 'tourist' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-forest-500 focus:border-forest-500"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area (City/Region)</label>
                <input
                  type="text"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-forest-500 focus:border-forest-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken (Press Enter to add)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {languagesList.map((lang, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800">
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-1.5 inline-flex items-center justify-center p-0.5 rounded-full text-forest-400 hover:bg-forest-200 hover:text-forest-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove {lang}</span>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={handleLanguageKeyDown}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-forest-500 focus:border-forest-500"
                  placeholder="Type a language and press Enter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-forest-500 focus:border-forest-500"
                  placeholder="e.g. 3 years"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto h-5 w-5" /> : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
