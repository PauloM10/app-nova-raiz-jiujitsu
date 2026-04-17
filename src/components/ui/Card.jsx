import { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Card = forwardRef(function Card(
  { className = "", children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("rounded-3xl border border-zinc-100 bg-white shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = forwardRef(function CardHeader(
  { className = "", children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn("p-5 pb-2", className)} {...props}>
      {children}
    </div>
  );
});

export const CardTitle = forwardRef(function CardTitle(
  { className = "", children, ...props },
  ref
) {
  return (
    <h3 ref={ref} className={cn("text-base font-semibold", className)} {...props}>
      {children}
    </h3>
  );
});

export const CardContent = forwardRef(function CardContent(
  { className = "", children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
});