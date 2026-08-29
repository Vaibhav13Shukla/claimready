import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { Breadcrumbs, Button, Callout, Card, PageTitle, Tag } from "../components/ui";
import { member } from "../lib/data";

/* ------------------------------------------------------------------ *
 * Flagship: catch the reasons EPFO claims actually get rejected,
 * before the member files, and decode a past rejection in plain words.
 * ------------------------------------------------------------------ */

type Issue = {
  id: string;
  en: string;
  hi: string;
  detailEn: string;
  detailHi: string;
  fixEn: string;
  fixHi: string;
  fixedEn: string;
  fixedHi: string;
};

// The two mistakes behind most rejections: a name that does not match, and a
// bank/IFSC that has not been re-verified. Both are fixable in one tap here.
const ISSUES: Issue[] = [
  {
    id: "name",
    en: "Name must match your Aadhaar and bank",
    hi: "नाम आधार और बैंक से मेल खाना चाहिए",
    detailEn: `Your PF name is “${member.name}” but your bank shows “${member.name} S”. Even a one-letter difference is the single biggest reason claims get rejected.`,
    detailHi: `पीएफ में आपका नाम “${member.name}” है पर बैंक में “${member.name} S” है। एक अक्षर का फ़र्क भी क्लेम रिजेक्ट होने की सबसे बड़ी वजह है।`,
    fixEn: "Fix the name to match",
    fixHi: "नाम ठीक करें",
    fixedEn: "Name now matches your Aadhaar and bank.",
    fixedHi: "नाम अब आधार और बैंक से मेल खाता है।",
  },
  {
    id: "bank",
    en: "Bank account needs re-verification",
    hi: "बैंक खाता फिर से सत्यापित करना है",
    detailEn: "Your IFSC changed after a branch merger. A claim to an unverified account bounces back and delays your money by weeks.",
    detailHi: "ब्रांच मर्जर के बाद आपका IFSC बदल गया। बिना सत्यापित खाते में क्लेम वापस आ जाता है और पैसा हफ़्तों टल जाता है।",
    fixEn: "Re-verify my bank account",
    fixHi: "बैंक खाता फिर सत्यापित करें",
    fixedEn: "Bank account and IFSC re-verified.",
    fixedHi: "बैंक खाता और IFSC फिर सत्यापित हो गए।",
  },
];

// Checks that already pass, shown as reassurance (green ticks).
const PASSING = [
  { en: "Aadhaar linked and verified", hi: "आधार जुड़ा और सत्यापित" },
  { en: "PAN linked and verified", hi: "पैन जुड़ा और सत्यापित" },
  { en: "Mobile number linked to Aadhaar", hi: "मोबाइल नंबर आधार से जुड़ा" },
  { en: "UAN activated", hi: "यूएएन सक्रिय" },
  { en: "Nominee added", hi: "नॉमिनी जोड़ा गया" },
];

type Rejection = {
  code: string; // the cryptic official remark a member actually sees
  meaningEn: string;
  meaningHi: string;
  fixEn: string;
  fixHi: string;
  to: string;
  ctaEn: string;
  ctaHi: string;
};

