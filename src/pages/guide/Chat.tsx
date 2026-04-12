import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Search, MoreVertical, Phone, Video, Clock, Check, CheckCheck, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import toast from 'react-hot-toast';

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preSelectedUserId = searchParams.get('userId');
  
  const [activeChatId, setActiveChatId] = useState<number | null>(preSelectedUserId ? parseInt(preSelectedUserId) : null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeChatId);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('tourmate_token');
        const res = await fetch('http://localhost:5066/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          setFilteredConversations(data);
          if (data.length > 0 && !activeChatId && !preSelectedUserId) {
            setActiveChatId(data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();

    const token = localStorage.getItem('tourmate_token');
    if (token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5066/chathub', {
          accessTokenFactory: () => token
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    }
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.invoke('GetOnlineUsers').then((users: number[]) => {
            setOnlineUsers(users);
          });

          connection.on('UserOnline', (userId: number) => {
            setOnlineUsers(prev => [...new Set([...prev, userId])]);
          });

          connection.on('UserOffline', (userId: number) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
          });
          
          connection.on('ReceiveMessage', (message) => {
            setMessages(prev => {
              if (!prev.find(m => m.id === message.id)) {
                return [...prev, message];
              }
              return prev;
            });
            scrollToBottom();
          });

          connection.on('UserTyping', (userId: number) => {
            if (userId === activeChatId) {
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 3000);
            }
          });
        })
        .catch(e => console.log('Connection failed: ', e));

      return () => {
        connection.off('UserOnline');
        connection.off('UserOffline');
        connection.off('ReceiveMessage');
        connection.off('UserTyping');
        connection.stop();
      };
    }
  }, [connection, activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('tourmate_token');
        const res = await fetch(`http://localhost:5066/api/messages/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  useEffect(() => {
    const filtered = conversations.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !connection) return;

    try {
      await connection.invoke('SendMessage', activeChatId, messageInput);
      setMessageInput('');
      scrollToBottom();
    } catch (e) {
      console.error(e);
      toast.error('Failed to send message');
    }
  };

  const currentMessages = messages.filter(
    m => (Number(m.senderId) === Number(user?.id) && Number(m.receiverId) === Number(activeChatId)) || 
         (Number(m.senderId) === Number(activeChatId) && Number(m.receiverId) === Number(user?.id))
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const groupMessagesByDate = (msgs: any[]) => {
    const groups: { [key: string]: any[] } = {};
    msgs.forEach(msg => {
      const date = format(new Date(msg.timestamp), 'MMM d, yyyy');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-80px)] bg-gradient-to-br from-forest-50/30 to-sky-50/30">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full flex">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-96 border-r border-gray-200 flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50">
          <div className="p-5 border-b border-gray-200 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Requests</h2>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tourists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`w-full p-3 flex items-center gap-3 rounded-2xl transition-all duration-200 ${
                    activeChatId === c.id 
                      ? 'bg-forest-600/10 border-2 border-forest-600 shadow-md' 
                      : 'hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.avatar || `https://ui-avatars.com/api/?name=${c.name}&background=2D5F2E&color=fff`}
                      alt={c.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {onlineUsers.includes(c.id) && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">{c.name}</h3>
                    <p className="text-xs text-gray-500 truncate capitalize">{c.role}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-400 text-center mt-16">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No tourists found</p>
              </div>
            )}
            {filteredConversations.length === 0 && searchQuery === '' && (
              <div className="p-8 text-sm text-gray-400 text-center mt-16">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No booking requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-gray-50/50">
          {activeChatId && activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-5 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.avatar || `https://ui-avatars.com/api/?name=${activeConversation.name}&background=2D5F2E&color=fff`}
                    alt={activeConversation.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{activeConversation.name}</h3>
                    <div className="flex items-center gap-1">
                      {onlineUsers.includes(activeConversation.id) ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs text-green-600 font-medium">Online Now</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          <span className="text-xs text-gray-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Video size={20} />
                  </button>
                  <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(groupMessagesByDate(currentMessages)).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                    </div>
                    <div className="space-y-3">
                      {msgs.map((msg) => {
                        const isMe = Number(msg.senderId) === Number(user?.id);
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                              <div
                                className={`rounded-2xl px-4 py-3 shadow-md transition-all ${
                                  isMe
                                    ? 'bg-forest-600 text-white rounded-br-none hover:shadow-lg'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none hover:shadow-lg'
                                }`}
                              >
                                <p className="text-sm break-words">{msg.content}</p>
                                <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <span className={`text-xs ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                                    {format(new Date(msg.timestamp), 'h:mm a')}
                                  </span>
                                  {isMe && (
                                    <CheckCheck size={14} className="text-green-100" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-2 rounded-full border border-gray-200 flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-5 bg-white border-t border-gray-200 shadow-sm">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-forest-600 text-white p-3.5 rounded-full hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95 shadow-md"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg">Select a booking request to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
