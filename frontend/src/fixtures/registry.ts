import type { FixtureKey } from "@/types";

/** Maps each hook endpoint key to its fixture module path under fixtures/api/. */
export const FIXTURE_PATHS: Record<FixtureKey, string> = {
  "auth/me": "./api/auth/me.json",
  "background-composer/list": "./api/background-composer/list.json",
  "background-composer/get-detailed-composer":
    "./api/background-composer/get-detailed-composer.json",
  "background-composer/list-artifacts":
    "./api/background-composer/list-artifacts.json",
  "background-composer/thread-turns-portal":
    "./api/background-composer/thread-turns-portal.json",
  "background-composer/interaction-states":
    "./api/background-composer/interaction-states.json",
  "background-composer/list-changed-files":
    "./api/background-composer/list-changed-files.json",
  "background-composer/list-workspace-files":
    "./api/background-composer/list-workspace-files.json",
  "background-composer/get-diff-details":
    "./api/background-composer/get-diff-details.json",
  "background-composer/get-terminal-output":
    "./api/background-composer/get-terminal-output.json",
  "background-composer/create": "./api/background-composer/create.json",
  "orchestration/portal-session": "./api/orchestration/portal-session.json",
  "projects/list": "./api/projects/list.json",
  "automations/list-automations": "./api/automations/list-automations.json",
  "dashboard/get-current-period-usage":
    "./api/dashboard/get-current-period-usage.json",
  "dashboard/get-credit-grants-balance":
    "./api/dashboard/get-credit-grants-balance.json",
  "dashboard/get-current-billing-cycle":
    "./api/dashboard/get-current-billing-cycle.json",
  "dashboard/get-user-analytics": "./api/dashboard/get-user-analytics.json",
  "dashboard/get-user-profile": "./api/dashboard/get-user-profile.json",
};

/** Production API paths mirrored by the mock backend. */
export const API_ENDPOINTS: Record<FixtureKey, string> = {
  "auth/me": "/api/auth/me",
  "background-composer/list": "/api/background-composer/list",
  "background-composer/get-detailed-composer":
    "/api/background-composer/get-detailed-composer",
  "background-composer/list-artifacts":
    "/api/background-composer/list-artifacts",
  "background-composer/thread-turns-portal":
    "/api/background-composer/get-detailed-composer",
  "background-composer/interaction-states":
    "/api/background-composer/get-detailed-composer",
  "background-composer/list-changed-files":
    "/api/background-composer/list-changed-files",
  "background-composer/list-workspace-files":
    "/api/background-composer/list-workspace-files",
  "background-composer/get-diff-details":
    "/api/background-composer/get-diff-details",
  "background-composer/get-terminal-output":
    "/api/background-composer/get-terminal-output",
  "background-composer/create": "/api/background-composer/create",
  "orchestration/portal-session": "/api/orchestration/portal-session",
  "projects/list": "/api/projects/list",
  "automations/list-automations": "/api/automations/list-automations",
  "dashboard/get-current-period-usage":
    "/api/dashboard/get-current-period-usage",
  "dashboard/get-credit-grants-balance":
    "/api/dashboard/get-credit-grants-balance",
  "dashboard/get-current-billing-cycle":
    "/api/dashboard/get-current-billing-cycle",
  "dashboard/get-user-analytics": "/api/dashboard/get-user-analytics",
  "dashboard/get-user-profile": "/api/dashboard/get-user-profile",
};
