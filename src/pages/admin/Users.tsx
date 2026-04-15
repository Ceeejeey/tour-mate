import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Globe, Trash2, Loader2, AlertCircle, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Tourist {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  nationality: string | null;
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTourists();
  }, []);

  const fetchTourists = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/users/tourists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTourists(data);
      } else {
        setError('Failed to fetch tourists');
      }
    } catch (err) {
      console.error('Error fetching tourists:', err);
      setError('Network error while loading tourists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch(`http://localhost:5066/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        setTourists(prev => prev.filter(t => t.id !== id));
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Network error while deleting user');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = tourists.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tourists Management</h1>
            <p className="text-forest-100 text-sm mt-1">Manage and monitor all registered tourists on your platform</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tourists by name or email..."
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
            onClick={fetchTourists}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading tourists...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No tourists found</h3>
          <p className="text-gray-500">{searchTerm ? `No tourists matching "${searchTerm}"` : "No registered tourists yet."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nationality</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=random'}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-forest-100 shadow-sm"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 font-mono">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-forest-500" /> 
                          <a href={`mailto:${user.email}`} className="text-gray-700 hover:text-forest-600 transition-colors font-medium">{user.email}</a>
                        </div>
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-forest-500" /> 
                            <a href={`tel:${user.phone}`} className="text-gray-700 hover:text-forest-600 transition-colors font-medium">{user.phone}</a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 italic text-sm">
                            <Phone size={14} /> Not provided
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.nationality ? (
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Globe size={14} className="text-forest-500" /> {user.nationality}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={isDeleting === user.id}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          isDeleting === user.id 
                            ? 'bg-red-50 text-red-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md'
                        }`}
                        title="Delete user"
                      >
                        {isDeleting === user.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
