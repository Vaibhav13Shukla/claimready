import { useState } from "react";
import { useApp } from "../lib/store";
import {
  A,
  Breadcrumbs,
  Button,
  Callout,
  Card,
  ChoiceCard,
  Field,
  PageTitle,
  Steps,
  Tag,
  inputClass,
} from "../components/ui";
import RequireLogin from "../components/RequireLogin";
import { DEMO, employments, member, rupees, type Grievance } from "../lib/data";

/* ---------------------------------- Transfer --------------------------------- */

export function Transfer() {
  const { t, navigate, showToast } = useApp();
  const pending = employments.filter((e) => !e.transferred);
  const [picked, setPicked] = useState<string | null>(pending[0]?.id ?? null);
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const acc = employments.find((e) => e.id === picked);

  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("Move my PF", "पीएफ ट्रांसफर") },
        ]}
      />
      <Steps current={step} labels={[t("Choose account", "खाता चुनें"), t("Confirm", "पुष्टि"), t("Done", "हो गया")]} />

      {step === 0 && (
        <div className="max-w-3xl">
          <PageTitle
            title={t("Bring your old PF into your current job", "पुराना पीएफ मौजूदा नौकरी में लाएँ")}
            intro={t(
              "Old money keeps earning interest, but it is easier to manage in one account — and your total service years count for pension.",
              "पुराने पैसे पर ब्याज तो मिलता है, पर एक ही खाते में रखना आसान है — और आपकी कुल सेवा पेंशन में गिनी जाती है।",
            )}
          />
          {pending.length === 0 ? (
            <Callout tone="success">{t("All your old accounts are already merged. Nothing to do.", "आपके सभी पुराने खाते पहले ही मर्ज हैं। कुछ नहीं करना।")}</Callout>
          ) : (
            <div className="space-y-3">
              {pending.map((e) => (
                <ChoiceCard
                  key={e.id}
                  emoji="🏢"
                  selected={picked === e.id}
                  onSelect={() => setPicked(e.id)}
                  title={`${e.employer} — ${rupees(e.balance)}`}
                  desc={`${e.city} · ${e.from} – ${e.to} · ${t("Member ID", "मेंबर आईडी")} ${e.memberId}`}
                />
              ))}
            </div>
          )}
          <div className="mt-6">
            <Button disabled={!picked} onClick={() => setStep(1)}>
              {t("Continue", "आगे बढ़ें")}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && acc && (
        <div className="max-w-3xl">
          <PageTitle title={t("Check and confirm", "जाँचें और पुष्टि करें")} />
          <Card className="bg-[#f3f2f1]">
            <p className="text-lg">
              {t("Moving", "ट्रांसफर")} <b>{rupees(acc.balance)}</b> {t("from", "से")} <b>{acc.employer}</b>{" "}
              {t("to", "में")} <b>{member.employer}</b>.
            </p>
            <p className="mt-2 text-lg text-[#505a5f]">
              {t(
                "Your old employer no longer needs to sign anything. EPFO does it online.",
                "अब पुराने नियोक्ता के हस्ताक्षर की ज़रूरत नहीं। ईपीएफओ यह ऑनलाइन कर देता है।",
              )}
            </p>
          </Card>
          {err && (
            <div className="mt-4">
              <Callout tone="danger">{err}</Callout>
            </div>
          )}
          <div className="mt-5 max-w-sm">
            <Field label={t("OTP sent to your mobile", "मोबाइल पर भेजा गया ओटीपी")} hint={t("Demo OTP: 1234", "डेमो ओटीपी: 1234")}>
              <input className={inputClass} inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </Field>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(0)}>
              ← {t("Back", "पीछे")}
            </Button>
            <Button
              onClick={() => {
                if (otp !== DEMO.otp) return setErr(t("Wrong OTP. Type 1234.", "गलत ओटीपी। 1234 लिखें।"));
                setErr("");
                setStep(2);
                showToast(t("Transfer request submitted", "ट्रांसफर अनुरोध जमा हुआ"));
              }}
            >
              {t("Submit transfer request", "ट्रांसफर अनुरोध भेजें")}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && acc && (
        <div className="max-w-3xl">
          <div className="rounded-lg border-4 border-[#00703c] bg-[#00703c] p-8 text-white">
            <h1 className="text-3xl font-extrabold">{t("Transfer started", "ट्रांसफर शुरू")}</h1>
            <p className="mt-2 text-xl">
              {rupees(acc.balance)} {t("will appear in your current account within 7 days.", "7 दिन में आपके मौजूदा खाते में दिख जाएगा।")}
            </p>
          </div>
          <Callout tone="info">
            {t(
              "You will get an SMS when it is done. Your passbook will then show one single balance.",
              "पूरा होने पर एसएमएस मिलेगा। इसके बाद पासबुक में एक ही बैलेंस दिखेगा।",
            )}
          </Callout>
          <div className="mt-6">
            <Button onClick={() => navigate("/dashboard")}>{t("Back to my account", "मेरे खाते पर वापस")}</Button>
          </div>
        </div>
      )}
    </RequireLogin>
  );
}

