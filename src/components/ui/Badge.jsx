function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Badge({ className = "", variant = "default", children }) {
  const styles = variant === "secondary" ? "bg-zinc-100 text-zinc-700" : "bg-red-600 text-white";

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", styles, className)}>
      {children}
    </span>
  );
}