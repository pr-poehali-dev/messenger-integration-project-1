import { useState } from "react";
import Icon from "@/components/ui/icon";

const CONTACTS = [
  { id: 1, name: "Аня Морозова", status: "online", avatar: "АМ", color: "#8b5cf6", lastSeen: "сейчас" },
  { id: 2, name: "Дима Козлов", status: "offline", avatar: "ДК", color: "#06b6d4", lastSeen: "1ч назад" },
  { id: 3, name: "Саша Белова", status: "online", avatar: "СБ", color: "#f472b6", lastSeen: "сейчас" },
  { id: 4, name: "Игорь Петров", status: "offline", avatar: "ИП", color: "#34d399", lastSeen: "вчера" },
  { id: 5, name: "Катя Новикова", status: "online", avatar: "КН", color: "#fb923c", lastSeen: "сейчас" },
  { id: 6, name: "Макс Орлов", status: "away", avatar: "МО", color: "#a78bfa", lastSeen: "5м назад" },
];

const INITIAL_CHATS = [
  { id: 1, contactId: 1, messages: [
    { id: 1, from: "them", text: "Привет! Как дела? 😊", time: "12:01" },
    { id: 2, from: "me", text: "Всё отлично! Работаю над новым проектом", time: "12:03" },
    { id: 3, from: "them", text: "Круто! Расскажи подробнее, очень интересно", time: "12:05" },
    { id: 4, from: "me", text: "Делаю мессенджер 🚀 Почти готово!", time: "12:06" },
    { id: 5, from: "them", text: "Вау, это звучит захватывающе! Покажешь когда будет готово?", time: "12:08" },
  ]},
  { id: 2, contactId: 3, messages: [
    { id: 1, from: "them", text: "Ты уже видела новый дизайн?", time: "11:20" },
    { id: 2, from: "me", text: "Да! Очень нравится 💜", time: "11:22" },
  ]},
  { id: 3, contactId: 5, messages: [
    { id: 1, from: "them", text: "Встреча в 15:00, не забудь!", time: "10:00" },
    { id: 2, from: "me", text: "Помню, буду 👍", time: "10:01" },
  ]},
];

const NOTIFICATIONS = [
  { id: 1, type: "message", text: "Аня Морозова прислала сообщение", time: "только что", read: false },
  { id: 2, type: "call", text: "Пропущенный звонок от Дима Козлов", time: "1ч назад", read: false },
  { id: 3, type: "contact", text: "Катя Новикова добавила вас в контакты", time: "вчера", read: true },
  { id: 4, type: "message", text: "Саша Белова: 'Ты уже видела...'", time: "вчера", read: true },
];

