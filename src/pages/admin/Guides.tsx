import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, CheckCircle, XCircle, X, Loader2, AlertCircle, Award } from 'lucide-react';
import { Guide } from '../../types';
import toast from 'react-hot-toast';

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/users/guides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      } else {
        setError('Failed to fetch guides');
      }
    } catch (error) {
      console.error('Failed to fetch guides', error);
      setError('Network error while loading guides');
    } finally {
      setIsLoading(false);
    }
  };

  const newestGuideIds = [...guides]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3)
    .map(g => g.id);

  const filteredGuides = guides
    .filter(guide =>
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return Number(b.id) - Number(a.id);
      if (sortBy === 'oldest') return Number(a.id) - Number(b.id);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const toggleVerification = async (id: string) => {
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch(`http://localhost:5066/api/users/guides/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGuides(guides.map(g => g.id === id ? { ...g, verified: data.verified } : g));
        if (selectedGuide && selectedGuide.id === id) {
          setSelectedGuide({ ...selectedGuide, verified: data.verified });
        }
        toast.success(data.message);
      } else {
        toast.error('Failed to update verification status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const toggleAvailability = (id: string) => {
    // Only guides can update availability from backend
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Guides Management</h1>
            <p className="text-forest-100 text-sm mt-1">Manage and verify tour guides on your platform</p>
          </div>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search guides by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-gray-700 outline-none cursor-pointer transition-all"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="name">Sort by: Name (A-Z)</option>
        </select>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 mb-4 text-red-400" />
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={fetchGuides}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading guides...</p>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No guides found</h3>
          <p className="text-gray-500">{searchTerm ? `No guides matching "${searchTerm}"` : "No guides registered yet."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guide</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Service Area</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGuides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-forest-100 shadow-sm"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {guide.name}
                            {newestGuideIds.includes(guide.id) && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-blue-200">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{guide.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <MapPin size={14} className="text-forest-500" /> {guide.serviceArea}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        {guide.rating?.toFixed(1)} <span className="text-gray-500 font-normal">({guide.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          guide.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => toggleAvailability(guide.id)}
                      >
                        {guide.isAvailable ? '●  Available' : '●  Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {guide.verified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><CheckCircle size={14} /> Verified</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"><XCircle size={14} /> Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedGuide(guide)}
                        aria-label={guide.verified ? 'View guide details' : 'Open guide approval modal'}
                        className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            guide.verified
                              ? 'bg-white border border-forest-600 text-forest-600 hover:bg-forest-50 hover:shadow-md'
                              : 'bg-forest-600 text-white hover:bg-forest-700 hover:shadow-lg'
                          }`}
                      >
                        {guide.verified ? 'View Details' : 'Approve Guide'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Guide Verification Panel</h2>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img 
                  src={selectedGuide.avatar || 'https://via.placeholder.com/150'} 
                  alt={selectedGuide.name}
                  className="w-32 h-32 rounded-xl object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedGuide.name}</h3>
                  <div className="text-gray-500 mb-4">{selectedGuide.email}</div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-forest-50 text-forest-700 rounded-full text-sm font-medium">
                      {selectedGuide.serviceArea}
                    </span>
                    {selectedGuide.verified ? (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Contact Info</h4>
                  <div className="space-y-2">
                    <p className="text-gray-900"><span className="font-medium">Phone:</span> {selectedGuide.phone || 'N/A'}</p>
                    <p className="text-gray-900"><span className="font-medium">Email:</span> {selectedGuide.email}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Experience & Skills</h4>
                  <div className="space-y-2">
                    <p className="text-gray-900"><span className="font-medium">Experience:</span> {selectedGuide.experience || 'N/A'}</p>
                    <div>
                      <span className="font-medium block text-gray-900 mb-1">Languages:</span> 
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(selectedGuide.languages) && selectedGuide.languages.length > 0 
                          ? selectedGuide.languages.map(lang => (
                              <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-sm">{lang}</span>
                            ))
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Bio</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedGuide.bio || 'No biography provided.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => toggleVerification(selectedGuide.id)}
                className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  selectedGuide.verified 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                    : 'bg-forest-600 text-white hover:bg-forest-700'
                }`}
              >
                {selectedGuide.verified ? (
                  <>Revoke Verification</>
                ) : (
                  <><CheckCircle size={18} /> Approve Guide</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