/* ------------------------------------ KYC ------------------------------------ */

export function Kyc() {
  const { t, showToast } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const rows = [
    { k: "name", l: t("Name", "नाम"), v: member.name, hint: t("Must match your Aadhaar exactly", "आधार से बिल्कुल मेल खाना चाहिए") },
    { k: "dob", l: t("Date of birth", "जन्म तिथि"), v: member.dob, hint: t("Used to decide your pension date", "पेंशन तिथि तय करने के लिए") },
    { k: "mobile", l: t("Mobile number", "मोबाइल नंबर"), v: member.mobile, hint: t("All OTPs and updates come here", "सभी ओटीपी और सूचनाएँ यहीं आती हैं") },
    { k: "bank", l: t("Bank account", "बैंक खाता"), v: member.bank, hint: t("Your money is paid into this account", "पैसा इसी खाते में आता है") },
    { k: "aadhaar", l: "Aadhaar", v: member.aadhaar, hint: t("Verified with UIDAI", "यूआईडीएआई से सत्यापित") },
    { k: "pan", l: "PAN", v: member.pan, hint: t("Saves tax if you withdraw early", "जल्दी निकालने पर टैक्स बचाता है") },
  ];

  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("My details", "मेरी जानकारी") },
        ]}
      />
      <PageTitle
        title={t("My details", "मेरी जानकारी")}
        intro={t(
          "Correct details mean your money is paid automatically, without an officer having to check anything.",
          "सही जानकारी होने पर पैसा अपने आप मिल जाता है, किसी अधिकारी की जाँच की ज़रूरत नहीं।",
        )}
      />
      <div className="max-w-3xl divide-y-2 divide-[#b1b4b6] border-y-2 border-[#b1b4b6]">
        {rows.map((r) => (
          <div key={r.k} className="py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{r.l}</p>
                <p className="text-xl">{r.v}</p>
                <p className="text-base text-[#505a5f]">{r.hint}</p>
              </div>
              <div className="flex items-center gap-3">
                <Tag tone="green">✓ {t("Verified", "सत्यापित")}</Tag>
                <A
                  onClick={() => {
                    setEditing(editing === r.k ? null : r.k);
                    setValue("");
                  }}
                >
                  {editing === r.k ? t("Cancel", "रद्द करें") : t("Change", "बदलें")}
                </A>
              </div>
            </div>
            {editing === r.k && (
              <div className="mt-4 rounded-md border-2 border-[#12436d] bg-[#f4f8fb] p-4">
                <Field label={`${t("New", "नया")} ${r.l}`} hint={t("We will verify it within 3 working days.", "हम 3 कार्यदिवस में सत्यापित करेंगे।")}>
                  <input className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
                </Field>
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => {
                      setEditing(null);
                      showToast(t("Change requested. We will verify it in 3 days.", "बदलाव का अनुरोध भेजा गया। 3 दिन में सत्यापित होगा।"));
                    }}
                    disabled={value.trim().length < 2}
                  >
                    {t("Save change", "बदलाव सेव करें")}
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(null)}>
                    {t("Cancel", "रद्द करें")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Callout tone="info" title={t("No employer signature needed", "नियोक्ता के हस्ताक्षर की ज़रूरत नहीं")}>
        {t(
          "Aadhaar-based changes are approved online. Only a name or date of birth change needs your employer to agree.",
          "आधार आधारित बदलाव ऑनलाइन मंज़ूर होते हैं। सिर्फ़ नाम या जन्मतिथि बदलने पर नियोक्ता की सहमति चाहिए।",
        )}
      </Callout>
    </RequireLogin>
  );
}

/* ---------------------------------- Nominee ---------------------------------- */

type Nom = { id: number; name: string; relation: string; share: number };

export function Nominee() {
  const { t, showToast } = useApp();
  const [noms, setNoms] = useState<Nom[]>([
    { id: 1, name: member.nominee.name, relation: member.nominee.relation, share: 100 },
  ]);
  const [saved, setSaved] = useState(false);
  const total = noms.reduce((s, n) => s + Number(n.share || 0), 0);

  const update = (id: number, patch: Partial<Nom>) =>
    setNoms((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));

  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("Nominee", "नॉमिनी") },
        ]}
      />
      <PageTitle
        title={t("Who should get your money if something happens to you?", "आपके साथ कुछ हो जाए तो पैसा किसे मिले?")}
        intro={t(
          "This takes 3 minutes and saves your family months of running around. You can change it any time.",
          "इसमें 3 मिनट लगते हैं और आपके परिवार के महीनों बच जाते हैं। इसे कभी भी बदल सकते हैं।",
        )}
      />
      <div className="max-w-3xl space-y-4">
        {noms.map((n, i) => (
          <Card key={n.id}>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">
                {t("Person", "व्यक्ति")} {i + 1}
              </p>
              {noms.length > 1 && (
                <A onClick={() => setNoms(noms.filter((x) => x.id !== n.id))}>{t("Remove", "हटाएँ")}</A>
              )}
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field label={t("Full name", "पूरा नाम")}>
                <input className={inputClass} value={n.name} onChange={(e) => update(n.id, { name: e.target.value })} />
              </Field>
              <Field label={t("Relation to you", "आपसे रिश्ता")}>
                <select
                  className={inputClass}
                  value={n.relation}
                  onChange={(e) => update(n.id, { relation: e.target.value })}
                >
                  {["Wife", "Husband", "Son", "Daughter", "Mother", "Father"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("Share (%)", "हिस्सा (%)")}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={n.share}
                  onChange={(e) => update(n.id, { share: Number(e.target.value.replace(/\D/g, "") || 0) })}
                />
              </Field>
            </div>
          </Card>
        ))}
        <Button
          variant="secondary"
          onClick={() => setNoms([...noms, { id: Date.now(), name: "", relation: "Son", share: 0 }])}
        >
          + {t("Add another person", "एक और व्यक्ति जोड़ें")}
        </Button>

        {total !== 100 && (
          <Callout tone="warning">
            {t("The shares must add up to 100%. Right now they add up to", "हिस्सों का जोड़ 100% होना चाहिए। अभी जोड़ है")}{" "}
            <b>{total}%</b>.
          </Callout>
        )}

        {saved && <Callout tone="success">{t("Nominee saved. Your family is protected.", "नॉमिनी सेव हो गया। आपका परिवार सुरक्षित है।")}</Callout>}

        <Button
          disabled={total !== 100 || noms.some((n) => !n.name.trim())}
          onClick={() => {
            setSaved(true);
            showToast(t("Nominee details saved", "नॉमिनी की जानकारी सेव हुई"));
          }}
        >
          {t("Save nominee", "नॉमिनी सेव करें")}
        </Button>
      </div>
      <Callout tone="info" title={t("Why this matters", "यह क्यों ज़रूरी है")}>
        {t(
          "Your nominee gets your PF savings, monthly pension, and up to ₹7 lakh insurance without going to court.",
          "आपके नॉमिनी को आपकी पीएफ बचत, मासिक पेंशन और ₹7 लाख तक बीमा बिना अदालत गए मिल जाता है।",
        )}
      </Callout>
    </RequireLogin>
  );
}