const REJECTIONS: Rejection[] = [
  {
    code: "Name against UAN & Claim ID differ / Name not as per Aadhaar",
    meaningEn: "The name on your claim does not exactly match the name on your Aadhaar.",
    meaningHi: "आपके क्लेम पर नाम आधार के नाम से बिल्कुल मेल नहीं खाता।",
    fixEn: "Correct your name in KYC so it matches Aadhaar letter for letter, then file again.",
    fixHi: "केवाईसी में अपना नाम आधार जैसा अक्षर-दर-अक्षर ठीक करें, फिर दोबारा फाइल करें।",
    to: "/kyc",
    ctaEn: "Fix my name",
    ctaHi: "नाम ठीक करें",
  },
  {
    code: "Date of Exit not available / not marked by employer",
    meaningEn: "Your last employer has not entered the date you left the job. Without it, a final settlement cannot be paid.",
    meaningHi: "आपके पिछले नियोक्ता ने नौकरी छोड़ने की तारीख दर्ज नहीं की। इसके बिना अंतिम भुगतान नहीं हो सकता।",
    fixEn: "Ask your employer to mark your exit date, or raise a complaint and EPFO will update it.",
    fixHi: "नियोक्ता से निकास तारीख दर्ज करने को कहें, या शिकायत करें और ईपीएफओ इसे अपडेट करेगा।",
    to: "/grievance",
    ctaEn: "Raise a complaint",
    ctaHi: "शिकायत दर्ज करें",
  },
  {
    code: "Bank KYC not approved / IFSC invalid",
    meaningEn: "Your bank account is not verified, often because the IFSC changed after a branch merger.",
    meaningHi: "आपका बैंक खाता सत्यापित नहीं है, अक्सर ब्रांच मर्जर के बाद IFSC बदलने से।",
    fixEn: "Re-verify your bank account and IFSC in KYC, then file again.",
    fixHi: "केवाईसी में अपना बैंक खाता और IFSC फिर सत्यापित करें, फिर दोबारा फाइल करें।",
    to: "/kyc",
    ctaEn: "Update bank details",
    ctaHi: "बैंक विवरण अपडेट करें",
  },
  {
    code: "PAN not seeded / not verified",
    meaningEn: "Your PAN is not linked. This is needed for withdrawals above ₹50,000 with under 5 years of service, or tax is deducted.",
    meaningHi: "आपका पैन नहीं जुड़ा है। 5 साल से कम सेवा में ₹50,000 से ऊपर निकासी के लिए यह ज़रूरी है, वरना टैक्स कटता है।",
    fixEn: "Link and verify your PAN in KYC.",
    fixHi: "केवाईसी में अपना पैन जोड़ें और सत्यापित करें।",
    to: "/kyc",
    ctaEn: "Link my PAN",
    ctaHi: "पैन जोड़ें",
  },
  {
    code: "Insufficient service for this advance",
    meaningEn: "You have not completed the minimum years of PF service that this reason needs.",
    meaningHi: "इस कारण के लिए ज़रूरी न्यूनतम पीएफ सेवा वर्ष आपने पूरे नहीं किए।",
    fixEn: "Check which reasons you are eligible for right now before you file.",
    fixHi: "फाइल करने से पहले देखें कि अभी आप किन कारणों के लिए पात्र हैं।",
    to: "/withdraw",
    ctaEn: "See what I can withdraw",
    ctaHi: "देखें कितना निकाल सकता हूँ",
  },
  {
    code: "Claim already settled / duplicate claim",
    meaningEn: "A claim of this type is already in progress or was paid, so this one was stopped.",
    meaningHi: "इस तरह का क्लेम पहले से चल रहा है या भुगतान हो चुका है, इसलिए यह रोक दिया गया।",
    fixEn: "Track your existing claim instead of filing a new one.",
    fixHi: "नया क्लेम फाइल करने के बजाय अपना मौजूदा क्लेम ट्रैक करें।",
    to: "/track",
    ctaEn: "Track my claim",
    ctaHi: "मेरा क्लेम ट्रैक करें",
  },
];

