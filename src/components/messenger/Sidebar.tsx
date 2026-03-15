import Icon from "@/components/ui/icon";
import { Tab } from "./types";

interface NavItem {
  tab: Tab;
  icon: string;
  label: string;
  badge?: number;
}

interface SidebarProps {
  activeTab: Tab;
  navItems: NavItem[];
  onTabChange: (tab: Tab) => void;
}

const Sidebar = ({ activeTab, navItems, onTabChange }: SidebarProps) => {
  return (
    <div
      className="flex flex-col items-center py-6 gap-2 z-10"
      style={{
        width: 72,
        background: "var(--pulse-surface)",
        borderRight: "1px solid var(--pulse-border)",
        flexShrink: 0,
      }}
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 pulse-gradient-btn">
        <Icon name="Zap" size={20} color="white" />
      </div>

      {navItems.map((item) => (
        <button
          key={item.tab}
          onClick={() => onTabChange(item.tab)}
          className={`pulse-nav-item w-12 h-12 rounded-2xl flex items-center justify-center relative ${activeTab === item.tab ? "active" : ""}`}
          title={item.label}
        >
          <Icon
            name={item.icon}
            size={22}
            color={activeTab === item.tab ? "var(--pulse-accent)" : "var(--pulse-text-muted)"}
          />
          {item.badge ? (
            <span
              className="absolute top-1 right-1 w-5 h-5 rounded-full text-white flex items-center justify-center font-bold"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", fontSize: 10 }}
            >
              {item.badge}
            </span>
          ) : null}
        </button>
      ))}

      <div className="flex-1" />

      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #f472b6)", boxShadow: "0 0 15px rgba(139,92,246,0.4)" }}
        onClick={() => onTabChange("profile")}
      >
        ЯВ
      </div>
    </div>
  );
};

export default Sidebar;
