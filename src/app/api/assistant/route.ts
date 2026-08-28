import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * "Ask PF X-Ray" assistant — answers an EPFO member's question in plain
 * language (Hindi or English) and may return ONE app action to execute
 * (task execution, Amazon-Q style). OpenAI does the language understanding;
 * a deterministic keyword router is the fallback when no key is present, so
 * the assistant still helps and still routes without any API access.
 *
 * It never invents claim outcomes, balances, or real records — this is a
 * mock-data prototype.
 */

const ActionType = z.enum([
  "preflight",
  "job_switch",
  "decode",
  "my_pf",
  "open_case",
  "tracker",
  "transparency",
  "switch_language",
  "home",
  "none",
]);

const AssistantOut = z.object({
  reply: z.string(),
  action: z
    .object({
      type: ActionType,
      rc: z.enum(["RC01", "RC02", "RC03", "RC04", "RC05"]).nullable().optional(),
      lang: z.enum(["en", "hi"]).nullable().optional(),
    })
    .nullable(),
});

type AssistantOut = z.infer<typeof AssistantOut>;

const SYSTEM = `You are the "PF X-Ray" voice assistant for Indian EPFO (provident fund) members.
Answer in the SAME language the user used — Hindi or English — in at most 45 words, plain and calm.
You help with PF claim rejections and money questions. This is a prototype with 100% synthetic data:
never invent real balances, claim outcomes, deadlines, or government decisions.
You may trigger EXACTLY ONE app action (or none). Allowed actions:
- "job_switch": the member changed jobs (or is about to) and wants to know what could break in their PF — run the Job-Switch X-Ray prevention simulator. Prefer this when the member mentions changing/switching jobs, a new employer, or leaving a company.
- "preflight": run a pre-flight check before filing.
- "decode": decode a rejection remark the user already got.
- "my_pf": open the member's My PF home / demo login.
- "open_case": open the diagnosis for a specific blocker; set rc to RC01 (name mismatch), RC02 (date of birth), RC03 (bank KYC/IFSC), RC04 (exit date not updated by employer), or RC05 (multiple UAN / not merged).
- "tracker": show the resolution timeline.
- "transparency": show what is real vs mocked.
- "switch_language": set lang to "en" or "hi".
- "home": go to the landing page.
- "none": no navigation.
Pick open_case with the right rc when the user names a specific problem; otherwise preflight or decode as fits.`;

const CASE_TEXT: Record<string, string> = {
  RC01: "Claim rejected: Name mismatch as per Aadhaar",
  RC02: "Claim rejected: Date of Birth not matching Aadhaar",
  RC03: "Rejected: Bank KYC not verified / account inactive",
  RC04: "Rejected: Date of Exit not updated by employer",
  RC05: "Claim rejected: Multiple UAN found, previous PF account not transferred",
};

const GOLDEN: Record<string, string> = {
  RC01: "GC-01",
  RC02: "GC-03",
  RC03: "GC-04",
  RC04: "GC-05",
  RC05: "GC-07",
};

