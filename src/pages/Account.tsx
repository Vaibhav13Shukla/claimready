import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { A, Breadcrumbs, Button, Callout, Card, PageTitle, Tag } from "../components/ui";
import RequireLogin from "../components/RequireLogin";
import { buildPassbook, employments, member, rupees, totalBalance } from "../lib/data";

export function Dashboard() {
  const { t, navigate, claims, grievances } = useApp();
  const openClaims = claims.filter((c) => c.status !== "paid");
  return (
    <RequireLogin>
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("My account", "मेरा खाता") }]} />
      <PageTitle
        caption={`UAN ${member.uan}`}
        title={`${t("Hello", "नमस्ते")}, ${t(member.name, member.nameHi)}`}
        intro={t(
          "Everything about your PF in one place.",
          "आपके पीएफ की हर बात एक जगह।",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-[#00703c] bg-[#eaf5ef]">
          <p className="text-lg font-bold">{t("Total PF savings", "कुल पीएफ बचत")}</p>
          <p className="text-5xl font-extrabold text-[#005a30]">{rupees(totalBalance)}</p>
          <p className="mt-2 text-lg">
            {t("Plus a pension fund of", "साथ ही पेंशन फंड")} <b>{rupees(member.balance.pension)}</b>{" "}
            {t("that pays you monthly after age 58.", "जो 58 साल के बाद हर महीने पेंशन देता है।")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/balance")}>{t("See breakdown", "विवरण देखें")}</Button>
            <Button variant="secondary" onClick={() => navigate("/passbook")}>
              {t("Open passbook", "पासबुक खोलें")}
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-lg font-bold">{t("Your details check", "आपकी जानकारी की जाँच")}</p>
          <ul className="mt-3 space-y-2 text-lg">
            {[
              { l: "Aadhaar", ok: member.kyc.aadhaar },
              { l: "PAN", ok: member.kyc.pan },
              { l: t("Bank account", "बैंक खाता"), ok: member.kyc.bank },
              { l: t("Mobile number", "मोबाइल नंबर"), ok: member.kyc.mobile },
              { l: t("Nominee added", "नॉमिनी जोड़ा"), ok: true },
            ].map((k) => (
              <li key={k.l} className="flex items-center justify-between gap-2">
                <span>{k.l}</span>
                <span className={k.ok ? "font-bold text-[#00703c]" : "font-bold text-[#d4351c]"}>
                  {k.ok ? `✓ ${t("Verified", "सत्यापित")}` : `✗ ${t("Missing", "अधूरा")}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-base text-[#505a5f]">
            {t(
              "All verified means your claims can be paid automatically in about 3 days.",
              "सब सत्यापित होने पर आपका क्लेम लगभग 3 दिन में अपने आप मिल सकता है।",
            )}
          </p>
          <div className="mt-3">
            <A to="/kyc">{t("Change my details", "जानकारी बदलें")}</A>
          </div>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("Things happening now", "अभी चल रही चीज़ें")}</h2>
        {openClaims.length === 0 && grievances.length === 0 ? (
          <Callout tone="success">
            {t(
              "Nothing pending. Your last claim of ₹45,000 was paid on 20 Sep 2025.",
              "कुछ भी लंबित नहीं। आपका पिछला ₹45,000 का क्लेम 20 सितंबर 2025 को दिया गया।",
            )}
          </Callout>
        ) : (
          <ul className="space-y-3">
            {openClaims.map((c) => (
              <li key={c.id}>
                <Card onClick={() => navigate(`/track/${c.id}`)}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#1d70b8] underline">
                        {c.type} · {rupees(c.amount)}
                      </p>
                      <p className="text-base text-[#505a5f]">
                        {t("Filed on", "दाखिल")} {c.filedOn} · {t("Money expected by", "पैसा मिलने की तारीख")} {c.expected}
                      </p>
                    </div>
                    <Tag tone="orange">{t("In progress", "प्रक्रिया में")}</Tag>
                  </div>
                </Card>
              </li>
            ))}
            {grievances.map((g) => (
              <li key={g.id}>
                <Card onClick={() => navigate("/grievance")}>
                  <p className="text-lg font-bold text-[#1d70b8] underline">
                    {t("Complaint", "शिकायत")} {g.id}
                  </p>
                  <p className="text-base text-[#505a5f]">{g.about}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold">{t("Your jobs and PF accounts", "आपकी नौकरियाँ और पीएफ खाते")}</h2>
        <ul className="space-y-3">
          {employments.map((e) => (
            <li key={e.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-bold">{e.employer}</p>
                    <p className="text-lg text-[#505a5f]">
                      {e.city} · {e.from} – {e.to ?? t("Now", "अब तक")}
                    </p>
                    <p className="text-base text-[#505a5f]">{t("Member ID", "मेंबर आईडी")}: {e.memberId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold">{rupees(e.balance)}</p>
                    {e.transferred ? (
                      <Tag tone="green">{t("Merged into current account", "मौजूदा खाते में मिल गया")}</Tag>
                    ) : (
                      <Tag tone="orange">{t("Not merged yet", "अभी मर्ज नहीं हुआ")}</Tag>
                    )}
                  </div>
                </div>
                {!e.transferred && (
                  <div className="mt-4">
                    <Button onClick={() => navigate("/transfer")}>
                      {t("Move this money to my current job", "इस पैसे को मौजूदा नौकरी में लाएँ")}
                    </Button>
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </RequireLogin>
  );
}

export function Balance() {
  const { t, navigate, speak } = useApp();
  const b = member.balance;
  const parts = [
    { l: t("Your own contribution", "आपका अपना योगदान"), v: b.employee, c: "#12436d" },
    { l: t("Your employer's contribution", "नियोक्ता का योगदान"), v: b.employer, c: "#00703c" },
    { l: t("Pension fund (paid monthly after 58)", "पेंशन फंड (58 के बाद मासिक)"), v: b.pension, c: "#f47738" },
  ];
  const grand = parts.reduce((s, p) => s + p.v, 0);
  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("My balance", "मेरा बैलेंस") },
        ]}
      />
      <PageTitle
        title={t("How much money do I have?", "मेरे पास कितना पैसा है?")}
        speakText={t(
          `You have ${rupees(totalBalance)} in provident fund and ${rupees(b.pension)} in your pension fund.`,
          `आपके भविष्य निधि में ${rupees(totalBalance)} और पेंशन फंड में ${rupees(b.pension)} हैं।`,
        )}
        intro={t(
          "Updated today.",
          "आज अपडेट किया गया।",
        )}
      />

      <div className="rounded-lg border-2 border-[#00703c] bg-[#eaf5ef] p-6">
        <p className="text-lg font-bold">{t("You can see and use this now", "यह पैसा अभी दिख रहा है")}</p>
        <p className="text-5xl font-extrabold text-[#005a30] sm:text-6xl">{rupees(totalBalance)}</p>
        <button
          onClick={() =>
            speak(
              t(
                `Your provident fund balance is ${rupees(totalBalance)}`,
                `आपका भविष्य निधि बैलेंस ${rupees(totalBalance)} है`,
              ),
            )
          }
          className="no-print mt-3 rounded-full border-2 border-[#005a30] px-3 py-1 text-base font-bold text-[#005a30]"
        >
          {t("Say the amount out loud", "राशि बोलकर सुनाएँ")}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {parts.map((p) => (
          <div key={p.l}>
            <div className="flex justify-between text-lg font-bold">
              <span>{p.l}</span>
              <span>{rupees(p.v)}</span>
            </div>
            <div className="mt-1 h-5 w-full rounded-full bg-[#eeefef]">
              <div
                className="h-5 rounded-full"
                style={{ width: `${(p.v / grand) * 100}%`, background: p.c }}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            h: t("Interest added this year", "इस साल जुड़ा ब्याज"),
            v: rupees(b.interestThisYear),
            d: t(`At ${member.interestRate}% a year`, `${member.interestRate}% सालाना की दर से`),
          },
          {
            h: t("Last deposit by employer", "नियोक्ता की आख़िरी जमा"),
            v: "Oct 2025",
            d: t("On time ✓", "समय पर ✓"),
          },
          {
            h: t("Years of PF service", "पीएफ सेवा के वर्ष"),
            v: `${member.serviceYears}`,
            d: t("Counts towards pension", "पेंशन के लिए गिने जाते हैं"),
          },
        ].map((c) => (
          <Card key={c.h}>
            <p className="text-lg text-[#505a5f]">{c.h}</p>
            <p className="text-3xl font-extrabold">{c.v}</p>
            <p className="text-base text-[#505a5f]">{c.d}</p>
          </Card>
        ))}
      </div>

      <Callout tone="info" title={t("What can I do with this money?", "इस पैसे का क्या कर सकता हूँ?")}>
        <p>
          {t(
            "You can take out a part of it for a house, wedding, illness or education while you are working. You get all of it when you retire or stay unemployed for 2 months.",
            "नौकरी के दौरान घर, शादी, बीमारी या पढ़ाई के लिए कुछ हिस्सा निकाल सकते हैं। रिटायरमेंट पर या 2 महीने बेरोज़गार रहने पर पूरा पैसा मिलता है।",
          )}
        </p>
      </Callout>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/withdraw")}>{t("Check what I can withdraw", "देखें कितना निकाल सकता हूँ")}</Button>
        <Button variant="secondary" onClick={() => navigate("/passbook")}>
          {t("See month-by-month passbook", "महीनेवार पासबुक देखें")}
        </Button>
        <Button variant="plain" onClick={() => navigate("/calculators")}>
          {t("See how it will grow", "देखें यह कैसे बढ़ेगा")}
        </Button>
      </div>
    </RequireLogin>
  );
}

export function Passbook() {
  const { t } = useApp();
  const rows = useMemo(() => buildPassbook(), []);
  const years = Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);
  const [year, setYear] = useState(years[0]);
  const shown = rows.filter((r) => r.year === year);
  const total = shown.reduce((s, r) => s + r.employee + r.employer, 0);

  return (
    <RequireLogin>
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("My account", "मेरा खाता"), to: "/dashboard" },
          { label: t("Passbook", "पासबुक") },
        ]}
      />
      <PageTitle
        title={t("My passbook", "मेरी पासबुक")}
        intro={t(
          "Every rupee that went in, month by month.",
          "हर महीने जमा हुआ हर रुपया।",
        )}
      />

      <div className="no-print mb-4 flex flex-wrap items-center gap-3">
        <span className="text-lg font-bold">{t("Choose year", "साल चुनें")}:</span>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`rounded-full px-4 py-2 text-lg font-bold ${
              y === year ? "bg-[#12436d] text-white" : "bg-[#eeefef] text-[#12436d] hover:bg-[#dde5eb]"
            }`}
          >
            {y}
          </button>
        ))}
        <Button variant="secondary" onClick={() => window.print()}>
          {t("Print / save as PDF", "प्रिंट / पीडीएफ सेव करें")}
        </Button>
      </div>

      <Callout tone="success">
        {t("Total added in", "कुल जमा")} {year}: <b>{rupees(total)}</b>
      </Callout>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-lg">
          <thead>
            <tr className="border-b-4 border-[#0b0c0c] text-left">
              <th className="py-3 pr-4">{t("Month", "महीना")}</th>
              <th className="py-3 pr-4">{t("You paid", "आपने दिया")}</th>
              <th className="py-3 pr-4">{t("Employer paid", "नियोक्ता ने दिया")}</th>
              <th className="py-3 pr-4">{t("To pension", "पेंशन में")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className={`border-b border-[#b1b4b6] ${r.type === "interest" ? "bg-[#eaf5ef]" : ""}`}>
                <td className="py-3 pr-4 font-bold">
                  {r.month}
                  {r.note && <span className="block text-base font-normal text-[#505a5f]">{r.note}</span>}
                </td>
                <td className="py-3 pr-4">{rupees(r.employee)}</td>
                <td className="py-3 pr-4">{rupees(r.employer)}</td>
                <td className="py-3 pr-4">{r.pension ? rupees(r.pension) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RequireLogin>
  );
}
