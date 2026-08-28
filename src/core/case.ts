import {
  CaseObject,
  CaseStatus,
  Scheme,
  CaseInputType,
  RootCauseCode,
  Owner,
  RemedyType,
} from "./taxonomy/taxonomy.schema";

export type { CaseObject, CaseStatus, Scheme, CaseInputType };

export const VALID_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  diagnosed: ["action_taken"],
  action_taken: ["awaiting_cycle"],
  awaiting_cycle: ["resolved"],
  resolved: [],
};

export function canTransition(current: CaseStatus, target: CaseStatus): boolean {
  return VALID_TRANSITIONS[current]?.includes(target) ?? false;
}

export function transitionCase(
  caseObj: CaseObject,
  targetStatus: CaseStatus
): CaseObject {
  if (!canTransition(caseObj.status, targetStatus)) {
    throw new Error(
      `Invalid case status transition from '${caseObj.status}' to '${targetStatus}'.`
    );
  }
  return {
    ...caseObj,
    status: targetStatus,
  };
}

export function createInitialCase(params: {
  scheme: Scheme;
  raw_input_type: CaseInputType;
  raw_error_text: string;
  extraction_confidence: number;
  root_cause_code: RootCauseCode;
  owner: Owner;
  diagnosis_confidence: number;
  remedy_type: RemedyType;
  language: "hi" | "en";
  steps: string[];
  estimated_timeline_days: string;
}): CaseObject {
  const case_id = `CASE-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

  const initial: CaseObject = {
    case_id,
    scheme: params.scheme,
    raw_input_type: params.raw_input_type,
    extracted: {
      raw_error_text: params.raw_error_text,
      confidence: params.extraction_confidence,
    },
    diagnosis: {
      root_cause_code: params.root_cause_code,
      owner: params.owner,
      confidence: params.diagnosis_confidence,
    },
    remedy: {
      type: params.remedy_type,
      language: params.language,
      steps: params.steps,
      estimated_timeline_days: params.estimated_timeline_days,
    },
    status: "diagnosed",
  };

  return CaseObject.parse(initial);
}
