import type { RootCauseCode, Owner, RemedyType } from "./taxonomy/taxonomy.schema";

export interface RemedyRoute {
  root_cause_code: RootCauseCode;
  owner: Owner;
  remedy_type: RemedyType;
  requires_in_person: boolean;
  can_self_service: boolean;
  escalation_tier: string;
}

const ROUTING_MAP: Record<RootCauseCode, RemedyRoute> = {
  RC01: {
    root_cause_code: "RC01",
    owner: "MEMBER_SELF",
    remedy_type: "member_correction",
    requires_in_person: false,
    can_self_service: true,
    escalation_tier: "Employer HR (approval) → EPFO Field Office → EPFiGMS Grievance",
  },
  RC02: {
    root_cause_code: "RC02",
    owner: "MEMBER_SELF",
    remedy_type: "member_correction",
    requires_in_person: false,
    can_self_service: true,
    escalation_tier: "Employer HR (approval) → EPFO Field Office → EPFiGMS Grievance",
  },
  RC03: {
    root_cause_code: "RC03",
    owner: "BANK",
    remedy_type: "bank_fix",
    requires_in_person: true,
    can_self_service: false,
    escalation_tier: "Bank Branch Manager → EPFO Field Office → EPFiGMS Grievance",
  },
  RC04: {
    root_cause_code: "RC04",
    owner: "EMPLOYER",
    remedy_type: "employer_request",
    requires_in_person: false,
    can_self_service: false,
    escalation_tier: "Previous Employer HR → EPFiGMS Grievance → Regional PF Commissioner (RPFC)",
  },
  UNKNOWN: {
    root_cause_code: "UNKNOWN",
    owner: "EPFO_OFFICE",
    remedy_type: "epfigms_grievance",
    requires_in_person: false,
    can_self_service: true,
    escalation_tier: "EPFiGMS Grievance → EPFO Field Office → Regional PF Commissioner (RPFC)",
  },
};

export function routeRemedy(rootCause: RootCauseCode): RemedyRoute {
  return ROUTING_MAP[rootCause] ?? ROUTING_MAP.UNKNOWN;
}
