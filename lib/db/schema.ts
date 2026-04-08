/**
 * Re-export generated DB types for convenience.
 * The authoritative type definitions live in types/database.ts (auto-generated
 * from Supabase) and types/dtos.ts (hand-authored camelCase DTOs).
 *
 * Prefer importing directly from those files; this re-export exists for
 * backward compatibility during migration.
 */
export type { Database } from "@/types/database";
export type * from "@/types/dtos";
