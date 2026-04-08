import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  // The Supabase SSR client sets/clears cookies automatically via the
  // server.ts cookie handlers, but we redirect to /login at the page level.
  return response;
}
