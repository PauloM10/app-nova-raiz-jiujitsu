function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-red-400",
        className
      )}
      {...props}
    />
  );
}