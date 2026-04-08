// Re-export Supabase server client as the default DB accessor.
// Use createClient() from @/lib/supabase/server in server components/routes,
// and createClient() from @/lib/supabase/client in browser components.
export { createClient as getDb } from "@/lib/supabase/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the active organization for the authenticated user.
 * Returns the organization_id string, or null if unauthenticated.
 * Takes the first membership — assumes single-org for now.
 */
export async function getActiveOrgId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("organization_memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return data?.organization_id ?? null;
}
