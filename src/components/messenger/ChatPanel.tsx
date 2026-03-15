import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Contact, Chat, CallType } from "./types";

interface ChatPanelProps {
  activeChat: Chat | undefined;
  activeChatContact: Contact | undefined | null;
  onStartCall: (type: CallType, contact: Contact) => void;
}

const ChatPanel = ({ activeChat, activeChatContact, onStartCall }: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(activeChat?.messages ?? []);

  const currentMessages = activeChat ? messages : [];

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: "me",
        text: message.trim(),
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  if (!activeChatContact || !activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--pulse-bg)" }}>
        <div className="text-center animate-slide-up">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-gradient-btn">
            <Icon name="MessageCircle" size={44} color="white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Pulse</h3>
          <p className="text-sm" style={{ color: "var(--pulse-text-muted)" }}>Выберите чат, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: "var(--pulse-bg)", minWidth: 0 }}>
      {/* Chat Header */}
      <div
        className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--pulse-border)", background: "var(--pulse-surface)" }}
      >
        <div className="relative">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${activeChatContact.color}, ${activeChatContact.color}99)` }}
          >
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
          <button
            onClick={() => onStartCall("audio", activeChatContact)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Phone" size={18} color="var(--pulse-accent)" />
          </button>
          <button
            onClick={() => onStartCall("video", activeChatContact)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Video" size={18} color="var(--pulse-accent-2)" />
          </button>
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="MoreVertical" size={18} color="var(--pulse-text-muted)" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        {currentMessages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {msg.from === "them" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 self-end mb-0.5"
                style={{ background: `linear-gradient(135deg, ${activeChatContact.color}, ${activeChatContact.color}99)` }}
              >
                {activeChatContact.avatar[0]}
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 ${msg.from === "me" ? "pulse-msg-bubble-out" : "pulse-msg-bubble-in"}`}>
              <p className="text-sm leading-relaxed" style={{ color: "white" }}>{msg.text}</p>
              <div
                className="text-xs mt-1"
                style={{ color: msg.from === "me" ? "rgba(255,255,255,0.6)" : "var(--pulse-text-muted)" }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--pulse-border)", background: "var(--pulse-surface)" }}
      >
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Paperclip" size={18} color="var(--pulse-text-muted)" />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              background: "var(--pulse-surface-2)",
              border: "1px solid var(--pulse-border)",
              fontFamily: "Golos Text, sans-serif",
              color: "var(--pulse-text)",
            }}
          />
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Smile" size={18} color="var(--pulse-text-muted)" />
          </button>
          <button
            onClick={sendMessage}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 pulse-gradient-btn"
            style={{ opacity: message.trim() ? 1 : 0.5 }}
          >
            <Icon name="Send" size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
