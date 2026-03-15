import Icon from "@/components/ui/icon";
import { CallType, Contact } from "./types";

interface CallModalProps {
  callType: CallType;
  callContact: Contact;
  onEndCall: () => void;
}

const CallModal = ({ callType, callContact, onEndCall }: CallModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: "rgba(5,5,20,0.95)", backdropFilter: "blur(30px)" }}
    >
      <div className="flex flex-col items-center gap-8 animate-slide-up">
        <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
          <div
            className="absolute inset-0 rounded-full wave-ring"
            style={{ background: `${callContact.color}20`, border: `2px solid ${callContact.color}40` }}
          />
          <div
            className="absolute inset-0 rounded-full wave-ring-2"
            style={{ background: `${callContact.color}10`, border: `2px solid ${callContact.color}30` }}
          />
          <div
            className="absolute inset-0 rounded-full wave-ring-3"
            style={{ background: `${callContact.color}08`, border: `2px solid ${callContact.color}20` }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${callContact.color}, ${callContact.color}99)`,
              boxShadow: `0 0 40px ${callContact.color}60`,
            }}
          >
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
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ width: 240, height: 135, background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <div className="text-center">
              <Icon name="VideoOff" size={32} color="var(--pulse-text-muted)" />
              <div className="text-xs mt-2" style={{ color: "var(--pulse-text-muted)" }}>Камера недоступна</div>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-center">
          {callType === "video" && (
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
            >
              <Icon name="Video" size={22} color="white" />
            </button>
          )}
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Mic" size={22} color="white" />
          </button>
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 8px 25px rgba(239,68,68,0.4)" }}
          >
            <Icon name="PhoneOff" size={26} color="white" />
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--pulse-surface-2)", border: "1px solid var(--pulse-border)" }}
          >
            <Icon name="Volume2" size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