function heuristic(message: string, lang: "en" | "hi"): AssistantOut {
  const m = message.toLowerCase();
  const hi = lang === "hi";
  const has = (...keys: string[]) => keys.some((k) => m.includes(k));

  if (has("name", "नाम", "naam", "spelling", "aadhaar")) {
    return {
      reply: hi
        ? "लगता है नाम बेमेल है। मैं क्लेम एक्स-रे खोल रहा/रही हूँ।"
        : "Sounds like a name mismatch. Opening the Claim X-Ray for it.",
      action: { type: "open_case", rc: "RC01" },
    };
  }
  if (has("date of birth", "dob", "जन्म", "janm")) {
    return {
      reply: hi ? "जन्म तिथि बेमेल — एक्स-रे खोल रहा/रही हूँ।" : "Date-of-birth mismatch. Opening the X-Ray.",
      action: { type: "open_case", rc: "RC02" },
    };
  }
  if (has("bank", "kyc", "ifsc", "बैंक")) {
    return {
      reply: hi ? "बैंक केवाईसी समस्या — एक्स-रे खोल रहा/रही हूँ।" : "Bank KYC issue. Opening the X-Ray.",
      action: { type: "open_case", rc: "RC03" },
    };
  }
  if (has("exit", "employer", "निकास", "नियोक्ता")) {
    return {
      reply: hi ? "निकास तिथि की समस्या — एक्स-रे खोल रहा/रही हूँ।" : "Exit-date issue. Opening the X-Ray.",
      action: { type: "open_case", rc: "RC04" },
    };
  }
  if (has("uan", "merge", "two", "multiple", "यूएएन")) {
    return {
      reply: hi ? "कई यूएएन की समस्या — एक्स-रे खोल रहा/रही हूँ।" : "Multiple-UAN issue. Opening the X-Ray.",
      action: { type: "open_case", rc: "RC05" },
    };
  }
  if (
    has(
      "changed job",
      "change job",
      "changing job",
      "switched job",
      "switch job",
      "job switch",
      "job change",
      "new job",
      "left my job",
      "new employer",
      "naukri",
      "नौकरी",
      "जॉब",
    )
  ) {
    return {
      reply: hi
        ? "नौकरी बदली? जॉब-स्विच एक्स-रे से देखते हैं क्या टूट सकता है।"
        : "Changed jobs? Let's run the Job-Switch X-Ray to catch what could break.",
      action: { type: "job_switch" },
    };
  }
  if (has("reject", "rejected", "remark", "अस्वीकृत", "खारिज")) {
    return {
      reply: hi ? "अपनी अस्वीकृति टिप्पणी डिकोड करते हैं।" : "Let's decode your rejection remark.",
      action: { type: "decode" },
    };
  }
  if (has("balance", "money", "pf", "paisa", "पैसा", "बैलेंस", "पीएफ")) {
    return {
      reply: hi ? "आपका माय पीएफ खोल रहा/रही हूँ।" : "Opening your My PF.",
      action: { type: "my_pf" },
    };
  }
  if (has("hindi", "हिंदी")) return { reply: "हिंदी में बदल रहा/रही हूँ।", action: { type: "switch_language", lang: "hi" } };
  if (has("english", "अंग्रेज़ी", "angrezi")) return { reply: "Switching to English.", action: { type: "switch_language", lang: "en" } };
  if (has("real", "mock", "safe", "privacy", "पारदर्शिता")) {
    return { reply: hi ? "पारदर्शिता पृष्ठ खोल रहा/रही हूँ।" : "Opening the transparency page.", action: { type: "transparency" } };
  }

  return {
    reply: hi
      ? "मैं पीएफ दावा अस्वीकृति में मदद करता/करती हूँ। पहले जांचने के लिए प्री-फ्लाइट चलाएं?"
      : "I help with PF claim rejections. Want me to run a pre-flight check first?",
    action: { type: "preflight" },
  };
}

// Resolve an action into a client route (or a language switch signal).
function route(out: AssistantOut): { href: string | null; setLang: "en" | "hi" | null } {
  const a = out.action;
  if (!a) return { href: null, setLang: null };
  switch (a.type) {
    case "preflight":
      return { href: "/intake?tab=samples", setLang: null };
    case "job_switch":
      return { href: "/job-switch", setLang: null };
    case "decode":
      return { href: "/intake?tab=paste", setLang: null };
    case "my_pf":
      return { href: "/demo", setLang: null };
    case "tracker":
      return { href: "/tracker", setLang: null };
    case "transparency":
      return { href: "/transparency", setLang: null };
    case "home":
      return { href: "/", setLang: null };
    case "switch_language":
      return { href: null, setLang: a.lang === "hi" ? "hi" : "en" };
    case "open_case": {
      const rc = a.rc && CASE_TEXT[a.rc] ? a.rc : "RC01";
      const text = encodeURIComponent(CASE_TEXT[rc]);
      const scheme = rc === "RC03" ? "PF_ADVANCE" : "FINAL_SETTLEMENT";
      return { href: `/diagnosis?scheme=${scheme}&raw_error_text=${text}&golden_id=${GOLDEN[rc]}`, setLang: null };
    }
    default:
      return { href: null, setLang: null };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = (body?.message ?? "").toString().slice(0, 800);
    const lang: "en" | "hi" = body?.lang === "hi" ? "hi" : "en";
    if (!message.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    let out: AssistantOut = heuristic(message, lang);
    let source: "ai_assisted" | "fixture_rules" = "fixture_rules";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { generateObject } = await import("ai");
        const { openai } = await import("@ai-sdk/openai");
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const { object } = await generateObject({
          model: openai(model),
          schema: AssistantOut,
          system: SYSTEM,
          prompt: `The member is currently using the app in ${lang === "hi" ? "Hindi" : "English"}.\nMember said:\n"""\n${message}\n"""`,
        });
        const parsed = AssistantOut.safeParse(object);
        if (parsed.success) {
          out = parsed.data;
          source = "ai_assisted";
        }
      } catch {
        /* keep heuristic */
      }
    }

    const nav = route(out);
    return NextResponse.json({ reply: out.reply, nav, source });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "assistant failed", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
