import React, { useState, useRef, useEffect } from 'react';

const conversations = [
  {
    id: 1,
    name: 'Aishwarya R.',
    age: 26,
    profession: 'Software Engineer',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=120&h=120',
    online: true,
    lastMessage: 'Hi! I came across your profile and I think we have a lot in common 😊',
    lastTime: '10:32 AM',
    unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Hi! I came across your profile and I think we have a lot in common 😊', time: '10:30 AM' },
      { id: 2, from: 'them', text: 'Would love to know more about you!', time: '10:32 AM' },
    ],
  },
  {
    id: 2,
    name: 'Meera Joseph',
    age: 25,
    profession: 'Doctor',
    location: 'Kochi',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=120&h=120',
    online: false,
    lastMessage: 'Looking forward to connecting!',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Hello! Your profile looks great.', time: 'Yesterday' },
      { id: 2, from: 'me', text: 'Thank you! Yours too 😊', time: 'Yesterday' },
      { id: 3, from: 'them', text: 'Looking forward to connecting!', time: 'Yesterday' },
    ],
  },
  {
    id: 3,
    name: 'Kavya Madhavan',
    age: 25,
    profession: 'UI/UX Designer',
    location: 'Ernakulam',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    online: true,
    lastMessage: 'Sent you a connection request!',
    lastTime: 'Mon',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Hey! Sent you a connection request!', time: 'Mon' },
    ],
  },
];

export default function InboxView() {
  const [chats, setChats] = useState(conversations);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');

  const activeChat = chats.find((c) => c.id === activeId);
  const messagesContainerRef = useRef(null);

  // Scroll messages container (not the whole page) to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeId, activeChat?.messages?.length]);

  const openChat = (id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setActiveId(id);
    setInput('');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, { id: Date.now(), from: 'me', text: input.trim(), time: now }],
              lastMessage: input.trim(),
              lastTime: 'Now',
            }
          : c
      )
    );
    setInput('');
  };

  return (
    <div className="w-full">

      {/* Outer card — no fixed height, uses viewport-aware calc */}
      <div className="rounded-none md:rounded-xl border-none md:border md:border-slate-200/60 bg-transparent md:bg-white shadow-none md:shadow-sm overflow-hidden flex flex-col"
        style={{ height: 'calc(100vh - 200px)', minHeight: '420px', maxHeight: '680px' }}
      >

        {/* Header */}
        <div className="px-4 md:px-6 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <h2 className="text-sm font-bold text-charcoal-text uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-deep-maroon" />
            Inbox Messages
          </h2>
          <p className="text-[10px] text-soft-gray mt-0.5">Select a conversation to start chatting</p>
        </div>

        {/* Body: list + chat side by side */}
        <div className="flex flex-1 min-h-0">

          {/* ── LEFT: Conversation list ── */}
          <div
            className={`flex flex-col overflow-y-auto border-r border-slate-100 shrink-0 bg-white
              ${activeId ? 'hidden sm:flex sm:w-[210px] md:w-[240px]' : 'flex w-full sm:w-[210px] md:w-[240px]'}`}
          >
            {chats.length === 0 && (
              <p className="text-xs text-soft-gray text-center py-10 px-4">No conversations yet.</p>
            )}
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className={`flex items-center gap-2.5 px-3 py-3 text-left transition-colors cursor-pointer border-b border-slate-50 hover:bg-slate-50 w-full
                  ${activeId === chat.id ? 'bg-deep-maroon/5 border-l-2 border-l-deep-maroon' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs truncate ${activeId === chat.id ? 'font-bold text-deep-maroon' : 'font-semibold text-charcoal-text'}`}>
                      {chat.name}
                    </span>
                    <span className="text-[9px] text-slate-400 shrink-0 ml-1">{chat.lastTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[10px] text-soft-gray truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-1 shrink-0 w-4 h-4 rounded-full bg-deep-maroon text-white text-[9px] font-bold flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── RIGHT: Chat panel ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${!activeId ? 'hidden sm:flex' : 'flex'}`}>

            {activeChat ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-2.5 px-3 md:px-4 py-2.5 border-b border-slate-100 bg-white shrink-0">
                  {/* Back (mobile) */}
                  <button
                    onClick={() => setActiveId(null)}
                    className="sm:hidden text-soft-gray hover:text-charcoal-text cursor-pointer p-1 -ml-1"
                  >
                    <span className="material-symbols-outlined text-[20px] leading-none">arrow_back</span>
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={activeChat.image}
                      alt={activeChat.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    {activeChat.online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-charcoal-text text-xs leading-tight">{activeChat.name}</p>
                    <p className="text-[9px] text-soft-gray truncate">{activeChat.age} yrs · {activeChat.profession} · {activeChat.location}</p>
                  </div>

                  <button
                    onClick={() => alert(`Starting video call with ${activeChat.name}...`)}
                    className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-deep-maroon transition-all cursor-pointer flex items-center justify-center shrink-0 mr-1"
                    title="Start Video Call"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                  </button>

                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    activeChat.online ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {activeChat.online ? 'Online' : 'Offline'}
                  </span>
                </div>

                {/* Messages — scrollable container */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3 md:px-4 py-3 flex flex-col gap-2 bg-slate-50/50">
                  {activeChat.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-1.5 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {msg.from === 'them' && (
                        <img
                          src={activeChat.image}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                      )}
                      <div className={`max-w-[72%] sm:max-w-[65%] px-3 py-2 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.from === 'me'
                          ? 'bg-deep-maroon text-white rounded-br-sm'
                          : 'bg-white text-charcoal-text border border-slate-100 rounded-bl-sm'
                      }`}>
                        {msg.text}
                        <span className={`block text-[9px] mt-0.5 ${msg.from === 'me' ? 'text-white/55 text-right' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Input bar — always visible at bottom */}
                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 px-3 md:px-4 py-2.5 border-t border-slate-100 bg-white shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 min-w-0 bg-slate-100 rounded-full px-3.5 py-2 text-xs text-charcoal-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-deep-maroon/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-full bg-deep-maroon hover:bg-primary text-white flex items-center justify-center shrink-0 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">send</span>
                  </button>
                </form>
              </>
            ) : (
              /* No chat selected — empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3 bg-slate-50/40">
                <div className="w-14 h-14 rounded-full bg-deep-maroon/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-deep-maroon/25">forum</span>
                </div>
                <p className="font-semibold text-charcoal-text text-sm">No chat selected</p>
                <p className="text-xs text-soft-gray max-w-[200px]">Pick a conversation from the list to start chatting</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
