import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { Breadcrumbs, Button, Callout, Card, ChoiceCard, Field, PageTitle, Steps, Tag, inputClass } from "../components/ui";
import RequireLogin from "../components/RequireLogin";
import { member, rupees, totalBalance, type Claim } from "../lib/data";

type ReasonKey =
  | "medical"
  | "marriage"
  | "education"
  | "house"
  | "loan"
  | "unemployed"
  | "retire"
  | "calamity";

type Reason = {
  key: ReasonKey;
  emoji: string;
  en: string;
  hi: string;
  ruleEn: string;
  ruleHi: string;
  minYears: number;
  form: string;
  cap: (salary: number, employee: number, total: number) => number;
  docsEn: string[];
  docsHi: string[];
};

const REASONS: Reason[] = [
  {
    key: "medical",
    emoji: "🏥",
    en: "Illness or hospital bills",
    hi: "बीमारी या अस्पताल का खर्च",
    ruleEn: "For you, your husband/wife, children or parents. No minimum years of service needed.",
    ruleHi: "आपके, पति/पत्नी, बच्चों या माता-पिता के लिए। कोई न्यूनतम सेवा अवधि ज़रूरी नहीं।",
    minYears: 0,
    form: "Form 31 (Advance)",
    cap: (s, e) => Math.min(e, s * 6),
    docsEn: ["Nothing to upload — hospital bills can be shown later if asked"],
    docsHi: ["कुछ अपलोड नहीं करना — ज़रूरत पड़ने पर बाद में बिल दिखा सकते हैं"],
  },
  {
    key: "marriage",
    emoji: "💍",
    en: "Marriage (yours, your child's, brother's or sister's)",
    hi: "शादी (आपकी, बच्चे, भाई या बहन की)",
    ruleEn: "You need 7 years of PF service. You can take up to half of your own contribution.",
    ruleHi: "7 साल की पीएफ सेवा चाहिए। आप अपने योगदान का आधा तक ले सकते हैं।",
    minYears: 7,
    form: "Form 31 (Advance)",
    cap: (_s, e) => e * 0.5,
    docsEn: ["Wedding card or a simple declaration"],
    docsHi: ["शादी का कार्ड या एक सरल घोषणा"],
  },
  {
    key: "education",
    emoji: "🎓",
    en: "Education (yours or your children's)",
    hi: "पढ़ाई (आपकी या बच्चों की)",
    ruleEn: "After 7 years of service, for education after Class 10. Up to half of your own contribution.",
    ruleHi: "7 साल की सेवा के बाद, 10वीं के बाद की पढ़ाई के लिए। अपने योगदान का आधा तक।",
    minYears: 7,
    form: "Form 31 (Advance)",
    cap: (_s, e) => e * 0.5,
    docsEn: ["Fee receipt or admission letter (upload optional)"],
    docsHi: ["फीस रसीद या एडमिशन लेटर (अपलोड वैकल्पिक)"],
  },
  {
    key: "house",
    emoji: "🏠",
    en: "Buying land, buying or building a house",
    hi: "ज़मीन खरीदना, घर खरीदना या बनाना",
    ruleEn: "After 5 years of service. Up to 90% of your total PF, once in a lifetime.",
    ruleHi: "5 साल की सेवा के बाद। कुल पीएफ का 90% तक, जीवन में एक बार।",
    minYears: 5,
    form: "Form 31 (Advance)",
    cap: (_s, _e, total) => total * 0.9,
    docsEn: ["Property papers or builder agreement"],
    docsHi: ["संपत्ति के कागज़ या बिल्डर एग्रीमेंट"],
  },
  {
    key: "loan",
    emoji: "🏦",
    en: "Repaying my home loan",
    hi: "होम लोन चुकाना",
    ruleEn: "After 10 years of service. Up to 90% of your total PF.",
    ruleHi: "10 साल की सेवा के बाद। कुल पीएफ का 90% तक।",
    minYears: 10,
    form: "Form 31 (Advance)",
    cap: (_s, _e, total) => total * 0.9,
    docsEn: ["Loan account statement from your bank"],
    docsHi: ["बैंक से लोन खाते का विवरण"],
  },
  {
    key: "unemployed",
    emoji: "🧳",
    en: "I left my job and I am not working now",
    hi: "मैंने नौकरी छोड़ दी है और अभी काम नहीं कर रहा",
    ruleEn: "After 1 month without a job you can take 75%. After 2 months you can take everything and close the account.",
    ruleHi: "1 महीने बेरोज़गार रहने पर 75% ले सकते हैं। 2 महीने बाद पूरा पैसा निकालकर खाता बंद कर सकते हैं।",
    minYears: 0,
    form: "Form 19 + 10C (Final settlement)",
    cap: (_s, _e, total) => total,
    docsEn: ["Nothing — your employer's exit date is already with us"],
    docsHi: ["कुछ नहीं — आपकी नौकरी छोड़ने की तारीख हमारे पास है"],
  },
  {
    key: "retire",
    emoji: "🎉",
    en: "I have retired (58 years or more)",
    hi: "मैं रिटायर हो गया हूँ (58 साल या अधिक)",
    ruleEn: "You get the full PF amount, and your monthly pension starts.",
    ruleHi: "आपको पूरा पीएफ मिलता है और मासिक पेंशन शुरू होती है।",
    minYears: 0,
    form: "Form 19 + 10D (Pension)",
    cap: (_s, _e, total) => total,
    docsEn: ["Nothing to upload"],
    docsHi: ["कुछ अपलोड नहीं करना"],
  },
  {
    key: "calamity",
    emoji: "🌊",
    en: "Flood, earthquake or other disaster",
    hi: "बाढ़, भूकंप या कोई आपदा",
    ruleEn: "Up to ₹50,000 or half of your own contribution, whichever is less.",
    ruleHi: "₹50,000 या अपने योगदान का आधा, जो कम हो।",
    minYears: 0,
    form: "Form 31 (Advance)",
    cap: (_s, e) => Math.min(50000, e * 0.5),
    docsEn: ["State government disaster declaration (we check this for you)"],
    docsHi: ["राज्य सरकार की आपदा घोषणा (हम खुद जाँच लेते हैं)"],
  },
];

