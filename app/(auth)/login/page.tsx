"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Wrap in Suspense because useSearchParams() requires it during static rendering
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      const next = searchParams.get("next") ?? "/";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ width: 380 }}>
        {/* Logo / wordmark */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontSize: 26,
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Neuv<span style={{ color: "var(--color-gold)" }}>é</span>raNet
          </div>
          <div style={{ fontSize: 13, color: "var(--color-ink3)" }}>
            AI Marketing &amp; Sales Platform
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: 12,
            padding: "28px 28px 24px",
            boxShadow: "0 2px 12px rgba(26,23,19,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: 4,
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontSize: 12.5,
              color: "var(--color-ink3)",
              marginBottom: 22,
            }}
          >
            Enter your credentials to access the platform.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <a
                href="/reset-password"
                style={{
                  fontSize: 12,
                  color: "var(--color-gold)",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-red)",
                  background: "var(--color-red-bg)",
                  border: "0.5px solid #F2BFBF",
                  borderRadius: 6,
                  padding: "7px 12px",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "9px 0",
                background: loading
                  ? "var(--color-gold-l)"
                  : "var(--color-gold)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11.5,
            color: "var(--color-ink4)",
            marginTop: 20,
          }}
        >
          © 2026 Neuvera Life · NeuvéraNet v0.1
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--color-ink2)",
  marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  background: "var(--color-s2)",
  border: "0.5px solid var(--color-border)",
  borderRadius: 6,
  fontSize: 13,
  color: "var(--color-ink)",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};