/* --------------------------------- Grievance --------------------------------- */

const CATEGORIES = [
  { k: "money", e: "💸", en: "My money has not arrived", hi: "मेरा पैसा नहीं आया" },
  { k: "employer", e: "🏢", en: "My employer is not depositing PF", hi: "मेरा नियोक्ता पीएफ जमा नहीं कर रहा" },
  { k: "details", e: "✏️", en: "My name / date of birth is wrong", hi: "मेरा नाम / जन्मतिथि गलत है" },
  { k: "pension", e: "👵", en: "Problem with my pension", hi: "पेंशन में समस्या" },
  { k: "login", e: "🔑", en: "I cannot log in", hi: "मैं लॉगिन नहीं कर पा रहा" },
  { k: "other", e: "❓", en: "Something else", hi: "कुछ और" },
];

export function GrievancePage() {
  const { t, navigate, addGrievance, grievances, showToast } = useApp();
  const [cat, setCat] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState<Grievance | null>(null);

  const suggestion: Record<string, { en: string; hi: string; to: string }> = {
    money: { en: "Check the live status of your claim first — most money arrives in 3 days.", hi: "पहले अपने क्लेम की स्थिति देखें — ज़्यादातर पैसा 3 दिन में आ जाता है।", to: "/track" },
    login: { en: "You can get your UAN and reset your password in 2 minutes.", hi: "आप 2 मिनट में यूएएन पा सकते हैं और पासवर्ड बदल सकते हैं।", to: "/uan-help" },
    details: { en: "Small corrections can be done yourself in My details.", hi: "छोटे सुधार आप खुद ‘मेरी जानकारी’ में कर सकते हैं।", to: "/kyc" },
  };

  if (done) {
    return (
      <div className="max-w-3xl">
        <div className="rounded-lg border-4 border-[#00703c] bg-[#00703c] p-8 text-white">
          <h1 className="text-3xl font-extrabold">{t("Complaint registered", "शिकायत दर्ज हो गई")}</h1>
          <p className="mt-2 text-xl">
            {t("Your number is", "आपका नंबर है")} <b>{done.id}</b>
          </p>
          <p className="mt-1 text-xl">{t("An officer will reply within 15 days.", "अधिकारी 15 दिन में जवाब देंगे।")}</p>
        </div>
        <Callout tone="info" title={t("What we do next", "आगे हम क्या करेंगे")}>
          <ol className="list-decimal space-y-1 pl-6">
            <li>{t("Your complaint goes straight to the officer who can fix it.", "आपकी शिकायत सीधे उस अधिकारी के पास जाती है जो इसे ठीक कर सकता है।")}</li>
            <li>{t("You get an SMS with their name and phone number.", "आपको उनका नाम और फोन नंबर एसएमएस से मिलेगा।")}</li>
            <li>{t("If it is not solved in 15 days, it moves to a senior officer automatically.", "15 दिन में हल न होने पर यह अपने आप वरिष्ठ अधिकारी के पास चली जाती है।")}</li>
          </ol>
        </Callout>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/dashboard")}>{t("Back to my account", "मेरे खाते पर वापस")}</Button>
          <Button variant="secondary" onClick={() => setDone(null)}>
            {t("Raise another complaint", "एक और शिकायत करें")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Raise a complaint", "शिकायत दर्ज करें") }]} />
      <PageTitle
        title={t("What went wrong?", "क्या गलत हुआ?")}
        intro={t(
          "Pick one line that matches your problem. No forms, no jargon, no file uploads unless we really need them.",
          "अपनी समस्या से मिलती एक लाइन चुनें। न फॉर्म, न कठिन शब्द, बिना ज़रूरत कोई फाइल अपलोड नहीं।",
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <ChoiceCard
            key={c.k}
            emoji={c.e}
            title={t(c.en, c.hi)}
            selected={cat === c.k}
            onSelect={() => setCat(c.k)}
          />
        ))}
      </div>

      {cat && suggestion[cat] && (
        <div className="mt-6">
          <Callout tone="info" title={t("This might solve it faster", "इससे शायद जल्दी हल हो जाए")}>
            <p>{t(suggestion[cat].en, suggestion[cat].hi)}</p>
            <div className="mt-2">
              <A to={suggestion[cat].to}>{t("Take me there", "मुझे वहाँ ले चलें")}</A>
            </div>
          </Callout>
        </div>
      )}

      {cat && (
        <div className="mt-6">
          <Field
            label={t("Tell us in your own words", "अपने शब्दों में बताएँ")}
            hint={t("Two lines are enough. Write in Hindi or English.", "दो लाइन काफी हैं। हिंदी या अंग्रेज़ी में लिखें।")}
          >
            <textarea className={inputClass} rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="mt-4">
            <Button
              disabled={text.trim().length < 5}
              onClick={() => {
                const g: Grievance = {
                  id: "EPFO" + Math.floor(100000 + Math.random() * 899999),
                  category: cat,
                  about: text.trim(),
                  filedOn: new Date().toLocaleDateString("en-IN"),
                  status: "received",
                };
                addGrievance(g);
                setDone(g);
                showToast(t("Complaint registered", "शिकायत दर्ज हुई"));
              }}
            >
              {t("Send my complaint", "मेरी शिकायत भेजें")}
            </Button>
          </div>
        </div>
      )}

      {grievances.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-2xl font-extrabold">{t("Your earlier complaints", "आपकी पिछली शिकायतें")}</h2>
          <ul className="space-y-3">
            {grievances.map((g) => (
              <li key={g.id}>
                <Card>
                  <p className="text-lg font-bold">{g.id}</p>
                  <p className="text-lg">{g.about}</p>
                  <p className="text-base text-[#505a5f]">
                    {t("Filed on", "दाखिल")} {g.filedOn} · {t("Reply due within 15 days", "15 दिन में जवाब")}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ---------------------------------- UAN help --------------------------------- */

export function UanHelp() {
  const { t, navigate } = useApp();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"start" | "otp" | "found">("start");

  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Find my UAN", "मेरा यूएएन खोजें") }]} />
      <PageTitle
        title={t("Don't know your UAN or password?", "यूएएन या पासवर्ड नहीं पता?")}
        intro={t(
          "Give us the mobile number linked to your Aadhaar. That is all we need.",
          "हमें अपने आधार से जुड़ा मोबाइल नंबर दें। बस इतना ही चाहिए।",
        )}
      />

      {stage === "start" && (
        <div className="space-y-4">
          <Field label={t("Mobile number", "मोबाइल नंबर")} hint={t("Any 10 digits work in this demo", "इस डेमो में कोई भी 10 अंक चलेंगे")}>
            <input
              className={inputClass}
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </Field>
          <Button disabled={mobile.length !== 10} onClick={() => setStage("otp")}>
            {t("Send me an OTP", "मुझे ओटीपी भेजें")}
          </Button>
        </div>
      )}

      {stage === "otp" && (
        <div className="space-y-4">
          <Field label={t("Enter OTP", "ओटीपी डालें")} hint={t("Demo OTP: 1234", "डेमो ओटीपी: 1234")}>
            <input className={inputClass} inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </Field>
          <Button disabled={otp !== DEMO.otp} onClick={() => setStage("found")}>
            {t("Show my UAN", "मेरा यूएएन दिखाएँ")}
          </Button>
        </div>
      )}

      {stage === "found" && (
        <Callout tone="success" title={t("Here is your UAN", "यह रहा आपका यूएएन")}>
          <p className="text-4xl font-extrabold tracking-wide">{DEMO.uan}</p>
          <p className="mt-2">
            {t("We have also sent it by SMS. Your temporary password is", "हमने इसे एसएमएस से भी भेजा है। आपका अस्थायी पासवर्ड है")}{" "}
            <b>{DEMO.password}</b>.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/login")}>{t("Sign in now", "अभी साइन इन करें")}</Button>
          </div>
        </Callout>
      )}

      <Callout tone="info" title={t("Other ways to check your balance", "बैलेंस देखने के और तरीके")}>
        <ul className="list-disc space-y-1 pl-6">
          <li>{t("Give a missed call to 011-22901406 from your registered mobile.", "अपने रजिस्टर्ड मोबाइल से 011-22901406 पर मिस्ड कॉल दें।")}</li>
          <li>{t("SMS “EPFOHO UAN ENG” to 7738299899.", "7738299899 पर “EPFOHO UAN HIN” एसएमएस करें।")}</li>
          <li>{t("Call the free helpline 14470 — they speak 10 languages.", "फ्री हेल्पलाइन 14470 पर कॉल करें — वे 10 भाषाएँ बोलते हैं।")}</li>
        </ul>
      </Callout>
    </div>
  );
}
