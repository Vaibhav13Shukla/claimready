import { useRef, useState } from "react";
import { useApp } from "../lib/store";
import { Accordion, Breadcrumbs, Button, Card, PageTitle } from "../components/ui";
import { rupees, totalBalance } from "../lib/data";

type Answer = { en: string; hi: string; actions?: { en: string; hi: string; to: string }[] };

const RULES: { match: RegExp; a: Answer }[] = [
  {
    match: /balance|kitna|paisa|amount|how much|बैलेंस|पैसा|कितना/i,
    a: {
      en: `Sign in with your UAN and you will see your balance on one screen. In the demo account it is ${rupees(totalBalance)}. You can also give a missed call to 011-22901406.`,
      hi: `यूएएन से साइन इन करें और एक ही स्क्रीन पर बैलेंस देखें। डेमो खाते में यह ${rupees(totalBalance)} है। आप 011-22901406 पर मिस्ड कॉल भी दे सकते हैं।`,
      actions: [{ en: "See my balance", hi: "मेरा बैलेंस देखें", to: "/balance" }],
    },
  },
  {
    match: /left (my )?job|resign|unemploy|quit|नौकरी छोड़|बेरोज़गार/i,
    a: {
      en: "After 1 month without a job you can take out 75% of your PF. After 2 months you can take everything. Your pension service years are safe either way.",
      hi: "नौकरी छूटने के 1 महीने बाद आप 75% निकाल सकते हैं। 2 महीने बाद पूरा पैसा। दोनों स्थिति में आपकी पेंशन सेवा सुरक्षित रहती है।",
      actions: [
        { en: "Start a withdrawal", hi: "निकासी शुरू करें", to: "/withdraw" },
        { en: "Move PF to a new job", hi: "नई नौकरी में पीएफ भेजें", to: "/transfer" },
      ],
    },
  },
  {
    match: /house|home|ghar|makan|घर|मकान|loan/i,
    a: {
      en: "After 5 years of PF service you can take up to 90% of your total PF to buy land, buy a flat or build a house. After 10 years you can also use it to repay a home loan.",
      hi: "5 साल की सेवा के बाद आप ज़मीन, फ्लैट या घर बनाने के लिए कुल पीएफ का 90% तक ले सकते हैं। 10 साल के बाद होम लोन चुकाने के लिए भी।",
      actions: [{ en: "Check my limit", hi: "मेरी सीमा देखें", to: "/withdraw" }],
    },
  },
  {
    match: /marriage|shadi|wedding|शादी|विवाह/i,
    a: {
      en: "After 7 years of PF service you can take up to half of your own contribution for your marriage, or your child's, brother's or sister's marriage.",
      hi: "7 साल की सेवा के बाद आप अपनी, बच्चे, भाई या बहन की शादी के लिए अपने योगदान का आधा तक ले सकते हैं।",
      actions: [{ en: "Check my limit", hi: "मेरी सीमा देखें", to: "/withdraw" }],
    },
  },
  {
    match: /medical|hospital|illness|beemar|बीमार|इलाज|अस्पताल/i,
    a: {
      en: "For illness of you or your family there is no minimum service. You can take up to 6 months of your basic salary or your own contribution, whichever is less. Most such claims are paid in 3 days.",
      hi: "आपकी या परिवार की बीमारी के लिए कोई न्यूनतम सेवा ज़रूरी नहीं। 6 महीने की बेसिक सैलरी या अपना योगदान, जो कम हो, ले सकते हैं। ऐसे ज़्यादातर क्लेम 3 दिन में मिल जाते हैं।",
      actions: [{ en: "Start a medical advance", hi: "मेडिकल एडवांस शुरू करें", to: "/withdraw" }],
    },
  },
  {
    match: /pension|58|retire|पेंशन|रिटायर/i,
    a: {
      en: "Your pension starts at 58 and is paid every month for life. It is roughly pensionable salary × service years ÷ 70. Try the slider tool to see your number.",
      hi: "पेंशन 58 साल से शुरू होकर जीवन भर हर महीने मिलती है। यह लगभग पेंशन योग्य वेतन × सेवा वर्ष ÷ 70 होती है। स्लाइडर टूल से अपना आँकड़ा देखें।",
      actions: [{ en: "Estimate my pension", hi: "मेरी पेंशन का अनुमान", to: "/pension" }],
    },
  },
  {
    match: /status|track|kab|delay|not received|कब|ट्रैक|स्थिति/i,
    a: {
      en: "Enter your claim reference number to see exactly which step your money is on and the date it should reach your bank.",
      hi: "अपना क्लेम संदर्भ नंबर डालें और देखें आपका पैसा किस चरण पर है और बैंक में कब पहुँचेगा।",
      actions: [{ en: "Track my claim", hi: "मेरा क्लेम ट्रैक करें", to: "/track" }],
    },
  },
  {
    match: /employer|company|not deposit|nahi jama|कंपनी|नियोक्ता|जमा नहीं/i,
    a: {
      en: "Open your passbook and check the last month your employer deposited. If a month is missing, raise a complaint, EPFO can recover the money with interest and penalty from the employer.",
      hi: "पासबुक खोलकर देखें नियोक्ता ने आख़िरी बार कब जमा किया। कोई महीना गायब हो तो शिकायत करें, ईपीएफओ ब्याज और जुर्माने सहित वसूली करता है।",
      actions: [
        { en: "Open passbook", hi: "पासबुक खोलें", to: "/passbook" },
        { en: "Raise a complaint", hi: "शिकायत दर्ज करें", to: "/grievance" },
      ],
    },
  },
  {
    match: /uan|password|login|otp|यूएएन|पासवर्ड|लॉगिन/i,
    a: {
      en: "You can get your UAN with just your mobile number and an OTP. No visit, no form.",
      hi: "सिर्फ़ मोबाइल नंबर और ओटीपी से आप अपना यूएएन पा सकते हैं। न जाना, न फॉर्म।",
      actions: [{ en: "Find my UAN", hi: "मेरा यूएएन खोजें", to: "/uan-help" }],
    },
  },
  {
    match: /death|died|expire|widow|मृत्यु|निधन|विधवा/i,
    a: {
      en: "The family gets three things: the full PF balance, a monthly family pension, and life insurance of up to ₹7 lakh. One checklist covers all three.",
      hi: "परिवार को तीन चीज़ें मिलती हैं: पूरा पीएफ, मासिक पारिवारिक पेंशन, और ₹7 लाख तक का बीमा। एक ही चेकलिस्ट में तीनों।",
      actions: [{ en: "Open the family checklist", hi: "परिवार की चेकलिस्ट खोलें", to: "/death-claim" }],
    },
  },
  {
    match: /tax|tds|टैक्स/i,
    a: {
      en: "PF is tax-free if you complete 5 years of service. If you withdraw before 5 years and the amount is more than ₹50,000, 10% TDS applies, and only if your PAN is missing, 20%.",
      hi: "5 साल की सेवा पूरी होने पर पीएफ कर-मुक्त है। 5 साल से पहले ₹50,000 से ज़्यादा निकालने पर 10% टीडीएस लगता है, पैन न होने पर 20%।",
      actions: [{ en: "Check my details", hi: "मेरी जानकारी देखें", to: "/kyc" }],
    },
  },
  {
    match: /office|address|near|पता|ऑफिस|कार्यालय/i,
    a: {
      en: "Almost everything can be done online, but if you want to meet someone, find your office by pincode.",
      hi: "लगभग सब कुछ ऑनलाइन हो जाता है, फिर भी किसी से मिलना हो तो पिनकोड से अपना ऑफिस खोजें।",
      actions: [{ en: "Find my office", hi: "मेरा ऑफिस खोजें", to: "/offices" }],
    },
  },
];

