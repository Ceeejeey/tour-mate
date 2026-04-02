import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, CheckCircle, XCircle, X } from 'lucide-react';
import { Guide } from '../../types';
import toast from 'react-hot-toast';

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/users/guides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      }
    } catch (error) {
      console.error('Failed to fetch guides', error);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    // Only guides can update availability from backend, but kept for UI visual if needed
    // setGuides(guides.map(g => g.id === id ? { ...g, isAvailable: !g.isAvailable } : g));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guides Management</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Guide</th>
                <th className="px-6 py-3 font-medium">Service Area</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={guide.avatar}
                        alt={guide.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{guide.name}</div>
                        <div className="text-xs text-gray-500">{guide.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} /> {guide.serviceArea}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      {guide.rating} ({guide.reviewCount})
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        guide.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                      onClick={() => toggleAvailability(guide.id)}
                    >
                      {guide.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {guide.verified ? (
                        <CheckCircle size={20} className="text-blue-500" />
                      ) : (
                        <XCircle size={20} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      aria-label={guide.verified ? 'View guide details' : 'Open guide approval modal'}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition ${
                          guide.verified
                            ? 'bg-white border border-forest-600 text-forest-600 hover:bg-forest-50'
                            : 'bg-forest-600 text-white hover:bg-forest-700'
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
