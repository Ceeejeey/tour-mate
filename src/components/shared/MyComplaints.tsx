import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../lib/utils';
import { AlertTriangle, Loader2, AlertCircle, Search, MessageSquareX, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Complaint {
  id: number;
  bookingId: number;
  date: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  adminNote?: string;
}

interface Booking {
  id: number;
  bookingDate: string;
  guide?: { name: string };
  tourist?: { name: string };
}

export default function MyComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newComplaintBookingId, setNewComplaintBookingId] = useState('');
  const [newComplaintReason, setNewComplaintReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (showSubmitModal && bookings.length === 0) {
      fetchBookings();
    }
  }, [showSubmitModal]);

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load your bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/complaints/my-complaints', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        setError('Failed to fetch complaints');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Network error while loading complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintBookingId || !newComplaintReason) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: parseInt(newComplaintBookingId),
          reason: newComplaintReason
        })
      });

      if (response.ok) {
        toast.success('Complaint submitted successfully');
        setShowSubmitModal(false);
        setNewComplaintBookingId('');
        setNewComplaintReason('');
        fetchComplaints();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to submit complaint');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Resolved</span>;
      case 'dismissed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle size={12} /> Dismissed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><Loader2 size={12} className="animate-spin" /> Pending</span>;
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.bookingId.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Complaints</h1>
            <p className="text-forest-100 text-sm mt-1">Submit and track issues related to your bookings</p>
          </div>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-2.5 bg-white text-forest-700 font-semibold rounded-xl hover:bg-forest-50 transition-colors shadow-sm"
        >
          Submit New Complaint
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search complaints by reason or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 mb-4 text-red-400" />
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={fetchComplaints}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageSquareX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No complaints found</h3>
          <p className="text-gray-500">{searchTerm ? `No complaints matching "${searchTerm}"` : "You haven't submitted any complaints yet."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-forest-50/30 transition-colors cursor-pointer" onClick={() => {setSelectedComplaint(complaint); setShowDetailModal(true);}}>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                      {formatDateTime(complaint.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-forest-600 whitespace-nowrap">
                      #{complaint.bookingId}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="text-sm max-w-xl line-clamp-2 text-gray-600">{complaint.reason}</p>
                      {complaint.adminNote && (
                        <p className="text-xs text-forest-600 font-medium mt-1">✓ Admin Response Available</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {getStatusBadge(complaint.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-forest-50 to-gray-50 sticky top-0">
              <h2 className="text-xl font-bold text-gray-900">Complaint Details</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Booking ID</p>
                  <p className="text-lg font-semibold text-forest-600">#{selectedComplaint.bookingId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Status</p>
                  <div>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Submitted On</p>
                  <p className="text-sm text-gray-700">{formatDateTime(selectedComplaint.date)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Complaint Reason</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedComplaint.reason}</p>
                </div>
              </div>

              {selectedComplaint.adminNote && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Admin Response</p>
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-green-900 leading-relaxed whitespace-pre-wrap">{selectedComplaint.adminNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Complaint Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Submit a Complaint</h2>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Booking</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-forest-500 focus:border-forest-500 bg-white"
                    value={newComplaintBookingId}
                    onChange={e => setNewComplaintBookingId(e.target.value)}
                    disabled={isLoadingBookings}
                  >
                    <option value="" disabled>
                      {isLoadingBookings ? 'Loading bookings...' : 'Select a booking'}
                    </option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id.toString()}>
                        Booking #{b.id} (Date: {new Date(b.bookingDate).toLocaleDateString()}) - {user?.role === 'guide' ? `Tourist: ${b.tourist?.name}` : `Guide: ${b.guide?.name}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">You can only complain about your own bookings.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Complaint</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-forest-500 focus:border-forest-500 resize-none"
                    placeholder="Please describe the issue in detail..."
                    value={newComplaintReason}
                    onChange={e => setNewComplaintReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}