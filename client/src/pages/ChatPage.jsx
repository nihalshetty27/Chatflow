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
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CURRENT_USERNAME = 'Nihal';

export const ChatPage = () => {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Format database / socket message into UI display format
  const formatMessage = (msg) => ({
    id: msg.id,
    sender: msg.sender_name,
    content: msg.content,
    time: msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: msg.sender_name === CURRENT_USERNAME,
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

    socketRef.current.emit(
      'send_message',
      {
        content: trimmed,
        username: CURRENT_USERNAME,
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {CURRENT_USERNAME.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{CURRENT_USERNAME}</p>
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
              This is the start of the #{activeChannel} channel. Type a message below to test real-time Socket.IO chat!
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
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[80%] ${
                  msg.isMe ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-sm ${
                    msg.isMe
                      ? 'bg-primary'
                      : 'bg-gradient-to-tr from-secondary to-purple-600'
                  }`}
                >
                  {msg.sender ? msg.sender.charAt(0).toUpperCase() : '?'}
                </div>

                <div className={`space-y-1 ${msg.isMe ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm break-words ${
                      msg.isMe
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-white border border-outline-variant/80 text-on-surface rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.isMe && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                      <span>Saved</span>
                      <CheckCheck className="w-3 h-3 text-primary" />
                    </div>
                  )}
                </div>
              </div>
            ))
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
              placeholder={`Message #${activeChannel} as ${CURRENT_USERNAME}...`}
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
