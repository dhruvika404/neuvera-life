export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 py-2 px-1">
      <div
        className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
        style={{ background: "var(--color-s3)", color: "var(--color-ink3)" }}
      >
        AI
      </div>
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm"
        style={{ background: "var(--color-s2)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-typing"
            style={{
              background: "var(--color-ink3)",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
