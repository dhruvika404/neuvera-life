"use client";

import * as React from "react";

type SheetContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue>({ open: false });

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open, onOpenChange } = React.useContext(SheetContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close panel"
        className="absolute inset-0 bg-black/30"
        onClick={() => onOpenChange?.(false)}
      />
      <div className={`absolute right-0 top-0 h-full shadow-xl ${className ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

export function SheetTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={className}>{children}</h2>;
}

export function SheetDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={className}>{children}</p>;
}
