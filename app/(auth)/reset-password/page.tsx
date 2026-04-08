"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Step = "request" | "sent" | "update" | "done";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      setStep("sent");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({ password });

      if (authError) {
        setError(authError.message);
        return;
      }

      setStep("done");
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

        <div
          style={{
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border)",
            borderRadius: 12,
            padding: "28px 28px 24px",
            boxShadow: "0 2px 12px rgba(26,23,19,0.06)",
          }}
        >
          {step === "request" && (
            <>
              <h1 style={headingStyle}>Reset password</h1>
              <p style={subStyle}>
                Enter your email and we&rsquo;ll send you a reset link.
              </p>
              <form onSubmit={handleRequestReset}>
                <div style={{ marginBottom: 20 }}>
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
                {error && <ErrorBox message={error} />}
                <SubmitButton loading={loading} label="Send reset link" />
              </form>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <a href="/login" style={linkStyle}>
                  Back to sign in
                </a>
              </div>
            </>
          )}

          {step === "sent" && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{ fontSize: 32, marginBottom: 12 }}
                role="img"
                aria-label="email"
              >
                ✉️
              </div>
              <h1 style={headingStyle}>Check your email</h1>
              <p style={{ ...subStyle, marginBottom: 24 }}>
                We sent a reset link to <strong>{email}</strong>. Click the
                link to set a new password.
              </p>
              <a href="/login" style={linkStyle}>
                Back to sign in
              </a>
            </div>
          )}

          {step === "update" && (
            <>
              <h1 style={headingStyle}>Set new password</h1>
              <p style={subStyle}>Choose a strong password for your account.</p>
              <form onSubmit={handleUpdatePassword}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
                {error && <ErrorBox message={error} />}
                <SubmitButton loading={loading} label="Update password" />
              </form>
            </>
          )}

          {step === "done" && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <h1 style={headingStyle}>Password updated</h1>
              <p style={{ ...subStyle, marginBottom: 24 }}>
                Your password has been changed successfully.
              </p>
              <a
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "9px 20px",
                  background: "var(--color-gold)",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign in
              </a>
            </div>
          )}
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

function ErrorBox({ message }: { message: string }) {
  return (
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
      {message}
    </div>
  );
}

function SubmitButton({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "9px 0",
        background: loading ? "var(--color-gold-l)" : "var(--color-gold)",
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
      {loading ? "Please wait…" : label}
    </button>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: "var(--color-ink)",
  marginBottom: 4,
};

const subStyle: React.CSSProperties = {
  fontSize: 12.5,
  color: "var(--color-ink3)",
  marginBottom: 22,
};

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

const linkStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--color-gold)",
  textDecoration: "none",
};