export default function ClaimCheck() {
  const { t, navigate } = useApp();
  const [fixed, setFixed] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<string>("");

  const remaining = useMemo(() => ISSUES.filter((i) => !fixed[i.id]), [fixed]);
  const ready = remaining.length === 0;
  const rejection = REJECTIONS.find((r) => r.code === picked);

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Claim check", "क्लेम जाँच") }]} />
      <PageTitle
        caption={t("Before you file", "फाइल करने से पहले")}
        title={t("Will my claim be approved?", "क्या मेरा क्लेम मंज़ूर होगा?")}
        intro={t(
          "Almost 1 in 3 PF claims are rejected for small, fixable mistakes. We check yours in advance and fix them in one tap, so your money is not stuck for weeks.",
          "लगभग हर 3 में से 1 पीएफ क्लेम छोटी, ठीक होने वाली गलतियों से रिजेक्ट होता है। हम पहले ही जाँच लेते हैं और एक टैप में ठीक कर देते हैं, ताकि आपका पैसा हफ़्तों न अटके।",
        )}
      />

      {/* Verdict banner */}
      {ready ? (
        <div className="rounded-lg border-4 border-[#00703c] bg-[#00703c] p-6 text-white">
          <p className="text-2xl font-extrabold">{t("Ready to file", "फाइल करने के लिए तैयार")}</p>
          <p className="mt-1 text-lg">
            {t(
              "Every check passed. Claims like yours are usually approved within 3 days.",
              "हर जाँच पास हुई। आपके जैसे क्लेम आमतौर पर 3 दिन में मंज़ूर हो जाते हैं।",
            )}
          </p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate("/withdraw")}>
              {t("Start my claim", "मेरा क्लेम शुरू करें")}
            </Button>
          </div>
        </div>
      ) : (
        <Callout
          tone="danger"
          title={t(
            `${remaining.length} thing${remaining.length > 1 ? "s" : ""} would get your claim rejected`,
            `${remaining.length} बात${remaining.length > 1 ? "ें" : ""} आपके क्लेम को रिजेक्ट करा देंगी`,
          )}
        >
          {t("Fix these now so your claim is not stopped later.", "इन्हें अभी ठीक करें ताकि बाद में आपका क्लेम न रुके।")}
        </Callout>
      )}

      {/* Fixable issues */}
      <div className="mt-6 space-y-3">
        {ISSUES.map((i) => {
          const isFixed = !!fixed[i.id];
          return (
            <Card key={i.id} className={isFixed ? "border-[#00703c] bg-[#eaf5ef]" : "border-[#d4351c]"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag tone={isFixed ? "green" : "red"}>{isFixed ? t("Fixed", "ठीक") : t("Will reject", "रिजेक्ट करेगा")}</Tag>
                    <p className="text-lg font-bold">{t(i.en, i.hi)}</p>
                  </div>
                  <p className="mt-2 text-lg">{isFixed ? t(i.fixedEn, i.fixedHi) : t(i.detailEn, i.detailHi)}</p>
                </div>
              </div>
              {!isFixed && (
                <div className="mt-3">
                  <Button onClick={() => setFixed((f) => ({ ...f, [i.id]: true }))}>{t(i.fixEn, i.fixHi)}</Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Passing checks */}
      <h2 className="mt-8 mb-3 text-xl font-extrabold">{t("Already in good shape", "यह पहले से ठीक है")}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {PASSING.map((p) => (
          <li key={p.en} className="flex items-center gap-2 text-lg">
            <span className="font-bold text-[#00703c]">{"✓"}</span>
            {t(p.en, p.hi)}
          </li>
        ))}
      </ul>

      {/* Rejection decoder */}
      <section className="mt-12 rounded-lg bg-[#f3f2f1] p-6">
        <h2 className="text-2xl font-extrabold">{t("Already rejected? Understand why", "पहले ही रिजेक्ट हुआ? कारण समझें")}</h2>
        <p className="mt-2 text-lg">
          {t(
            "EPFO rejection messages are written in code. Pick the message you got and we will explain it in plain words, and tell you exactly how to fix it.",
            "ईपीएफओ के रिजेक्शन संदेश कठिन भाषा में होते हैं। जो संदेश आपको मिला उसे चुनें, हम उसे सरल शब्दों में समझाएँगे और ठीक करने का तरीका बताएँगे।",
          )}
        </p>
        <label className="mt-4 block">
          <span className="block text-lg font-bold">{t("The message you received", "आपको मिला संदेश")}</span>
          <select
            value={picked}
            onChange={(e) => setPicked(e.target.value)}
            className="mt-2 w-full rounded-[3px] border-2 border-[#0b0c0c] bg-white px-3 py-3 text-lg"
          >
            <option value="">{t("Choose your rejection reason", "अपना रिजेक्शन कारण चुनें")}</option>
            {REJECTIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code}
              </option>
            ))}
          </select>
        </label>

        {rejection && (
          <div className="mt-5 space-y-4">
            <Callout tone="info" title={t("What it means", "इसका मतलब")}>
              {t(rejection.meaningEn, rejection.meaningHi)}
            </Callout>
            <Callout tone="success" title={t("How to fix it", "इसे कैसे ठीक करें")}>
              <p>{t(rejection.fixEn, rejection.fixHi)}</p>
              <div className="mt-3">
                <Button onClick={() => navigate(rejection.to)}>{t(rejection.ctaEn, rejection.ctaHi)}</Button>
              </div>
            </Callout>
          </div>
        )}
      </section>
    </div>
  );
}
