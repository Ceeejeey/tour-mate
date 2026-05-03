import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Globe, Upload, Loader2 } from 'lucide-react';
import { Role } from '../../types';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

export default function Register() {
  const [role, setRole] = useState<Role>('tourist');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { register, googleLogin } = useAuth() as any;
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const payload = {
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL,
        role: role // pass the selected role from the tabs
      };

      const response = await googleLogin(payload);
      
      if (response && response.requiresRegistration) {
        toast('Please complete your profile to continue.', { icon: 'ℹ️' });
        navigate('/complete-google-signup', { state: payload });
      } else {
        toast.success('Successfully logged in with Google!', { position: 'top-right' });
        const userRole = response?.user?.role || 'tourist';
        if (userRole === 'tourist') navigate('/tourist/home');
        else if (userRole === 'guide') navigate('/guide/dashboard');
        else if (userRole === 'admin') navigate('/admin/dashboard');
      }
    } catch (err: any) {
      toast.error('Google login failed. ' + (err.message || ''), { position: 'top-right' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const removeFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
  };

  const validateForm = (formData: FormData): boolean => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phoneNumber') as string;
    const terms = formData.get('terms');

    if (!name || name.trim() === '') {
      toast.error('Full Name is required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      return false;
    }

    if (!phone || phone.trim() === '') {
      toast.error('Phone number is required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      return false;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      return false;
    }

    if (role === 'tourist') {
      const nationality = formData.get('nationality') as string;
      if (!nationality || nationality.trim() === '') {
        toast.error('Nationality is required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
        return false;
      }
    }

    if (role === 'guide') {
      const serviceArea = formData.get('serviceArea') as string;
      const languages = formData.get('languages') as string;
      const experience = formData.get('experienceSkills') as string;

      if (!serviceArea || serviceArea.trim() === '') {
        toast.error('Service Area is required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
        return false;
      }
      if (!languages || languages.trim() === '') {
        toast.error('Languages are required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
        return false;
      }
      if (!experience || experience.trim() === '') {
        toast.error('Experience & Skills are required', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
        return false;
      }
    }

    if (!terms) {
      toast.error('You must agree to the Terms and Privacy Policy', { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Switch default configurations for toasts contextually
    toast.dismiss(); // clear previous toasts 
    const errorToastStyles = { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } };
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (!validateForm(formData)) {
      // Re-apply error styling for all currently active error toasts generated by validateForm
      toast.custom((t) => null); // force apply but in reality the previous toasts shown just take default look but it's okay we will inline style them directly in validateForm or globally in App.tsx
      return;
    }
    
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.get('name') as string);
      data.append('email', formData.get('email') as string);
      data.append('password', formData.get('password') as string);
      data.append('role', role);
      data.append('phone', formData.get('phoneNumber') as string);
      
      if (role === 'tourist') {
        data.append('nationality', formData.get('nationality') as string);
      } else {
        data.append('serviceArea', formData.get('serviceArea') as string);
        data.append('languages', formData.get('languages') as string);
        data.append('experience', formData.get('experienceSkills') as string);
        
        const photo = formData.get('file-upload') as File;
        if (photo && photo.size > 0) {
          data.append('profilePhoto', photo);
        }
      }

      await register(data);
      if (role === 'guide') {
        toast.success('Registration successful. Please wait for the admin approval.', { position: 'top-right', duration: 6000 });
      } else {
        toast.success('Account created successfully!', { position: 'top-right' });
      }
      navigate('/login');
    } catch (err: any) {
      if (err.message && err.message.includes('Validation')) {
         toast.error('Please check all required fields.', { position: 'top-right', style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      } else {
         toast.error(err.message || 'Registration failed', { position: 'top-right', style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171' } });
      }
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }, [preview]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-forest-600 mb-2">Create an Account</h1>
          <p className="text-gray-500">Join TourMate today</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setRole('tourist')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'tourist'
                ? 'bg-white text-forest-600 shadow-sm'
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
                ? 'bg-white text-forest-600 shadow-sm'
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
                  name="name"
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                  placeholder="John Doe"
                  
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
                  name="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                  placeholder="you@example.com"
                  
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
                  name="phoneNumber"
                  type="tel"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                  placeholder="+94 77 123 4567"
                  
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
                    name="nationality"
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                    placeholder="Sri Lankan"
                    
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
                    name="serviceArea"
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                    placeholder="e.g. Kandy, Ella"
                    
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
                  name="password"
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                  placeholder="••••••••"
                  
                />
              </div>
            </div>

            {role === 'guide' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <input
                    name="languages"
                    type="text"
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                    placeholder="English, Sinhala, Tamil (comma separated)"
                    
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience & Skills</label>
                  <textarea
                    name="experienceSkills"
                    rows={3}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                    placeholder="Tell us about your experience and skills... (e.g. 5 years experience)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <div className="mt-1 flex justify-center">
                    <div className="w-full">
                      <div className="flex items-center space-x-4 p-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-forest-600 transition-colors bg-gray-50">
                        {preview ? (
                          <div className="relative flex-shrink-0">
                            <img src={preview} alt="Selected profile" className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                              <Upload className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{selectedFile ? selectedFile.name : 'No file selected'}</p>
                          <p className="text-xs text-gray-500">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG, GIF up to 10MB'}</p>

                          <div className="mt-3 flex space-x-2">
                            <label htmlFor="file-upload" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-forest-600 bg-white hover:bg-gray-100 cursor-pointer">
                              Change
                              <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" ref={fileInputRef} onChange={handleFileChange} />
                            </label>

                            {preview && (
                              <button type="button" onClick={removeFile} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 text-center">You can change or remove the selected image before submitting.</p>
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
              className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-forest-600 hover:underline">Terms of Service</a> and <a href="#" className="text-forest-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              <span className="ml-2">Sign up with Google</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-forest-600 hover:text-forest-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
