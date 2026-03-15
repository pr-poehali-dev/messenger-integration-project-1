import Icon from "@/components/ui/icon";
import { Tab, Contact, Chat, Notification, CallType } from "./types";

interface MiddlePanelProps {
  activeTab: Tab;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredChats: Chat[];
  filteredContacts: Contact[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onSelectContact: (contact: Contact) => void;
  onStartCall: (type: CallType, contact: Contact) => void;
  notifications: Notification[];
  onTabChange: (tab: Tab) => void;
}

const MiddlePanel = ({
  activeTab,
  searchQuery,
  onSearchChange,
  filteredChats,
  filteredContacts,
  activeChatId,
  onSelectChat,
  onSelectContact,
  onStartCall,
  notifications,
  onTabChange,
}: MiddlePanelProps) => {
  const CONTACTS_MAP: Record<number, Contact> = {};
  filteredContacts.forEach((c) => { CONTACTS_MAP[c.id] = c; });

  const titles: Record<Tab, string> = {
    chats: "Сообщения",
    contacts: "Контакты",
    search: "Поиск",
    notifications: "Уведомления",
    profile: "Профиль",
    settings: "Настройки",
  };

  return (
    <div
      className="flex flex-col"
      style={{
        width: 320,
        flexShrink: 0,
        borderRight: "1px solid var(--pulse-border)",
        background: "var(--pulse-surface)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{titles[activeTab]}</h2>
          {activeTab === "chats" && (
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
            >
              <Icon name="Plus" size={18} color="var(--pulse-accent)" />
            </button>
          )}
        </div>

        {(activeTab === "chats" || activeTab === "contacts" || activeTab === "search") && (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="Search" size={16} color="var(--pulse-text-muted)" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none text-white"
              style={{
                background: "var(--pulse-surface-2)",
                border: "1px solid var(--pulse-border)",
                fontFamily: "Golos Text, sans-serif",
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 pb-4">

        {/* CHATS */}
        {activeTab === "chats" && (
          <div className="flex flex-col gap-1">
            {filteredChats.map((chat) => {
              const contact = filteredContacts.find((c) => c.id === chat.contactId);
              if (!contact) return null;
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isActive = activeChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all"
                  style={{
                    background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}
                    >
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
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all hover:bg-white/5"
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}
                  >
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
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartCall("audio", contact); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "var(--pulse-surface-2)" }}
                  >
                    <Icon name="Phone" size={14} color="var(--pulse-accent)" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartCall("video", contact); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "var(--pulse-surface-2)" }}
                  >
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
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => onSelectContact(contact)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all hover:bg-white/5"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${contact.color}, ${contact.color}99)` }}
                      >
                        {contact.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{contact.name}</div>
                        <div className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{contact.lastSeen}</div>
                      </div>
                    </button>
                  ))
                ) : (
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
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 px-3 py-3 rounded-2xl"
                style={{
                  background: !notif.read ? "rgba(139,92,246,0.08)" : "transparent",
                  border: !notif.read ? "1px solid rgba(139,92,246,0.15)" : "1px solid transparent",
                }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: notif.type === "call" ? "rgba(239,68,68,0.15)" : "rgba(139,92,246,0.15)" }}
                >
                  <Icon
                    name={notif.type === "call" ? "PhoneOff" : notif.type === "contact" ? "UserPlus" : "MessageCircle"}
                    size={18}
                    color={notif.type === "call" ? "#ef4444" : "var(--pulse-accent)"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-snug">{notif.text}</p>
                  <span className="text-xs" style={{ color: "var(--pulse-text-muted)" }}>{notif.time}</span>
                </div>
                {!notif.read && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ background: "var(--pulse-accent)", boxShadow: "0 0 6px var(--pulse-accent)" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white animate-pulse-ring"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #f472b6)", boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
              >
                ЯВ
              </div>
              <div className="absolute -bottom-1 -right-1 pulse-online-dot" style={{ width: 14, height: 14 }} />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">Я Владелец</div>
              <div className="text-sm pulse-gradient-text font-medium">@me</div>
            </div>
            <div
              className="w-full rounded-2xl p-4 mt-2 flex flex-col gap-3"
              style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
            >
              {[
                { label: "Статус", value: "В сети", icon: "Circle" },
                { label: "Телефон", value: "+7 999 000-00-00", icon: "Phone" },
                { label: "О себе", value: "Создаю крутые продукты ✨", icon: "Info" },
              ].map((item) => (
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
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-left transition-all hover:bg-white/5 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                  style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
                >
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
  );
};

export default MiddlePanel;
