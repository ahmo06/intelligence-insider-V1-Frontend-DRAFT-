import { apiFetch } from "@/lib/api/client";
import type { FixtureKey } from "@/types";
import { API_ENDPOINTS } from "@/fixtures/registry";
import { loadFixture } from "./loadFixture";

export const USE_FIXTURES =
  process.env.NEXT_PUBLIC_USE_FIXTURES !== "false";

export async function getData<T>(key: FixtureKey): Promise<T> {
  if (USE_FIXTURES) {
    return loadFixture<T>(key);
  }

  const path = API_ENDPOINTS[key];
  const method = path === "/api/auth/me" ? "GET" : "POST";
  return apiFetch<T>(path, { method });
}
