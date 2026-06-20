export interface PlanUsage {
  totalSpend: number;
  includedSpend: number;
  bonusSpend: number;
  limit: number;
  remainingBonus: boolean;
  bonusTooltip?: string;
  autoPercentUsed: number;
  apiPercentUsed: number;
  totalPercentUsed: number;
}

export interface CurrentPeriodUsageResponse {
  billingCycleStart: string;
  billingCycleEnd: string;
  planUsage: PlanUsage;
  spendLimitUsage: { limitType: string };
  displayThreshold: number;
  enabled: boolean;
  displayMessage: string;
  autoModelSelectedDisplayMessage: string;
  namedModelSelectedDisplayMessage: string;
  autoBucketModels: string[];
}

export interface CreditGrantsBalanceResponse {
  hasCreditGrants: boolean;
}

export interface CurrentBillingCycleResponse {
  startDateEpochMillis: string;
  endDateEpochMillis: string;
}

export interface DailyMetric {
  date: string;
  linesAdded?: number;
  linesDeleted?: number;
  acceptedLinesAdded?: number;
  acceptedLinesDeleted?: number;
  totalApplies?: number;
  totalAccepts?: number;
  chatRequests?: number;
  agentRequests?: number;
  subscriptionIncludedReqs?: number;
  modelUsage?: Array<{ name: string; count?: number }>;
  extensionUsage?: Array<{ name: string; count?: number }>;
}

export interface UserAnalyticsResponse {
  dailyMetrics: DailyMetric[];
}

export interface DashboardData {
  periodUsage: CurrentPeriodUsageResponse;
  creditGrants: CreditGrantsBalanceResponse;
  billingCycle: CurrentBillingCycleResponse;
  analytics: UserAnalyticsResponse;
}
