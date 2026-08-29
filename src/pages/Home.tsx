import { useApp } from "../lib/store";
import { services } from "../lib/search";
import { SearchBox } from "../components/Layout";
import { A, Button, Callout, Card, Tag } from "../components/ui";
import { DEMO, member, rupees, totalBalance } from "../lib/data";

const topTasks = [
  "/balance",
  "/withdraw",
  "/track",
  "/pension",
  "/transfer",
  "/kyc",
];

export default function Home() {
  const { t, navigate, loggedIn, speak } = useApp();
  const tasks = topTasks.map((to) => services.find((s) => s.to === to)!);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section
        className="relative -mx-4 -mt-8 overflow-hidden px-4 py-10 text-white sm:py-14"
        style={{
          background:
            "radial-gradient(1100px 420px at 88% -15%, #1e5c88 0%, rgba(30,92,136,0) 58%), linear-gradient(135deg, #12436d 0%, #0c2f4c 100%)",
        }}
      >
        <div className="relative mx-auto max-w-4xl">
          <h1 className="text-3xl leading-tight font-extrabold sm:text-5xl">
            {t("Your PF money, in plain language.", "आपका पीएफ पैसा, आसान भाषा में।")}
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-white/90">
            {t(
              "Check your balance, take out money, track a claim or plan your pension. Every task is written the way you would say it.",
              "बैलेंस देखें, पैसा निकालें, क्लेम ट्रैक करें या पेंशन की योजना बनाएँ। हर काम वैसे ही लिखा है जैसे आप बोलते हैं।",
            )}
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBox big />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-base">
            <span className="text-white/70">{t("People also ask:", "लोग यह भी पूछते हैं:")}</span>
            {[
              { l: t("How much money do I have?", "मेरे पास कितना पैसा है?"), to: "/balance" },
              { l: t("When will my money come?", "मेरा पैसा कब आएगा?"), to: "/track" },
              { l: t("Can I take money for a house?", "क्या घर के लिए पैसा ले सकता हूँ?"), to: "/withdraw" },
            ].map((c) => (
              <button
                key={c.to + c.l}
                onClick={() => navigate(c.to)}
                className="rounded-full border border-white/50 px-3 py-1 hover:bg-white/15"
              >
                {c.l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Signed-in snapshot or sign-in nudge */}
      {loggedIn ? (
        <section className="rounded-lg border-2 border-[#00703c] bg-[#eaf5ef] p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-lg font-bold">
                {t("Welcome back,", "वापसी पर स्वागत है,")} {t(member.name, member.nameHi)}
              </p>
              <p className="mt-1 text-lg">{t("Your total PF savings today", "आज आपकी कुल पीएफ बचत")}</p>
              <p className="text-4xl font-extrabold text-[#005a30]">{rupees(totalBalance)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/balance")}>{t("See the details", "विवरण देखें")}</Button>
              <Button variant="secondary" onClick={() => navigate("/withdraw")}>
                {t("Withdraw money", "पैसा निकालें")}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <Callout tone="info" title={t("New to this website? Start here.", "पहली बार आए हैं? यहाँ से शुरू करें।")}>
          <p>
            {t(
              "You do not need any documents to look around. To see your own money, sign in with your UAN — the 12-digit number on your salary slip.",
              "देखने के लिए किसी दस्तावेज़ की ज़रूरत नहीं। अपना पैसा देखने के लिए यूएएन से साइन इन करें — यह आपकी सैलरी स्लिप पर 12 अंकों का नंबर है।",
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/login")}>{t("Sign in with UAN", "यूएएन से साइन इन करें")}</Button>
            <Button variant="plain" onClick={() => navigate("/uan-help")}>
              {t("I don't know my UAN", "मुझे यूएएन नहीं पता")}
            </Button>
          </div>
          <p className="mt-3 text-base text-[#505a5f]">
            {t("Demo login:", "डेमो लॉगिन:")} UAN <b>{DEMO.uan}</b> · {t("Password", "पासवर्ड")} <b>{DEMO.password}</b> ·{" "}
            {t("OTP", "ओटीपी")} <b>{DEMO.otp}</b>
          </p>
        </Callout>
      )}

      {/* Top tasks */}
      <section>
        <h2 className="mb-1 text-2xl font-extrabold">
          {t("9 out of 10 people come here to do one of these", "10 में से 9 लोग इन्हीं कामों के लिए आते हैं")}
        </h2>
        <p className="mb-5 text-lg text-[#505a5f]">
          {t("Tap a box. No forms until you actually need one.", "किसी बॉक्स पर टैप करें। ज़रूरत होने तक कोई फॉर्म नहीं।")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((s) => (
            <Card key={s.to} onClick={() => navigate(s.to)} className="h-full">
              <div className="text-3xl" aria-hidden>
                {s.emoji}
              </div>
              <h3 className="mt-2 text-xl font-bold text-[#1d70b8] underline underline-offset-4">
                {t(s.en, s.hi)}
              </h3>
              <p className="mt-1 text-lg text-[#2b3236]">{t(s.descEn, s.descHi)}</p>
              {s.minutes && (
                <p className="mt-3 text-base font-bold text-[#505a5f]">
                  ⏱ {t("Takes about", "लगभग")} {s.minutes}
                </p>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-5">
          <A to="/services" className="text-xl font-bold">
            {t("See all services →", "सभी सेवाएँ देखें →")}
          </A>
        </div>
      </section>

      {/* Guided help */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#12436d] bg-[#f4f8fb]">
          <Tag tone="blue">{t("Not sure what you need?", "पता नहीं क्या चाहिए?")}</Tag>
          <h2 className="mt-3 text-2xl font-extrabold">
            {t("Tell us your situation in one line", "अपनी स्थिति एक लाइन में बताएँ")}
          </h2>
          <p className="mt-2 text-lg">
            {t(
              "Type things like “I left my job”, “I need money for my daughter's wedding” or “my employer is not paying PF”. We will take you to the exact page — no menus to hunt through.",
              "जैसे लिखें “मैंने नौकरी छोड़ दी”, “बेटी की शादी के लिए पैसा चाहिए” या “कंपनी पीएफ जमा नहीं कर रही”। हम आपको सीधे सही पेज पर ले जाएँगे।",
            )}
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/help")}>{t("Ask EPFO", "ईपीएफओ से पूछें")}</Button>
          </div>
        </Card>
        <Card>
          <Tag tone="green">{t("60-second explainer", "60 सेकंड की समझ")}</Tag>
          <h2 className="mt-3 text-2xl font-extrabold">{t("What is PF, simply?", "पीएफ आख़िर है क्या?")}</h2>
          <ol className="mt-3 space-y-3 text-lg">
            <li>
              <b>1.</b>{" "}
              {t(
                "Every month, 12% of your basic salary goes into your PF savings.",
                "हर महीने आपकी बेसिक सैलरी का 12% पीएफ में जमा होता है।",
              )}
            </li>
            <li>
              <b>2.</b>{" "}
              {t(
                "Your employer puts in the same amount — part of it goes to your pension.",
                "आपका नियोक्ता भी उतना ही डालता है — उसका कुछ हिस्सा पेंशन में जाता है।",
              )}
            </li>
            <li>
              <b>3.</b>{" "}
              {t(
                `The government adds ${member.interestRate}% interest every year. Nobody can touch it except you.`,
                `सरकार हर साल ${member.interestRate}% ब्याज जोड़ती है। आपके अलावा कोई इसे नहीं छू सकता।`,
              )}
            </li>
          </ol>
          <button
            onClick={() =>
              speak(
                t(
                  "Every month twelve percent of your basic salary goes into your P F savings. Your employer puts in the same amount. The government adds interest every year.",
                  "हर महीने आपकी बेसिक सैलरी का बारह प्रतिशत पीएफ में जमा होता है। आपका नियोक्ता भी उतना ही डालता है। सरकार हर साल ब्याज जोड़ती है।",
                ),
              )
            }
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-[#12436d] px-3 py-1 text-base font-bold text-[#12436d]"
          >
            🔊 {t("Listen instead of reading", "पढ़ने की जगह सुनें")}
          </button>
        </Card>
      </section>

      {/* Notices - plain, no scrolling marquee */}
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">{t("Notices you actually need", "काम की सूचनाएँ")}</h2>
        <ul className="divide-y-2 divide-[#b1b4b6] border-y-2 border-[#b1b4b6]">
          {[
            {
              tag: t("Interest", "ब्याज"),
              tone: "green" as const,
              text: t(
                "Interest of 8.25% for 2024-25 has been credited to all accounts. Check your passbook.",
                "2024-25 के लिए 8.25% ब्याज सभी खातों में जमा कर दिया गया है। अपनी पासबुक देखें।",
              ),
              to: "/passbook",
            },
            {
              tag: t("Faster claims", "तेज़ क्लेम"),
              tone: "blue" as const,
              text: t(
                "Auto-settlement limit is now ₹1 lakh — most medical, education and housing advances are paid in 3 days.",
                "ऑटो-सेटलमेंट की सीमा अब ₹1 लाख — ज़्यादातर मेडिकल, शिक्षा और आवास एडवांस 3 दिन में मिल जाते हैं।",
              ),
              to: "/withdraw",
            },
            {
              tag: t("Careful", "सावधान"),
              tone: "red" as const,
              text: t(
                "EPFO never asks for your UAN password, OTP or bank PIN on phone or WhatsApp. Never share them.",
                "ईपीएफओ फोन या व्हाट्सएप पर कभी भी यूएएन पासवर्ड, ओटीपी या बैंक पिन नहीं माँगता। इन्हें किसी को न बताएँ।",
              ),
              to: "/help",
            },
          ].map((n, i) => (
            <li key={i} className="flex flex-wrap items-start gap-3 py-4">
              <Tag tone={n.tone}>{n.tag}</Tag>
              <p className="flex-1 text-lg">
                {n.text} <A to={n.to}>{t("Read more", "और पढ़ें")}</A>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Helping someone else */}
      <section className="rounded-lg bg-[#f3f2f1] p-6">
        <h2 className="text-2xl font-extrabold">
          {t("Helping your parent or a worker?", "माता-पिता या किसी कामगार की मदद कर रहे हैं?")}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              e: "👵",
              h: t("Pensioners", "पेंशनभोगी"),
              d: t("Life certificate, pension slip, and why the amount changed.", "जीवन प्रमाण, पेंशन स्लिप, और राशि क्यों बदली।"),
              to: "/pension",
            },
            {
              e: "🕊️",
              h: t("After a death in the family", "परिवार में मृत्यु के बाद"),
              d: t("One checklist for PF, pension and ₹7 lakh insurance.", "पीएफ, पेंशन और ₹7 लाख बीमा के लिए एक चेकलिस्ट।"),
              to: "/death-claim",
            },
            {
              e: "🧾",
              h: t("Employer not paying?", "नियोक्ता जमा नहीं कर रहा?"),
              d: t("Check the last deposit date and complain in 4 minutes.", "आख़िरी जमा तारीख देखें और 4 मिनट में शिकायत करें।"),
              to: "/grievance",
            },
          ].map((c) => (
            <Card key={c.to} onClick={() => navigate(c.to)}>
              <span className="text-3xl">{c.e}</span>
              <h3 className="mt-2 text-xl font-bold text-[#1d70b8] underline underline-offset-4">{c.h}</h3>
              <p className="mt-1 text-lg">{c.d}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
