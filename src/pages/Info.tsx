import { useState } from "react";
import { useApp } from "../lib/store";
import { A, Accordion, Breadcrumbs, Button, Callout, Card, PageTitle, Tag, inputClass } from "../components/ui";
import { services } from "../lib/search";
import { offices } from "../lib/data";

/* --------------------------------- Services --------------------------------- */

export function Services() {
  const { t, navigate } = useApp();
  const groups: { k: string; en: string; hi: string }[] = [
    { k: "money", en: "Money in my PF", hi: "मेरे पीएफ का पैसा" },
    { k: "job", en: "When my job changes", hi: "जब नौकरी बदले" },
    { k: "details", en: "My details and family", hi: "मेरी जानकारी और परिवार" },
    { k: "help", en: "Help and complaints", hi: "मदद और शिकायत" },
    { k: "employer", en: "For employers", hi: "नियोक्ताओं के लिए" },
  ];
  return (
    <div>
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("All services", "सभी सेवाएँ") }]} />
      <PageTitle
        title={t("All services, in one list", "सभी सेवाएँ, एक सूची में")}
        intro={t(
          "16 services. No dropdown menus, no PDFs, no separate portals to log into.",
          "16 सेवाएँ। न ड्रॉपडाउन मेन्यू, न पीडीएफ, न अलग पोर्टल।",
        )}
      />
      {groups.map((g) => (
        <section key={g.k} className="mb-10">
          <h2 className="mb-4 border-b-4 border-[#12436d] pb-2 text-2xl font-extrabold">{t(g.en, g.hi)}</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {services
              .filter((s) => s.group === g.k)
              .map((s) => (
                <li key={s.to}>
                  <Card onClick={() => navigate(s.to)} className="h-full">
                    <h3 className="text-xl font-bold text-[#1d70b8] underline underline-offset-4">
                      {t(s.en, s.hi)}
                    </h3>
                    <p className="mt-1 text-lg">{t(s.descEn, s.descHi)}</p>
                    <p className="mt-2 text-base text-[#505a5f]">
                      {s.needsLogin ? `${t("Sign in needed", "साइन इन ज़रूरी")} · ` : ""}{s.minutes}
                    </p>
                  </Card>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ---------------------------------- About ----------------------------------- */

export function About() {
  const { t } = useApp();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("About EPFO", "ईपीएफओ के बारे में") }]} />
      <PageTitle
        title={t("About EPFO", "ईपीएफओ के बारे में")}
        intro={t(
          "We look after the retirement savings, pension and life insurance of over 7 crore working people in India.",
          "हम भारत के 7 करोड़ से ज़्यादा कामगारों की रिटायरमेंट बचत, पेंशन और जीवन बीमा की देखभाल करते हैं।",
        )}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { v: "7.5 crore", l: t("members contributing", "योगदान देने वाले सदस्य") },
          { v: "₹25 lakh crore", l: t("savings we look after", "हमारे पास सुरक्षित बचत") },
          { v: "78 lakh", l: t("pensioners paid monthly", "हर महीने पेंशन पाने वाले") },
        ].map((s) => (
          <Card key={s.l} className="bg-[#f4f8fb]">
            <p className="text-3xl font-extrabold text-[#12436d]">{s.v}</p>
            <p className="text-lg">{s.l}</p>
          </Card>
        ))}
      </div>

      <section className="mt-10 space-y-6">
        <div className="rounded-lg border-l-8 border-[#12436d] bg-[#eef5fb] p-5">
          <h2 className="text-2xl font-extrabold">{t("Our vision", "हमारा विज़न")}</h2>
          <p className="mt-2 text-xl">
            {t(
              "To be a world-class social security organisation that gives every worker in India dignity and income security in old age.",
              "एक विश्वस्तरीय सामाजिक सुरक्षा संगठन बनना जो भारत के हर कामगार को बुढ़ापे में सम्मान और आय सुरक्षा दे।",
            )}
          </p>
          <p className="mt-3 text-lg text-[#505a5f]">
            <b>{t("In plain words:", "आसान शब्दों में:")}</b>{" "}
            {t(
              "no worker should be poor after they stop working.",
              "काम छोड़ने के बाद कोई कामगार गरीब न हो।",
            )}
          </p>
        </div>

        <div className="rounded-lg border-l-8 border-[#00703c] bg-[#eaf5ef] p-5">
          <h2 className="text-2xl font-extrabold">{t("Our mission", "हमारा मिशन")}</h2>
          <p className="mt-2 text-xl">
            {t(
              "To extend the reach and quality of publicly managed old-age income security programmes through ever-improving standards of compliance and benefit delivery.",
              "अनुपालन और लाभ वितरण के लगातार बेहतर मानकों के ज़रिए सार्वजनिक वृद्धावस्था आय सुरक्षा कार्यक्रमों की पहुँच और गुणवत्ता बढ़ाना।",
            )}
          </p>
          <p className="mt-3 text-lg text-[#505a5f]">
            <b>{t("In plain words:", "आसान शब्दों में:")}</b>{" "}
            {t(
              "reach more workers, and pay them faster with less paperwork.",
              "ज़्यादा कामगारों तक पहुँचना, और कम कागज़ी कार्रवाई में जल्दी भुगतान करना।",
            )}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold">{t("Our objectives", "हमारे उद्देश्य")}</h2>
          <ol className="mt-3 space-y-3 text-lg">
            {[
              [
                "Universal coverage, bring every eligible worker, including gig and contract workers, under social security.",
                "सर्वव्यापी कवरेज, गिग और ठेका कामगारों सहित हर पात्र कामगार को सामाजिक सुरक्षा में लाना।",
              ],
              [
                "Reliable service, settle claims within 3 to 20 days, with no need to visit an office.",
                "भरोसेमंद सेवा, 3 से 20 दिन में क्लेम निपटाना, बिना ऑफिस आए।",
              ],
              [
                "Safe returns, keep members' money secure and pay a fair rate of interest every year.",
                "सुरक्षित रिटर्न, सदस्यों का पैसा सुरक्षित रखना और हर साल उचित ब्याज देना।",
              ],
              [
                "Full compliance, make sure every employer deposits what they owe, on time.",
                "पूर्ण अनुपालन, यह सुनिश्चित करना कि हर नियोक्ता समय पर जमा करे।",
              ],
              [
                "Transparency, let every member see their own money and the status of every request.",
                "पारदर्शिता, हर सदस्य अपना पैसा और हर अनुरोध की स्थिति खुद देख सके।",
              ],
              [
                "Ease of access, services in simple language, on any phone, in every Indian language.",
                "आसान पहुँच, सरल भाषा में, हर फोन पर, हर भारतीय भाषा में सेवाएँ।",
              ],
            ].map(([en, hi], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12436d] font-bold text-white">
                  {i + 1}
                </span>
                <span>{t(en, hi)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="schemes" className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("The three schemes we run", "हमारी तीन योजनाएँ")}</h2>
        <div className="space-y-4">
          {[
            {
              tag: "EPF 1952",
              h: t("Provident Fund, your savings", "भविष्य निधि, आपकी बचत"),
              d: t(
                "12% of your basic salary and a matching amount from your employer, growing at 8.25% a year. Yours to take when you retire, or in part for a real need.",
                "आपकी बेसिक सैलरी का 12% और उतना ही नियोक्ता का, 8.25% सालाना बढ़ता हुआ। रिटायरमेंट पर पूरा, और ज़रूरत पर कुछ हिस्सा।",
              ),
            },
            {
              tag: "EPS 1995",
              h: t("Pension, money every month after 58", "पेंशन, 58 के बाद हर महीने पैसा"),
              d: t(
                "8.33% of your employer's share goes here. After 10 years of service you get a pension for life, and your family gets it after you.",
                "नियोक्ता के हिस्से का 8.33% यहाँ जाता है। 10 साल की सेवा के बाद जीवन भर पेंशन, और आपके बाद परिवार को।",
              ),
            },
            {
              tag: "EDLI 1976",
              h: t("Insurance, up to ₹7 lakh, free", "बीमा, ₹7 लाख तक, मुफ़्त"),
              d: t(
                "If a member dies while in service, the family gets a lump sum of up to ₹7 lakh. You pay nothing for this cover.",
                "सेवा के दौरान सदस्य की मृत्यु होने पर परिवार को ₹7 लाख तक एकमुश्त मिलता है। इसके लिए आप कुछ नहीं देते।",
              ),
            },
          ].map((s) => (
            <Card key={s.tag}>
              <Tag tone="blue">{s.tag}</Tag>
              <h3 className="mt-2 text-xl font-bold">{s.h}</h3>
              <p className="mt-1 text-lg">{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("Promises we keep (Citizen Charter)", "हमारे वादे (नागरिक चार्टर)")}</h2>
        <ul className="divide-y-2 divide-[#b1b4b6] border-y-2 border-[#b1b4b6] text-lg">
          {[
            [t("Claims settled in", "क्लेम निपटान"), t("3 working days (auto) · 20 days (all others)", "3 कार्यदिवस (ऑटो) · 20 दिन (अन्य)")],
            [t("Complaints answered in", "शिकायत का जवाब"), t("15 days", "15 दिन")],
            [t("Transfer of PF completed in", "पीएफ ट्रांसफर पूरा"), t("7 days", "7 दिन")],
            [t("Pension paid on", "पेंशन भुगतान"), t("The last working day of every month", "हर महीने के अंतिम कार्यदिवस")],
            [t("Interest for 2024–25", "2024–25 का ब्याज"), "8.25%"],
          ].map(([k, v]) => (
            <li key={k} className="flex flex-wrap justify-between gap-2 py-3">
              <span>{k}</span>
              <span className="font-bold">{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("Transparency", "पारदर्शिता")}</h2>
        <Accordion
          items={[
            {
              q: t("Who runs EPFO?", "ईपीएफओ कौन चलाता है?"),
              a: t(
                "A tripartite Central Board of Trustees, the government, employers and workers' unions together, under the Ministry of Labour & Employment. It was set up by the EPF Act of 1952.",
                "एक त्रिपक्षीय केंद्रीय न्यासी बोर्ड, सरकार, नियोक्ता और श्रमिक संघ मिलकर, श्रम एवं रोजगार मंत्रालय के अधीन। इसकी स्थापना 1952 के ईपीएफ अधिनियम से हुई।",
              ),
            },
            {
              q: t("Right to Information (RTI)", "सूचना का अधिकार (आरटीआई)"),
              a: t(
                "You can ask us any question about your own file or our working. We reply within 30 days. Each regional office has a named public information officer.",
                "आप अपनी फाइल या हमारे काम के बारे में कोई भी सवाल पूछ सकते हैं। हम 30 दिन में जवाब देते हैं। हर क्षेत्रीय कार्यालय में नामित जन सूचना अधिकारी है।",
              ),
            },
            {
              q: t("Annual report and interest history", "वार्षिक रिपोर्ट और ब्याज इतिहास"),
              a: t(
                "Interest: 8.25% (2024–25), 8.25% (2023–24), 8.15% (2022–23), 8.10% (2021–22). Full accounts are published every year.",
                "ब्याज: 8.25% (2024–25), 8.25% (2023–24), 8.15% (2022–23), 8.10% (2021–22)। पूरा लेखा हर साल प्रकाशित होता है।",
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}

/* ---------------------------------- Offices ---------------------------------- */

export function Offices() {
  const { t, showToast } = useApp();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const list = term
    ? offices.filter(
        (o) =>
          o.city.toLowerCase().includes(term) ||
          o.state.toLowerCase().includes(term) ||
          o.pincodes.some((p) => p.startsWith(term)),
      )
    : offices;

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Find my office", "मेरा ऑफिस खोजें") }]} />
      <PageTitle
        title={t("Find your EPFO office", "अपना ईपीएफओ ऑफिस खोजें")}
        intro={t(
          "Almost everything can be done from your phone. If you still want to meet someone, book a time so you don't wait in a queue.",
          "लगभग सब कुछ फोन से हो जाता है। फिर भी मिलना हो तो समय बुक करें ताकि लाइन में न लगना पड़े।",
        )}
      />
      <input
        className={inputClass}
        placeholder={t("Type your pincode or city, e.g. 395002 or Surat", "अपना पिनकोड या शहर लिखें, जैसे 395002 या सूरत")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <p className="mt-3 text-lg text-[#505a5f]">
        {list.length} {t("offices found", "ऑफिस मिले")}
      </p>
      <ul className="mt-4 space-y-4">
        {list.map((o) => (
          <li key={o.id}>
            <Card>
              <h2 className="text-xl font-bold">{o.name}</h2>
              <p className="mt-1 text-lg">{o.address}</p>
              <p className="mt-1 text-lg">
                ☎ {o.phone} · ✉ {o.email}
              </p>
              <p className="text-base text-[#505a5f]">🕘 {o.hours}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => showToast(t("Appointment booked for tomorrow, 11:00 am", "कल सुबह 11:00 बजे का समय बुक हुआ"))}
                >
                  {t("Book a 15-minute slot", "15 मिनट का समय बुक करें")}
                </Button>
                <Button
                  variant="plain"
                  onClick={() =>
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(o.address)}`, "_blank")
                  }
                >
                  {t("Open in maps", "मैप में खोलें")}
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------- Death claim -------------------------------- */

export function DeathClaim() {
  const { t, navigate } = useApp();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Family claim", "परिवार का दावा") }]} />
      <PageTitle
        title={t("When a family member passes away", "जब परिवार के सदस्य का निधन हो जाए")}
        intro={t(
          "We are sorry for your loss. Here is everything in one place, in the order you should do it. You do not need a lawyer or an agent.",
          "आपके दुख में हम साथ हैं। यहाँ सब कुछ एक जगह है, उसी क्रम में जिसमें करना है। वकील या एजेंट की ज़रूरत नहीं।",
        )}
      />
      <h2 className="mb-3 text-2xl font-extrabold">{t("The family gets three things", "परिवार को तीन चीज़ें मिलती हैं")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { h: t("Full PF balance", "पूरा पीएफ बैलेंस"), d: t("Paid in one go", "एकमुश्त भुगतान") },
          { h: t("Monthly family pension", "मासिक पारिवारिक पेंशन"), d: t("For the spouse, and children till 25", "पति/पत्नी को, बच्चों को 25 साल तक") },
          { h: t("Insurance up to ₹7 lakh", "₹7 लाख तक बीमा"), d: t("Free cover under EDLI", "ईडीएलआई के तहत मुफ़्त") },
        ].map((c) => (
          <Card key={c.h}>
            <p className="text-lg font-bold">{c.h}</p>
            <p className="text-base text-[#505a5f]">{c.d}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-2xl font-extrabold">{t("What to do, step by step", "क्या करना है, चरण दर चरण")}</h2>
      <ol className="space-y-4 text-lg">
        {[
          [
            "Get the death certificate from your municipality (usually 7 days).",
            "नगर निगम से मृत्यु प्रमाण पत्र लें (आमतौर पर 7 दिन)।",
          ],
          [
            "Keep the member's UAN, your Aadhaar, your bank passbook and a photo ready.",
            "सदस्य का यूएएन, आपका आधार, बैंक पासबुक और फोटो तैयार रखें।",
          ],
          [
            "Fill one combined form (20, 10D and 5IF), we ask the questions in simple language.",
            "एक ही संयुक्त फॉर्म भरें (20, 10D और 5IF), हम सवाल आसान भाषा में पूछते हैं।",
          ],
          [
            "The employer signs online. If the employer has closed down, a gazetted officer or bank manager can attest.",
            "नियोक्ता ऑनलाइन हस्ताक्षर करता है। कंपनी बंद हो गई हो तो राजपत्रित अधिकारी या बैंक मैनेजर प्रमाणित कर सकते हैं।",
          ],
          [
            "Money reaches your bank in about 20 days. Pension starts from the next month.",
            "पैसा लगभग 20 दिन में बैंक पहुँचता है। पेंशन अगले महीने से शुरू होती है।",
          ],
        ].map(([en, hi], i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12436d] font-bold text-white">
              {i + 1}
            </span>
            <span>{t(en, hi)}</span>
          </li>
        ))}
      </ol>

      <Callout tone="info" title={t("Need someone to talk to?", "किसी से बात करनी है?")}>
        {t(
          "Call 14470 and say “family claim”. A helper will fill the form with you over the phone in your language.",
          "14470 पर कॉल करें और कहें “परिवार का दावा”। एक सहायक आपकी भाषा में फोन पर फॉर्म भरवा देगा।",
        )}
      </Callout>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/grievance")}>{t("Start the family claim", "परिवार का दावा शुरू करें")}</Button>
        <Button variant="plain" onClick={() => navigate("/offices")}>
          {t("Find help near me", "मेरे पास मदद खोजें")}
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------- Employers --------------------------------- */

export function Employers() {
  const { t, showToast } = useApp();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("For employers", "नियोक्ताओं के लिए") }]} />
      <PageTitle
        title={t("For employers", "नियोक्ताओं के लिए")}
        intro={t(
          "Four things you need to do. Each one takes minutes, not days.",
          "आपको चार काम करने हैं। हर एक में मिनट लगते हैं, दिन नहीं।",
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { h: t("Register my business", "मेरा व्यवसाय रजिस्टर करें"), d: t("Needed once you have 20 or more staff.", "20 या ज़्यादा कर्मचारी होने पर ज़रूरी।") },
          { h: t("File monthly ECR and pay", "मासिक ECR भरें और भुगतान करें"), d: t("Due by the 15th of every month.", "हर महीने की 15 तारीख तक।") },
          { h: t("Add a new employee", "नया कर्मचारी जोड़ें"), d: t("Only their Aadhaar and bank details are needed.", "सिर्फ़ आधार और बैंक विवरण चाहिए।") },
          { h: t("Mark an employee as exited", "कर्मचारी का निकास दर्ज करें"), d: t("Do this the same month, it unblocks their claims.", "उसी महीने करें, इससे उनके क्लेम रुकते नहीं।") },
        ].map((c) => (
          <Card key={c.h} onClick={() => showToast(t("Demo only, employer console not part of this prototype", "सिर्फ़ डेमो, नियोक्ता कंसोल इस प्रोटोटाइप में नहीं है"))}>
            <h2 className="text-xl font-bold text-[#1d70b8] underline underline-offset-4">{c.h}</h2>
            <p className="mt-1 text-lg">{c.d}</p>
          </Card>
        ))}
      </div>
      <Callout tone="warning" title={t("If you deposit late", "देर से जमा करने पर")}>
        {t(
          "Interest of 12% a year plus a penalty applies, and your employees can see the missing month in their passbook.",
          "12% सालाना ब्याज और जुर्माना लगता है, और आपके कर्मचारी अपनी पासबुक में गायब महीना देख सकते हैं।",
        )}
      </Callout>
    </div>
  );
}

/* ------------------------------- Accessibility ------------------------------- */

export function Accessibility() {
  const { t } = useApp();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Accessibility", "सुगम्यता") }]} />
      <PageTitle
        title={t("Built so that everyone can use it", "ताकि हर कोई इस्तेमाल कर सके")}
        intro={t(
          "A 14-year-old helping a parent and a 74-year-old pensioner should both finish their task without asking anyone.",
          "माता-पिता की मदद करता 14 साल का बच्चा और 74 साल का पेंशनभोगी, दोनों बिना किसी से पूछे अपना काम पूरा कर सकें।",
        )}
      />
      <ul className="space-y-3 text-lg">
        {[
          ["Text can be made 30% bigger with one tap, and stays big on every page.", "एक टैप में टेक्स्ट 30% बड़ा, और हर पेज पर बड़ा ही रहता है।"],
          ["A high-contrast mode for weak eyesight and bright sunlight.", "कमज़ोर नज़र और तेज़ धूप के लिए हाई-कॉन्ट्रास्ट मोड।"],
          ["Every important page can be read out loud in Hindi or English.", "हर ज़रूरी पेज हिंदी या अंग्रेज़ी में बोलकर सुनाया जा सकता है।"],
          ["Plain language, Class 6 reading level, no legal jargon, no abbreviations without meaning.", "सरल भाषा, कक्षा 6 का स्तर, न कानूनी शब्दजाल, न बिना अर्थ के संक्षेप।"],
          ["Works fully with a keyboard, with a bold yellow focus outline.", "कीबोर्ड से पूरा चलता है, चमकीली पीली फोकस लाइन के साथ।"],
          ["Light pages that open on 2G, and no pop-ups or moving banners.", "हल्के पेज जो 2G पर खुलें, न पॉप-अप न चलते बैनर।"],
          ["No photographs of officials taking up your screen, only your task.", "स्क्रीन पर अधिकारियों की तस्वीरें नहीं, सिर्फ़ आपका काम।"],
        ].map(([en, hi], i) => (
          <li key={i} className="flex gap-3">
            <span className="text-[#00703c]">✓</span>
            <span>{t(en, hi)}</span>
          </li>
        ))}
      </ul>
      <Callout tone="info" title={t("Found something hard to use?", "कुछ इस्तेमाल करने में मुश्किल लगा?")}>
        <p>
          {t("Tell us and we will fix it.", "हमें बताएँ, हम ठीक करेंगे।")} <A to="/grievance">{t("Report a problem", "समस्या बताएँ")}</A>
        </p>
      </Callout>
    </div>
  );
}

/* --------------------------------- Not found --------------------------------- */

export function NotFound() {
  const { t, navigate } = useApp();
  return (
    <div className="max-w-2xl">
      <PageTitle
        title={t("This page does not exist", "यह पेज मौजूद नहीं है")}
        intro={t("It may have moved. Try one of these instead.", "शायद यह हट गया है। इनमें से कोई आज़माएँ।")}
      />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate("/")}>{t("Go to home", "होम पर जाएँ")}</Button>
        <Button variant="secondary" onClick={() => navigate("/services")}>
          {t("All services", "सभी सेवाएँ")}
        </Button>
        <Button variant="plain" onClick={() => navigate("/help")}>
          {t("Ask EPFO", "ईपीएफओ से पूछें")}
        </Button>
      </div>
    </div>
  );
}
