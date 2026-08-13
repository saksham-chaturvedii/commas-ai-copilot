import { type LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function FilterPill({ icon: Icon, label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="filter-pill"
      style={
        active
          ? { boxShadow: "0 0 0 2px rgba(78,133,227,0.35)", borderColor: "rgba(0,0,0,0.1)" }
          : undefined
      }
    >
      <Icon size={16} strokeWidth={1.75} />
      {label}
    </button>
  );
}
