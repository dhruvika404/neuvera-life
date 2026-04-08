"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Supabase sends invite tokens as hash fragments: #access_token=...&type=invite
  // The client SDK automatically exchanges these on load.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "USER_UPDATED" || event === "SIGNED_IN") {
        setTokenValid(true);
      }
    });

    // Check if we already have a session from the invite token exchange
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setTokenValid(true);
      else setTokenValid(false);
    });
  }, []);

  async function handleAccept(e: React.FormEvent) {
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

      // Set the permanent password and update the profile in one go
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { full_name: fullName.trim() || undefined },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/");
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
          {tokenValid === null && (
            <p style={{ fontSize: 13, color: "var(--color-ink3)" }}>
              Verifying your invitation…
            </p>
          )}

          {tokenValid === false && (
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  marginBottom: 8,
                }}
              >
                Invalid or expired invite
              </h1>
              <p
                style={{
                  fontSize: 12.5,
                  color: "var(--color-ink3)",
                  marginBottom: 20,
                }}
              >
                This invitation link is no longer valid. Please ask your
                administrator to resend the invite.
              </p>
              <a
                href="/login"
                style={{ fontSize: 12, color: "var(--color-gold)" }}
              >
                Back to sign in
              </a>
            </div>
          )}

          {tokenValid === true && (
            <>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  marginBottom: 4,
                }}
              >
                Accept your invitation
              </h1>
              <p
                style={{
                  fontSize: 12.5,
                  color: "var(--color-ink3)",
                  marginBottom: 22,
                }}
              >
                Set a password to activate your NeuvéraNet account.
              </p>

              <form onSubmit={handleAccept}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
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
                  {loading ? "Activating…" : "Activate account"}
                </button>
              </form>
            </>
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
