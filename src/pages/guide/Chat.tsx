import React, { useState, useRef, useEffect } from 'react';
import { MOCK_MESSAGES, MOCK_TOURISTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function Chat() {
  const { user } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>('t1');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For guide, conversations are with tourists
  const conversations = Array.from(new Set(messages.map(m => m.senderId === 'g1' ? m.receiverId : m.senderId)))
    .map(id => MOCK_TOURISTS.find(t => t.id === id))
    .filter(Boolean);

  const activeConversation = MOCK_TOURISTS.find(t => t.id === activeChatId);
  
  const currentMessages = messages.filter(
    m => (m.senderId === 'g1' && m.receiverId === activeChatId) || 
         (m.senderId === activeChatId && m.receiverId === 'g1')
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: 'g1',
      receiverId: activeChatId,
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-forest-500/20 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(tourist => (
              <button
                key={tourist?.id}
                onClick={() => setActiveChatId(tourist?.id || null)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  activeChatId === tourist?.id ? 'bg-forest-600/5 border-r-4 border-forest-600' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={tourist?.avatar}
                    alt={tourist?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{tourist?.name}</h3>
                    <span className="text-xs text-gray-400">10:30 AM</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {messages.findLast(m => m.senderId === tourist?.id || m.receiverId === tourist?.id)?.content || 'Start a conversation'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col h-full bg-gray-50/50">
          {activeChatId && activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{activeConversation.name}</h3>
                    <span className="text-xs text-gray-500">{activeConversation.nationality}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => {
                  const isMe = msg.senderId === 'g1';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                          isMe
                            ? 'bg-forest-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-forest-500/20"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-forest-600 text-white p-3 rounded-xl hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
