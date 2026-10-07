import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Hash,
  Send,
  LogOut,
  Smile,
  Paperclip,
  Search,
  Bell,
  Users,
  MessageSquare,
  Settings,
  CheckCheck,
  Wifi,
  WifiOff,
  User,
  Edit3,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { API_URL } from '../config';

const SOCKET_SERVER_URL = API_URL;

export const ChatPage = () => {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Dynamic username stored in localStorage
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('chatflow_username') || '';
  });
  const [showUsernameModal, setShowUsernameModal] = useState(() => {
    return !localStorage.getItem('chatflow_username');
  });
  const [modalInput, setModalInput] = useState('');

  // Save username to localStorage and state
  const handleSaveUsername = (e) => {
    e.preventDefault();
    const clean = modalInput.trim();
    if (!clean) return;
    localStorage.setItem('chatflow_username', clean);
    setUsername(clean);
    setShowUsernameModal(false);
  };

  // Open modal to change username
  const handleOpenEditUsername = () => {
    setModalInput(username);
    setShowUsernameModal(true);
  };

  // Format database / socket message into UI display format
  const formatMessage = (msg) => ({
    id: msg.id,
    sender: msg.sender_name || 'Anonymous',
    content: msg.content,
    time: msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to Socket.IO and load historical messages
  useEffect(() => {
    // 1. Fetch historical messages from REST endpoint
    fetch(`${SOCKET_SERVER_URL}/api/messages?channel=${activeChannel}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data.map(formatMessage));
        }
      })
      .catch((err) => {
        console.error('[ChatFlow] Error fetching existing messages:', err);
      });

    // 2. Initialize Socket.IO connection
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to chat server, id:', socket.id);
      setIsConnected(true);
      // Join the "general" room
      socket.emit('join_room', activeChannel);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected from chat server');
      setIsConnected(false);
    });

    // 3. Listen for incoming real-time messages
    socket.on('new_message', (rawMsg) => {
      setMessages((prev) => {
        // Prevent duplicate rendering if already received
        if (prev.some((m) => m.id === rawMsg.id)) {
          return prev;
        }
        return [...prev, formatMessage(rawMsg)];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChannel]);

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || !socketRef.current) return;

    const currentSender = username.trim() || 'Anonymous';

    socketRef.current.emit(
      'send_message',
      {
        content: trimmed,
        username: currentSender,
        channel: activeChannel,
      },
      (response) => {
        if (response?.error) {
          console.error('[Socket.IO] Send message error:', response.error);
        }
      }
    );

    // Clear input immediately
    setInputMessage('');
  };

  const channels = [
    { id: 'general', name: 'general', unread: 0 },
    { id: 'announcements', name: 'announcements', unread: 0 },
    { id: 'dev-team', name: 'dev-team', unread: 0 },
    { id: 'design-feedback', name: 'design-feedback', unread: 0 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-on-surface">
      {/* Username Prompt Modal on First Visit */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-outline-variant/60 animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-3">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-sm opacity-30" />
                <Logo size="md" className="relative shadow-md" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">
                {username ? 'Change Display Name' : 'Welcome to ChatFlow!'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-[260px]">
                {username
                  ? 'Update how your name appears to others in chat.'
                  : 'Please enter a username so other users know who you are in the chat.'}
              </p>
            </div>

            <form onSubmit={handleSaveUsername} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wide">
                  Your Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Alice, Bob, Nihal"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-3.5 bg-surface-lowest border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {username && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setShowUsernameModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!modalInput.trim()}
                  className="flex-1"
                >
                  {username ? 'Save' : 'Join Chat'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Left Nav Rail & Channel Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-outline-variant/60">
        {/* Workspace Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/50">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <span className="font-bold text-sm text-primary tracking-tight block">
                ChatFlow
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium block">
                Acme Workspace
              </span>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-slate-100 transition-colors"
            title="Workspace settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-2 mb-2 flex items-center justify-between text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              <span>Channels</span>
              <span className="text-primary hover:underline cursor-pointer">+ Add</span>
            </div>
            <div className="space-y-1">
              {channels.map((ch) => {
                const isActive = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary font-semibold'
                        : 'text-on-surface-variant hover:bg-slate-100 hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Direct Messages
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-slate-100 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Alex Chen</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-slate-100 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Sarah Miller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current User Card & Sign Out */}
        <div className="p-3 border-t border-outline-variant/50 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-on-surface truncate">
                  {username || 'Anonymous'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenEditUsername}
                  className="text-slate-400 hover:text-primary transition-colors p-0.5 rounded"
                  title="Edit username"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span className={isConnected ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out / Back to Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Chat Canvas */}
      <main className="flex-1 flex flex-col bg-surface-lowest overflow-hidden">
        {/* Top Channel Header */}
        <header className="h-16 px-6 border-b border-outline-variant/50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm text-on-surface">
                  #{activeChannel}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-medium">
                  Public
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Live messages saved in PostgreSQL and synced via Socket.IO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
              {isConnected ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Real-time Live</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Reconnecting</span>
                </span>
              )}
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              icon={LogOut}
              iconPosition="right"
            >
              Exit to Login
            </Button>
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-light text-primary mb-2">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">
              Welcome to #{activeChannel}
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-0.5">
              This is the start of the #{activeChannel} channel. Messages are delivered in real-time to everyone in the room!
            </p>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-outline-variant/40" />
            <span className="absolute px-3 bg-white text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Messages
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8 text-xs text-on-surface-variant/70 italic">
              No messages yet in this channel. Be the first to say hello!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = username ? msg.sender === username : false;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${
                    isMe ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-sm ${
                      isMe
                        ? 'bg-primary'
                        : 'bg-gradient-to-tr from-secondary to-purple-600'
                    }`}
                  >
                    {msg.sender ? msg.sender.charAt(0).toUpperCase() : '?'}
                  </div>

                  <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <span className="font-semibold text-on-surface">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm break-words ${
                        isMe
                          ? 'bg-primary text-white rounded-br-xs'
                          : 'bg-white border border-outline-variant/80 text-on-surface rounded-tl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {isMe && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                        <span>Saved</span>
                        <CheckCheck className="w-3 h-3 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-outline-variant/50">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border border-outline-variant rounded-xl p-2 focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-surface-lowest"
          >
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={
                username
                  ? `Message #${activeChannel} as ${username}...`
                  : `Message #${activeChannel}...`
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-on-surface placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputMessage.trim()}
              icon={Send}
            >
              Send
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};
