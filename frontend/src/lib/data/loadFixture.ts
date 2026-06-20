import type { FixtureKey } from "@/types";
import { FIXTURE_PATHS } from "@/fixtures/registry";

type FixtureModule = { default: unknown };

const fixtureLoaders: Record<FixtureKey, () => Promise<FixtureModule>> = {
  "auth/me": () => import("@/fixtures/api/auth/me.json"),
  "background-composer/list": () =>
    import("@/fixtures/api/background-composer/list.json"),
  "background-composer/get-detailed-composer": () =>
    import("@/fixtures/api/background-composer/get-detailed-composer.json"),
  "background-composer/list-artifacts": () =>
    import("@/fixtures/api/background-composer/list-artifacts.json"),
  "background-composer/thread-turns-portal": () =>
    import("@/fixtures/api/background-composer/thread-turns-portal.json"),
  "background-composer/interaction-states": () =>
    import("@/fixtures/api/background-composer/interaction-states.json"),
  "background-composer/list-changed-files": () =>
    import("@/fixtures/api/background-composer/list-changed-files.json"),
  "background-composer/list-workspace-files": () =>
    import("@/fixtures/api/background-composer/list-workspace-files.json"),
  "background-composer/get-diff-details": () =>
    import("@/fixtures/api/background-composer/get-diff-details.json"),
  "background-composer/get-terminal-output": () =>
    import("@/fixtures/api/background-composer/get-terminal-output.json"),
  "background-composer/create": () =>
    import("@/fixtures/api/background-composer/create.json"),
  "orchestration/portal-session": () =>
    import("@/fixtures/api/orchestration/portal-session.json"),
  "projects/list": () => import("@/fixtures/api/projects/list.json"),
  "automations/list-automations": () =>
    import("@/fixtures/api/automations/list-automations.json"),
  "dashboard/get-current-period-usage": () =>
    import("@/fixtures/api/dashboard/get-current-period-usage.json"),
  "dashboard/get-credit-grants-balance": () =>
    import("@/fixtures/api/dashboard/get-credit-grants-balance.json"),
  "dashboard/get-current-billing-cycle": () =>
    import("@/fixtures/api/dashboard/get-current-billing-cycle.json"),
  "dashboard/get-user-analytics": () =>
    import("@/fixtures/api/dashboard/get-user-analytics.json"),
  "dashboard/get-user-profile": () =>
    import("@/fixtures/api/dashboard/get-user-profile.json"),
};

export async function loadFixture<T>(key: FixtureKey): Promise<T> {
  const loader = fixtureLoaders[key];
  if (!loader) {
    throw new Error(
      `No fixture loader for key "${key}". Expected path: ${FIXTURE_PATHS[key]}`,
    );
  }
  const mod = await loader();
  return mod.default as T;
}