type Tab = "chats" | "contacts" | "search" | "notifications" | "profile" | "settings";
type CallType = "audio" | "video" | null;

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [callType, setCallType] = useState<CallType>(null);
  const [callContact, setCallContact] = useState<typeof CONTACTS[0] | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [searchQuery, setSearchQuery] = useState("");

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatContact = activeChat ? CONTACTS.find(c => c.id === activeChat.contactId) : null;
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;

  const startCall = (type: CallType, contact: typeof CONTACTS[0]) => {
    setCallType(type);
    setCallContact(contact);
  };

  const endCall = () => {
    setCallType(null);
    setCallContact(null);
  };

  const sendMessage = () => {
    if (!message.trim() || !activeChatId) return;
    setChats(prev => prev.map(chat => {
      if (chat.id !== activeChatId) return chat;
      return {
        ...chat,
        messages: [...chat.messages, {
          id: chat.messages.length + 1,
          from: "me",
          text: message.trim(),
          time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })
        }]
      };
    }));
    setMessage("");
  };

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = chats.filter(chat => {
    const contact = CONTACTS.find(c => c.id === chat.contactId);
    return !searchQuery || contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const navItems: { tab: Tab; icon: string; label: string; badge?: number }[] = [
    { tab: "chats", icon: "MessageCircle", label: "Чаты" },
    { tab: "contacts", icon: "Users", label: "Контакты" },
    { tab: "search", icon: "Search", label: "Поиск" },
    { tab: "notifications", icon: "Bell", label: "Уведомления", badge: unreadNotifs },
    { tab: "profile", icon: "User", label: "Профиль" },
    { tab: "settings", icon: "Settings", label: "Настройки" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--pulse-bg)" }}>

      {/* Call Modal */}
      {callType && callContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ background: "rgba(5,5,20,0.95)", backdropFilter: "blur(30px)" }}>
          <div className="flex flex-col items-center gap-8 animate-slide-up">
            <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
              <div className="absolute inset-0 rounded-full wave-ring"
                style={{ background: `${callContact.color}20`, border: `2px solid ${callContact.color}40` }} />
              <div className="absolute inset-0 rounded-full wave-ring-2"
                style={{ background: `${callContact.color}10`, border: `2px solid ${callContact.color}30` }} />
              <div className="absolute inset-0 rounded-full wave-ring-3"
                style={{ background: `${callContact.color}08`, border: `2px solid ${callContact.color}20` }} />
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${callContact.color}, ${callContact.color}99)`, boxShadow: `0 0 40px ${callContact.color}60` }}>
                {callContact.avatar}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{callContact.name}</div>
              <div className="text-sm" style={{ color: "var(--pulse-text-muted)" }}>
                {callType === "video" ? "Видеозвонок" : "Голосовой звонок"} · Соединение...
              </div>
            </div>

            {callType === "video" && (
              <div className="rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ width: 240, height: 135, background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                <div className="text-center">
                  <Icon name="VideoOff" size={32} color="var(--pulse-text-muted)" />
                  <div className="text-xs mt-2" style={{ color: "var(--pulse-text-muted)" }}>Камера недоступна</div>
                </div>
              </div>
            )}

            <div className="flex gap-4 items-center">
              {callType === "video" && (
                <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="Video" size={22} color="white" />
                </button>
              )}
              <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                <Icon name="Mic" size={22} color="white" />
              </button>
              <button onClick={endCall}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 8px 25px rgba(239,68,68,0.4)" }}>
                <Icon name="PhoneOff" size={26} color="white" />
              </button>
              <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                <Icon name="Volume2" size={22} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar — Navigation */}
      <div className="flex flex-col items-center py-6 gap-2 z-10" style={{
        width: 72, background: "var(--pulse-surface)", borderRight: "1px solid var(--pulse-border)", flexShrink: 0
      }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 pulse-gradient-btn">
          <Icon name="Zap" size={20} color="white" />
        </div>

        {navItems.map(item => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab)}
            className={`pulse-nav-item w-12 h-12 rounded-2xl flex items-center justify-center relative ${activeTab === item.tab ? "active" : ""}`}
            title={item.label}>
            <Icon name={item.icon} size={22}
              color={activeTab === item.tab ? "var(--pulse-accent)" : "var(--pulse-text-muted)"} />
            {item.badge ? (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full text-white flex items-center justify-center font-bold"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", fontSize: 10 }}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="flex-1" />

        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #f472b6)", boxShadow: "0 0 15px rgba(139,92,246,0.4)" }}
          onClick={() => setActiveTab("profile")}>
          ЯВ
        </div>
      </div>

      {/* Middle Panel */}
      <div className="flex flex-col" style={{
        width: 320, flexShrink: 0, borderRight: "1px solid var(--pulse-border)", background: "var(--pulse-surface)", overflowY: "auto"
      }}>
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {activeTab === "chats" && "Сообщения"}
              {activeTab === "contacts" && "Контакты"}
              {activeTab === "search" && "Поиск"}
              {activeTab === "notifications" && "Уведомления"}
              {activeTab === "profile" && "Профиль"}
              {activeTab === "settings" && "Настройки"}
            </h2>
            {activeTab === "chats" && (
              <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                <Icon name="Plus" size={18} color="var(--pulse-accent)" />
              </button>
            )}
          </div>

          {(activeTab === "chats" || activeTab === "contacts" || activeTab === "search") && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="Search" size={16} color="var(--pulse-text-muted)" />
              </div>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none text-white"
                style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)", fontFamily: "Golos Text, sans-serif" }} />
            </div>
          )}
        </div>

        <div className="flex-1 px-3 pb-4">
          {/* CHATS */}
          {activeTab === "chats" && (
            <div className="flex flex-col gap-1">
              {filteredChats.map(chat => {
                const contact = CONTACTS.find(c => c.id === chat.contactId)!;
                const lastMsg = chat.messages[chat.messages.length - 1];
                const isActive = activeChatId === chat.id;
                return (
                  <button key={chat.id} onClick={() => setActiveChatId(chat.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all"
                    style={{
                      background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                      border: isActive ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent"
                    }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}>
                        {contact.avatar}
                      </div>
                      {contact.status === "online" && <div className="absolute -bottom-0.5 -right-0.5 pulse-online-dot" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{contact.name}</span>
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: "var(--pulse-text-muted)" }}>{lastMsg.time}</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--pulse-text-muted)" }}>
                        {lastMsg.from === "me" ? "Вы: " : ""}{lastMsg.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === "contacts" && (
            <div className="flex flex-col gap-1">
              {filteredContacts.map(contact => (
                <button key={contact.id}
                  onClick={() => {
                    const chat = chats.find(c => c.contactId === contact.id);
                    if (chat) { setActiveChatId(chat.id); setActiveTab("chats"); }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all hover:bg-white/5">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}>
                      {contact.avatar}
                    </div>
                    {contact.status === "online" && <div className="absolute -bottom-0.5 -right-0.5 pulse-online-dot" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{contact.name}</div>
                    <div className="text-xs" style={{ color: contact.status === "online" ? "var(--pulse-online)" : "var(--pulse-text-muted)" }}>
                      {contact.status === "online" ? "в сети" : contact.lastSeen}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); startCall("audio", contact); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "var(--pulse-surface-2)" }}>
                      <Icon name="Phone" size={14} color="var(--pulse-accent)" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); startCall("video", contact); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: "var(--pulse-surface-2)" }}>
                      <Icon name="Video" size={14} color="var(--pulse-accent-2)" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* SEARCH */}
          {activeTab === "search" && (
            <div>
              {searchQuery ? (
                <>
                  <div className="text-xs font-semibold mb-3 px-1" style={{ color: "var(--pulse-text-muted)" }}>ЛЮДИ</div>
                  {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                    <button key={contact.id}
                      onClick={() => {
                        const chat = chats.find(c => c.contactId === contact.id);
                        if (chat) { setActiveChatId(chat.id); setActiveTab("chats"); }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all hover:bg-white/5">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}>
                        {contact.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{contact.name}</div>
                        <div className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{contact.lastSeen}</div>
                      </div>
                    </button>
                  )) : (
                    <div className="text-center py-10">
                      <Icon name="SearchX" size={32} color="var(--pulse-text-muted)" className="mx-auto mb-2" />
                      <p className="text-sm" style={{ color: "var(--pulse-text-muted)" }}>Ничего не найдено</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Icon name="Search" size={40} color="var(--pulse-text-muted)" className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm" style={{ color: "var(--pulse-text-muted)" }}>Начните вводить имя</p>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="flex flex-col gap-2">
              {NOTIFICATIONS.map(notif => (
                <div key={notif.id} className="flex items-start gap-3 px-3 py-3 rounded-2xl"
                  style={{
                    background: !notif.read ? "rgba(139,92,246,0.08)" : "transparent",
                    border: !notif.read ? "1px solid rgba(139,92,246,0.15)" : "1px solid transparent"
                  }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: notif.type === "call" ? "rgba(239,68,68,0.15)" : "rgba(139,92,246,0.15)" }}>
                    <Icon name={notif.type === "call" ? "PhoneOff" : notif.type === "contact" ? "UserPlus" : "MessageCircle"}
                      size={18} color={notif.type === "call" ? "#ef4444" : "var(--pulse-accent)"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{notif.text}</p>
                    <span className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{notif.time}</span>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ background: "var(--pulse-accent)", boxShadow: "0 0 6px var(--pulse-accent)" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white animate-pulse-ring"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #f472b6)", boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}>
                  ЯВ
                </div>
                <div className="absolute -bottom-1 -right-1 pulse-online-dot" style={{ width: 14, height: 14 }} />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">Я Владелец</div>
                <div className="text-sm pulse-gradient-text font-medium">@me</div>
              </div>
              <div className="w-full rounded-2xl p-4 mt-2 flex flex-col gap-3"
                style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                {[
                  { label: "Статус", value: "В сети", icon: "Circle" },
                  { label: "Телефон", value: "+7 999 000-00-00", icon: "Phone" },
                  { label: "О себе", value: "Создаю крутые продукты ✨", icon: "Info" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon name={item.icon} size={16} color="var(--pulse-accent)" />
                    <div>
                      <div className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{item.label}</div>
                      <div className="text-sm text-white">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-2xl text-sm font-semibold text-white pulse-gradient-btn">
                Редактировать профиль
              </button>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-2">
              {[
                { icon: "Bell", label: "Уведомления", desc: "Звуки и вибрация" },
                { icon: "Lock", label: "Конфиденциальность", desc: "Блокировки и безопасность" },
                { icon: "Palette", label: "Оформление", desc: "Тема и цвета" },
                { icon: "Smartphone", label: "Устройства", desc: "Привязанные сессии" },
                { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка" },
                { icon: "LogOut", label: "Выйти", desc: "Завершить сессию" },
              ].map(item => (
                <button key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all hover:bg-white/5 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                    style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                    <Icon name={item.icon} size={18} color={item.label === "Выйти" ? "#ef4444" : "var(--pulse-accent)"} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: item.label === "Выйти" ? "#ef4444" : "white" }}>{item.label}</div>
                    <div className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{item.desc}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} color="var(--pulse-text-muted)" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Chat */}
      <div className="flex-1 flex flex-col" style={{ background: "var(--pulse-bg)", minWidth: 0 }}>
        {activeChatContact && activeChatId ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--pulse-border)", background: "var(--pulse-surface)" }}>
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${activeChatContact.color}, ${activeChatContact.color}99)` }}>
                  {activeChatContact.avatar}
                </div>
                {activeChatContact.status === "online" && <div className="absolute -bottom-0.5 -right-0.5 pulse-online-dot" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{activeChatContact.name}</div>
                <div className="text-xs" style={{ color: activeChatContact.status === "online" ? "var(--pulse-online)" : "var(--pulse-text-muted)" }}>
                  {activeChatContact.status === "online" ? "в сети" : `был(а) ${activeChatContact.lastSeen}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startCall("audio", activeChatContact)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="Phone" size={18} color="var(--pulse-accent)" />
                </button>
                <button onClick={() => startCall("video", activeChatContact)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="Video" size={18} color="var(--pulse-accent-2)" />
                </button>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="MoreVertical" size={18} color="var(--pulse-text-muted)" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3 relative">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
              </div>

              {activeChat?.messages.map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  {msg.from === "them" && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 self-end mb-0.5"
                      style={{ background: `linear-gradient(135deg, ${activeChatContact.color}, ${activeChatContact.color}99)` }}>
                      {activeChatContact.avatar[0]}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 ${msg.from === "me" ? "pulse-msg-bubble-out" : "pulse-msg-bubble-in"}`}>
                    <p className="text-sm leading-relaxed" style={{ color: "white" }}>{msg.text}</p>
                    <div className="text-xs mt-1" style={{ color: msg.from === "me" ? "rgba(255,255,255,0.6)" : "var(--pulse-text-muted)" }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid var(--pulse-border)", background: "var(--pulse-surface)" }}>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="Paperclip" size={18} color="var(--pulse-text-muted)" />
                </button>
                <input value={message} onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Написать сообщение..."
                  className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{
                    background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)",
                    fontFamily: "Golos Text, sans-serif", color: "var(--pulse-text)"
                  }} />
                <button className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}>
                  <Icon name="Smile" size={18} color="var(--pulse-text-muted)" />
                </button>
                <button onClick={sendMessage}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 pulse-gradient-btn"
                  style={{ opacity: message.trim() ? 1 : 0.5 }}>
                  <Icon name="Send" size={18} color="white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-slide-up">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-gradient-btn">
                <Icon name="MessageCircle" size={44} color="white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pulse</h3>
              <p className="text-sm" style={{ color: "var(--pulse-text-muted)" }}>Выберите чат, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