function futureValue(amount: number, years: number, rate = 0.0825) {
  return amount * Math.pow(1 + rate, years);
}

export default function Withdraw() {
  const { t, navigate, addClaim, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [reasonKey, setReasonKey] = useState<ReasonKey | null>(null);
  const [amount, setAmount] = useState(0);
  const [otp, setOtp] = useState("");
  const [claimId, setClaimId] = useState("");
  const [error, setError] = useState("");

  const reason = REASONS.find((r) => r.key === reasonKey) || null;
  const maxAmount = useMemo(() => {
    if (!reason) return 0;
    return Math.floor(reason.cap(member.monthlySalary, member.balance.employee, totalBalance) / 1000) * 1000;
  }, [reason]);
  const eligible = reason ? member.serviceYears >= reason.minYears : false;
  const yearsToRetire = Math.max(1, 58 - member.age);

  const labels = [
    t("Reason", "कारण"),
    t("How much", "कितना"),
    t("Check", "जाँच"),
    t("Confirm", "पुष्टि"),
    t("Done", "हो गया"),
  ];

  const submit = () => {
    if (otp !== "1234") {
      setError(t("Wrong OTP. For this demo, type 1234.", "गलत ओटीपी। इस डेमो के लिए 1234 लिखें।"));
      return;
    }
    const id = "GJSRT" + Math.floor(100000 + Math.random() * 899999);
    const claim: Claim = {
      id,
      type: reason!.form,
      reason: t(reason!.en, reason!.hi),
      amount,
      filedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      status: "received",
      bank: member.bank,
      expected: new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      history: [
        { label: t("Claim received", "क्लेम मिला"), date: t("Just now", "अभी"), done: true },
        { label: t("Checked by EPFO officer", "ईपीएफओ अधिकारी जाँच करेंगे"), date: t("Within 1 day", "1 दिन में"), done: false },
        { label: t("Approved", "मंज़ूरी"), date: t("Within 2 days", "2 दिन में"), done: false },
        { label: t("Money sent to your bank", "बैंक में पैसा"), date: t("Within 3 days", "3 दिन में"), done: false },
      ],
    };
    addClaim(claim);
    setClaimId(id);
    setError("");
    setStep(4);
    showToast(t("Claim submitted successfully", "क्लेम सफलतापूर्वक जमा हुआ"));
  };

  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("Withdraw money", "पैसा निकालें") },
        ]}
      />
      <Steps current={step} labels={labels} />

      {step === 0 && (
        <div>
          <PageTitle
            title={t("Why do you need the money?", "आपको पैसा किस लिए चाहिए?")}
            intro={t(
              "Pick one. We will tell you straight away whether you can take money, how much, and when it will reach your bank.",
              "एक चुनें। हम तुरंत बताएँगे कि आप पैसा ले सकते हैं या नहीं, कितना, और बैंक में कब आएगा।",
            )}
          />
          <div className="grid gap-3 md:grid-cols-2">
            {REASONS.map((r) => (
              <ChoiceCard
                key={r.key}
                emoji={r.emoji}
                title={t(r.en, r.hi)}
                desc={t(r.ruleEn, r.ruleHi)}
                selected={reasonKey === r.key}
                onSelect={() => {
                  setReasonKey(r.key);
                  const cap = Math.floor(r.cap(member.monthlySalary, member.balance.employee, totalBalance) / 1000) * 1000;
                  setAmount(Math.min(cap, Math.round(cap / 2 / 1000) * 1000) || cap);
                }}
              />
            ))}
          </div>
          <div className="mt-6">
            <Button disabled={!reasonKey} onClick={() => setStep(1)}>
              {t("Continue", "आगे बढ़ें")}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && reason && (
        <div className="max-w-3xl">
          <PageTitle
            caption={t(reason.en, reason.hi)}
            title={
              eligible
                ? t("Good news — you can take this money", "अच्छी खबर — आप यह पैसा ले सकते हैं")
                : t("You are not eligible yet", "अभी आप पात्र नहीं हैं")
            }
          />
          {eligible ? (
            <>
              <Callout tone="success" title={t("You can take up to", "आप ले सकते हैं")}>
                <p className="text-4xl font-extrabold text-[#005a30]">{rupees(maxAmount)}</p>
                <p className="mt-2">{t(reason.ruleEn, reason.ruleHi)}</p>
              </Callout>

              <div className="mt-6">
                <Field
                  label={t("How much do you want?", "आपको कितना चाहिए?")}
                  hint={t("Drag the bar or tap an amount below.", "बार खिसकाएँ या नीचे कोई राशि चुनें।")}
                >
                  <input
                    type="range"
                    min={1000}
                    max={maxAmount}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-3 w-full accent-[#12436d]"
                  />
                </Field>
                <p className="mt-3 text-4xl font-extrabold">{rupees(amount)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[0.25, 0.5, 0.75, 1].map((f) => (
                    <button
                      key={f}
                      onClick={() => setAmount(Math.round((maxAmount * f) / 1000) * 1000)}
                      className="rounded-full bg-[#eeefef] px-4 py-2 text-lg font-bold text-[#12436d] hover:bg-[#dde5eb]"
                    >
                      {f === 1 ? t("Everything", "पूरा") : `${f * 100}%`} · {rupees(maxAmount * f)}
                    </button>
                  ))}
                </div>
              </div>

              <Callout tone="warning" title={t("Think about this before you decide", "फैसले से पहले यह सोचें")}>
                <p>
                  {t(
                    `If you leave this ${rupees(amount)} in your PF, it becomes about`,
                    `अगर यह ${rupees(amount)} पीएफ में रहने दें, तो यह लगभग`,
                  )}{" "}
                  <b>{rupees(futureValue(amount, yearsToRetire))}</b>{" "}
                  {t(
                    `by the time you are 58 (at ${member.interestRate}% a year). Take only what you truly need.`,
                    `58 साल की उम्र तक हो जाएगा (${member.interestRate}% सालाना)। उतना ही लें जितना ज़रूरी है।`,
                  )}
                </p>
              </Callout>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(0)}>
                  ← {t("Back", "पीछे")}
                </Button>
                <Button onClick={() => setStep(2)}>{t("Continue", "आगे बढ़ें")}</Button>
              </div>
            </>
          ) : (
            <>
              <Callout tone="danger" title={t("Here is why", "कारण यह है")}>
                <p>
                  {t(
                    `This needs ${reason.minYears} years of PF service. You have ${member.serviceYears} years.`,
                    `इसके लिए ${reason.minYears} साल की पीएफ सेवा चाहिए। आपके पास ${member.serviceYears} साल हैं।`,
                  )}
                </p>
              </Callout>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(0)}>
                  ← {t("Choose another reason", "दूसरा कारण चुनें")}
                </Button>
                <Button variant="plain" onClick={() => navigate("/help")}>
                  {t("Ask a question", "सवाल पूछें")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 2 && reason && (
        <div className="max-w-3xl">
          <PageTitle
            title={t("Check these 3 things", "ये 3 बातें जाँच लें")}
            intro={t("If anything is wrong, fix it now — this is what causes most rejections.", "कुछ गलत हो तो अभी ठीक करें — ज़्यादातर क्लेम इसी वजह से रुकते हैं।")}
          />
          <ul className="space-y-3">
            {[
              { h: t("Money goes to this bank account", "पैसा इस बैंक खाते में जाएगा"), v: member.bank, ok: true },
              { h: t("Aadhaar linked and verified", "आधार जुड़ा और सत्यापित"), v: member.aadhaar, ok: true },
              { h: t("OTP will come to this mobile", "ओटीपी इस मोबाइल पर आएगा"), v: member.mobile, ok: true },
            ].map((c) => (
              <li key={c.h}>
                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{c.h}</p>
                      <p className="text-lg">{c.v}</p>
                    </div>
                    <Tag tone="green">✓ {t("Correct", "सही")}</Tag>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <Callout tone="info" title={t("Papers needed", "ज़रूरी कागज़")}>
            <ul className="list-disc pl-6">
              {(reason.docsEn as string[]).map((d, i) => (
                <li key={i}>{t(d, reason.docsHi[i])}</li>
              ))}
            </ul>
          </Callout>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ← {t("Back", "पीछे")}
            </Button>
            <Button onClick={() => setStep(3)}>{t("Everything is correct", "सब सही है")}</Button>
          </div>
        </div>
      )}

      {step === 3 && reason && (
        <div className="max-w-3xl">
          <PageTitle title={t("Confirm and sign with OTP", "ओटीपी से पुष्टि करें")} />
          <Card className="bg-[#f3f2f1]">
            <dl className="space-y-3 text-lg">
              {[
                [t("Reason", "कारण"), t(reason.en, reason.hi)],
                [t("Form used", "फॉर्म"), reason.form],
                [t("Amount", "राशि"), rupees(amount)],
                [t("Bank account", "बैंक खाता"), member.bank],
                [t("Money expected in", "पैसा मिलने में"), t("about 3 working days", "लगभग 3 कार्यदिवस")],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-[#b1b4b6] pb-2">
                  <dt className="text-[#505a5f]">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          {error && (
            <div className="mt-4">
              <Callout tone="danger">{error}</Callout>
            </div>
          )}
          <div className="mt-5 max-w-sm">
            <Field
              label={t("Enter the OTP sent to your mobile", "मोबाइल पर आया ओटीपी डालें")}
              hint={t("Demo OTP: 1234", "डेमो ओटीपी: 1234")}
            >
              <input className={inputClass} inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </Field>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>
              ← {t("Back", "पीछे")}
            </Button>
            <Button onClick={submit}>{t("Submit my claim", "मेरा क्लेम जमा करें")}</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-3xl">
          <div className="rounded-lg border-4 border-[#00703c] bg-[#00703c] p-8 text-white">
            <h1 className="text-3xl font-extrabold">{t("Claim submitted", "क्लेम जमा हो गया")}</h1>
            <p className="mt-2 text-xl">
              {t("Your reference number is", "आपका संदर्भ नंबर है")} <b>{claimId}</b>
            </p>
            <p className="mt-1 text-xl">
              {rupees(amount)} {t("should reach", "पहुँचेगा")} {member.bank}{" "}
              {t("in about 3 working days.", "लगभग 3 कार्यदिवस में।")}
            </p>
          </div>
          <Callout tone="info" title={t("What happens next", "आगे क्या होगा")}>
            <ol className="list-decimal space-y-1 pl-6">
              <li>{t("We check your details automatically — usually within a day.", "हम आपकी जानकारी अपने आप जाँचते हैं — आमतौर पर एक दिन में।")}</li>
              <li>{t("You get an SMS at each step. No need to call anyone.", "हर चरण पर एसएमएस मिलेगा। किसी को फोन करने की ज़रूरत नहीं।")}</li>
              <li>{t("If something is missing we will tell you exactly what to fix.", "कुछ कमी होगी तो हम ठीक-ठीक बताएँगे कि क्या ठीक करना है।")}</li>
            </ol>
          </Callout>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate(`/track/${claimId}`)}>{t("Track this claim", "इस क्लेम को ट्रैक करें")}</Button>
            <Button variant="secondary" onClick={() => window.print()}>
              🖨 {t("Print receipt", "रसीद प्रिंट करें")}
            </Button>
            <Button variant="plain" onClick={() => navigate("/dashboard")}>
              {t("Back to my account", "मेरे खाते पर वापस")}
            </Button>
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
