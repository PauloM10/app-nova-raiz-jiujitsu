function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({ className = "", children, variant = "default", ...props }) {
  const styles =
    variant === "outline"
      ? "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
      : "bg-red-600 text-white hover:bg-red-700";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition active:scale-[0.98]",
        styles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}