const FALLBACK: Answer = {
  en: "I did not understand that fully. Try words like balance, withdraw, pension, transfer, complaint, or UAN. You can also call the free helpline 14470.",
  hi: "मैं पूरी तरह समझ नहीं पाया। बैलेंस, निकासी, पेंशन, ट्रांसफर, शिकायत या यूएएन जैसे शब्द आज़माएँ। आप फ्री हेल्पलाइन 14470 पर भी कॉल कर सकते हैं।",
  actions: [{ en: "See all services", hi: "सभी सेवाएँ देखें", to: "/services" }],
};

type Msg = { from: "you" | "epfo"; text: string; actions?: Answer["actions"] };

export default function Help() {
  const { t, lang, navigate, speak } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "epfo",
      text: t(
        "Namaste! Tell me your problem in one line, like “I left my job” or “my money has not come”.",
        "नमस्ते! अपनी समस्या एक लाइन में बताएँ, जैसे “मैंने नौकरी छोड़ दी” या “मेरा पैसा नहीं आया”।",
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const rule = RULES.find((r) => r.match.test(q));
    const a = rule ? rule.a : FALLBACK;
    setMsgs((m) => [
      ...m,
      { from: "you", text: q },
      { from: "epfo", text: lang === "hi" ? a.hi : a.en, actions: a.actions },
    ]);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  };

  const chips = [
    t("How much money do I have?", "मेरे पास कितना पैसा है?"),
    t("I left my job", "मैंने नौकरी छोड़ दी"),
    t("Money for hospital", "अस्पताल के लिए पैसा"),
    t("My employer is not depositing", "मेरा नियोक्ता जमा नहीं कर रहा"),
    t("When will my pension start?", "मेरी पेंशन कब शुरू होगी?"),
  ];

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Help", "मदद") }]} />
      <PageTitle
        title={t("Ask EPFO", "ईपीएफओ से पूछें")}
        intro={t(
          "Type the way you speak. We will answer in plain language and take you straight to the right page.",
          "जैसे आप बोलते हैं वैसे लिखें। हम आसान भाषा में जवाब देंगे और सीधे सही पेज पर ले जाएँगे।",
        )}
      />

      <div className="rounded-lg border-2 border-[#b1b4b6] bg-[#f8f8f8] p-4">
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={m.from === "you" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[90%] rounded-lg px-4 py-3 text-lg ${
                  m.from === "you" ? "bg-[#12436d] text-white" : "border-2 border-[#b1b4b6] bg-white"
                }`}
              >
                <p>{m.text}</p>
                {m.actions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a.to + a.en}
                        onClick={() => navigate(a.to)}
                        className="rounded-[3px] bg-[#00703c] px-3 py-2 text-base font-bold text-white"
                      >
                        {t(a.en, a.hi)} →
                      </button>
                    ))}
                  </div>
                )}
                {m.from === "epfo" && (
                  <button
                    onClick={() => speak(m.text)}
                    className="no-print mt-2 block text-base font-bold text-[#1d70b8] underline"
                  >
                    {t("Listen", "सुनें")}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => ask(c)}
              className="rounded-full border-2 border-[#12436d] px-3 py-1 text-base font-bold text-[#12436d] hover:bg-[#eaf0f5]"
            >
              {c}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Type your question here", "अपना सवाल यहाँ लिखें")}
            className="w-full rounded-[3px] border-2 border-[#0b0c0c] px-4 py-3 text-lg"
          />
          <Button type="submit">{t("Ask", "पूछें")}</Button>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("Questions people ask most", "सबसे ज़्यादा पूछे जाने वाले सवाल")}</h2>
        <Accordion
          items={[
            {
              q: t("Is my PF money safe?", "क्या मेरा पीएफ पैसा सुरक्षित है?"),
              a: t(
                "Yes. It is held by the Government of India and earns 8.25% interest a year. No employer, bank or court can take it for someone else's debt.",
                "हाँ। यह भारत सरकार के पास रहता है और सालाना 8.25% ब्याज देता है। किसी और के कर्ज़ के लिए इसे कोई नियोक्ता, बैंक या अदालत नहीं ले सकती।",
              ),
            },
            {
              q: t("How long does money take to reach my bank?", "पैसा बैंक तक पहुँचने में कितना समय लगता है?"),
              a: t(
                "Most claims below ₹1 lakh with verified Aadhaar are paid in about 3 working days. Larger or unverified claims take up to 20 days.",
                "सत्यापित आधार वाले ₹1 लाख से कम के ज़्यादातर क्लेम लगभग 3 कार्यदिवस में मिल जाते हैं। बड़े या असत्यापित क्लेम में 20 दिन तक लग सकते हैं।",
              ),
            },
            {
              q: t("Do I need to go to an EPFO office?", "क्या मुझे ईपीएफओ ऑफिस जाना पड़ेगा?"),
              a: t(
                "No. Everything on this website can be done from your phone. Offices are only for rare cases like old records before 2014.",
                "नहीं। इस वेबसाइट का हर काम फोन से हो सकता है। ऑफिस सिर्फ़ 2014 से पहले के पुराने रिकॉर्ड जैसे मामलों के लिए है।",
              ),
            },
            {
              q: t("What if I never worked with PF for 10 years?", "अगर मैंने 10 साल पीएफ के साथ काम नहीं किया?"),
              a: t(
                "Then you do not get a monthly pension, but you get the whole pension amount back in one payment when you leave.",
                "तब मासिक पेंशन नहीं मिलती, पर नौकरी छोड़ते समय पूरी पेंशन राशि एकमुश्त वापस मिल जाती है।",
              ),
            },
            {
              q: t("Someone called asking for my OTP. Is that EPFO?", "किसी ने ओटीपी माँगा। क्या वह ईपीएफओ था?"),
              a: t(
                "No. EPFO never asks for OTP, password, PIN or money. Cut the call and report it on the helpline 14470.",
                "नहीं। ईपीएफओ कभी ओटीपी, पासवर्ड, पिन या पैसा नहीं माँगता। कॉल काटें और 14470 पर सूचना दें।",
              ),
            },
          ]}
        />
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { h: t("Free helpline", "फ्री हेल्पलाइन"), v: "14470", d: t("10 languages, 9am–5:30pm", "10 भाषाएँ, सुबह 9 – शाम 5:30") },
          { h: t("Missed call balance", "मिस्ड कॉल बैलेंस"), v: "011-22901406", d: t("No internet needed", "इंटरनेट की ज़रूरत नहीं") },
          { h: t("SMS balance", "एसएमएस बैलेंस"), v: "7738299899", d: "EPFOHO UAN ENG" },
        ].map((c) => (
          <Card key={c.h}>
            <p className="text-lg font-bold">{c.h}</p>
            <p className="text-2xl font-extrabold text-[#12436d]">{c.v}</p>
            <p className="text-base text-[#505a5f]">{c.d}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
