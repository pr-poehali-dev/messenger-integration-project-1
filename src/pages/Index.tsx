import { useState } from "react";
import { Tab, CallType, CONTACTS, INITIAL_CHATS, NOTIFICATIONS } from "@/components/messenger/types";
import CallModal from "@/components/messenger/CallModal";
import Sidebar from "@/components/messenger/Sidebar";
import MiddlePanel from "@/components/messenger/MiddlePanel";
import ChatPanel from "@/components/messenger/ChatPanel";
import type { Contact } from "@/components/messenger/types";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChatId, setActiveChatId] = useState<number | null>(1);
  const [callType, setCallType] = useState<CallType>(null);
  const [callContact, setCallContact] = useState<Contact | null>(null);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [searchQuery, setSearchQuery] = useState("");

  const activeChat = chats.find((c) => c.id === activeChatId);
  const activeChatContact = activeChat ? CONTACTS.find((c) => c.id === activeChat.contactId) : null;
  const unreadNotifs = NOTIFICATIONS.filter((n) => !n.read).length;

  const startCall = (type: CallType, contact: Contact) => {
    setCallType(type);
    setCallContact(contact);
  };

  const endCall = () => {
    setCallType(null);
    setCallContact(null);
  };

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = chats.filter((chat) => {
    const contact = CONTACTS.find((c) => c.id === chat.contactId);
    return !searchQuery || contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectContact = (contact: Contact) => {
    const chat = chats.find((c) => c.contactId === contact.id);
    if (chat) {
      setActiveChatId(chat.id);
      setActiveTab("chats");
    }
  };

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
      {callType && callContact && (
        <CallModal callType={callType} callContact={callContact} onEndCall={endCall} />
      )}

      <Sidebar activeTab={activeTab} navItems={navItems} onTabChange={setActiveTab} />

      <MiddlePanel
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredChats={filteredChats}
        filteredContacts={filteredContacts}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onSelectContact={handleSelectContact}
        onStartCall={startCall}
        notifications={NOTIFICATIONS}
        onTabChange={setActiveTab}
      />

      <ChatPanel
        activeChat={activeChat}
        activeChatContact={activeChatContact}
        onStartCall={startCall}
      />
    </div>
  );
};

export default Index;
