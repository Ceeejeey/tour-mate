import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_GUIDES, MOCK_MESSAGES } from '../../data/mockData';
import { Zap, CheckCircle, AlertCircle, MessageCircle, Send } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { format } from 'date-fns';

export default function BookingNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guideId = searchParams.get('guideId');
  const guide = MOCK_GUIDES.find(g => g.id === guideId);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat state
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages.filter(
    m => (m.senderId === 't1' && m.receiverId === guideId) ||
         (m.senderId === guideId && m.receiverId === 't1')
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !guideId) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 't1',
      receiverId: guideId,
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  if (!guide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Guide Not Found</h2>
        <p className="text-gray-500 mb-6">Please select a valid guide to book.</p>
        <button
          onClick={() => navigate('/tourist/search')}
          className="bg-forest-600 text-white px-6 py-2 rounded-lg hover:bg-forest-700"
        >
          Find a Guide
        </button>
      </div>
    );
  }

  const sessionPrice = guide.pricePerSession;
  const serviceFee = sessionPrice * 0.05;
  const total = sessionPrice + serviceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/tourist/bookings');
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Instant Booking</h1>
        <p className="text-gray-500">Confirm your instant booking with {guide.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Booking Form + Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes for the Guide</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                    placeholder="Tell the guide about your interests, group size, or specific places you want to visit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !guide.isAvailable}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Zap size={18} />
                  {isSubmitting ? 'Processing...' : guide.isAvailable ? 'Book Now' : 'Guide Unavailable'}
                </button>
              </form>

              {/* Summary Card */}
              <div className="bg-gray-50 p-6 rounded-xl h-fit">
                <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{guide.name}</div>
                    <div className="text-sm text-gray-500">{guide.serviceArea}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white border border-gray-200">
                  <div className={`w-2.5 h-2.5 rounded-full ${guide.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${guide.isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                    {guide.isAvailable ? 'Available Now' : 'Currently Unavailable'}
                  </span>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Session Price</span>
                    <span className="font-medium text-gray-900">{formatCurrency(sessionPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (5%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-forest-600">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="mt-6 bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Instant booking. The guide will be notified immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inline Chat Window */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
              <div className="relative">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {guide.isAvailable && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{guide.name}</h3>
                <span className={`text-xs flex items-center gap-1 ${guide.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${guide.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {guide.isAvailable ? 'Online' : 'Offline'}
                </span>
              </div>
              <MessageCircle size={18} className="text-gray-400" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => {
                  const isMe = msg.senderId === 't1';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                          isMe
                            ? 'bg-forest-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-0.5 block ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageCircle size={32} className="text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No messages yet.</p>
                  <p className="text-xs text-gray-300 mt-1">Send a message to {guide.name} before booking.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-forest-600 text-white p-2 rounded-xl hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
