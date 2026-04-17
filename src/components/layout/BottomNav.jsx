import {
  CalendarDays,
  Home,
  ShoppingBag,
  User,
} from "lucide-react";

export default function BottomNav({ current, onChange }) {
  const items = [
    ["home", Home, "Home"],
    ["agenda", CalendarDays, "Agenda"],
    ["loja", ShoppingBag, "Loja"],
    ["perfil", User, "Perfil"],
  ];

  return (
    <div className="sticky bottom-0 border-t bg-white px-2 py-2 grid grid-cols-4 gap-1">
      {items.map(([key, Icon, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-2xl px-2 py-2 text-xs flex flex-col items-center gap-1 transition-all ${
            current === key
              ? "bg-red-600 text-white"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}