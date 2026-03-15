export type Tab = "chats" | "contacts" | "search" | "notifications" | "profile" | "settings";
export type CallType = "audio" | "video" | null;

export interface Contact {
  id: number;
  name: string;
  status: string;
  avatar: string;
  color: string;
  lastSeen: string;
}

export interface Message {
  id: number;
  from: string;
  text: string;
  time: string;
}

export interface Chat {
  id: number;
  contactId: number;
  messages: Message[];
}

export interface Notification {
  id: number;
  type: string;
  text: string;
  time: string;
  read: boolean;
}

export const CONTACTS: Contact[] = [
  { id: 1, name: "Аня Морозова", status: "online", avatar: "АМ", color: "#8b5cf6", lastSeen: "сейчас" },
  { id: 2, name: "Дима Козлов", status: "offline", avatar: "ДК", color: "#06b6d4", lastSeen: "1ч назад" },
  { id: 3, name: "Саша Белова", status: "online", avatar: "СБ", color: "#f472b6", lastSeen: "сейчас" },
  { id: 4, name: "Игорь Петров", status: "offline", avatar: "ИП", color: "#34d399", lastSeen: "вчера" },
  { id: 5, name: "Катя Новикова", status: "online", avatar: "КН", color: "#fb923c", lastSeen: "сейчас" },
  { id: 6, name: "Макс Орлов", status: "away", avatar: "МО", color: "#a78bfa", lastSeen: "5м назад" },
];

export const INITIAL_CHATS: Chat[] = [
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

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "message", text: "Аня Морозова прислала сообщение", time: "только что", read: false },
  { id: 2, type: "call", text: "Пропущенный звонок от Дима Козлов", time: "1ч назад", read: false },
  { id: 3, type: "contact", text: "Катя Новикова добавила вас в контакты", time: "вчера", read: true },
  { id: 4, type: "message", text: "Саша Белова: 'Ты уже видела...'", time: "вчера", read: true },
];
