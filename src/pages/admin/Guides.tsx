import React, { useState } from 'react';
import { MOCK_GUIDES } from '../../data/mockData';
import { Search, MapPin, Star, CheckCircle, XCircle } from 'lucide-react';
import { Guide } from '../../types';

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [guides, setGuides] = useState<Guide[]>(MOCK_GUIDES);

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVerification = (id: string) => {
    setGuides(guides.map(g => g.id === id ? { ...g, verified: !g.verified } : g));
  };

  const toggleAvailability = (id: string) => {
    setGuides(guides.map(g => g.id === id ? { ...g, isAvailable: !g.isAvailable } : g));
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
                    <button onClick={() => toggleVerification(guide.id)}>
                      {guide.verified ? (
                        <CheckCircle size={20} className="text-blue-500" />
                      ) : (
                        <XCircle size={20} className="text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-forest-600 hover:underline font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
