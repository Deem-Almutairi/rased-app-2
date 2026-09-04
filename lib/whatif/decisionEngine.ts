import type { WhatIfOption, DecisionWeights } from "@/lib/types";
import { clamp } from "@/lib/utils";

export const DEFAULT_DECISION_WEIGHTS: DecisionWeights = {
  serviceImpact: 0.3,
  delay: 0.25,
  cost: 0.2,
  risk: 0.15,
  resourceEfficiency: 0.1,
};

export interface ScoredWhatIfOption extends WhatIfOption {
  decisionScore: number; // 0-100, higher = more recommended
  penalty: number;
  normalizedDelay: number;
  normalizedCost: number;
}

function normalize(value: number, min: number, max: number) {
  if (max - min === 0) return 0;
  return clamp(((value - min) / (max - min)) * 100);
}

export function computeDecisionScores(
  options: WhatIfOption[],
  weights: DecisionWeights = DEFAULT_DECISION_WEIGHTS
): ScoredWhatIfOption[] {
  const delays = options.map((o) => o.delayDays);
  const costs = options.map((o) => o.costUSD);
  const minDelay = Math.min(...delays);
  const maxDelay = Math.max(...delays);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  const scored = options.map((option) => {
    const normalizedDelay = normalize(option.delayDays, minDelay, maxDelay);
    const normalizedCost = normalize(option.costUSD, minCost, maxCost);
    const penalty =
      weights.serviceImpact * option.serviceImpact +
      weights.delay * normalizedDelay +
      weights.cost * normalizedCost +
      weights.risk * option.risk +
      weights.resourceEfficiency * option.resourceRequirement;
    const decisionScore = clamp(100 - penalty);
    return { ...option, decisionScore, penalty, normalizedDelay, normalizedCost };
  });

  return scored.sort((a, b) => b.decisionScore - a.decisionScore);
}
