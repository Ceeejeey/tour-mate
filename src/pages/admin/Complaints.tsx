import React, { useState } from 'react';
import { MOCK_COMPLAINTS } from '../../data/mockData';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatDate } from '../../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Complaints() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);

  const handleResolve = (id: string) => {
    setComplaints(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c)
    );
  };

  const handleDismiss = (id: string) => {
    setComplaints(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'dismissed' } : c)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Complaints & Disputes</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">From</th>
                <th className="px-6 py-3 font-medium">Against</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(complaint.date)}</td>
                  <td className="px-6 py-4 text-gray-600">#{complaint.bookingId.toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-600">Tourist {complaint.touristId}</td>
                  <td className="px-6 py-4 text-gray-600">Guide {complaint.guideId}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{complaint.reason}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {complaint.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleResolve(complaint.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Resolve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleDismiss(complaint.id)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          title="Dismiss"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
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
