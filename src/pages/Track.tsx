import { useState } from "react";
import { useApp } from "../lib/store";
import { A, Breadcrumbs, Button, Callout, Card, Field, PageTitle, Tag, inputClass } from "../components/ui";
import { rupees, type Claim } from "../lib/data";

function Timeline({ claim }: { claim: Claim }) {
  const { t } = useApp();
  return (
    <ol className="mt-6 border-l-4 border-[#b1b4b6] pl-6">
      {claim.history.map((h, i) => (
        <li key={i} className="relative pb-8 last:pb-0">
          <span
            className={`absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white ${
              h.done ? "bg-[#00703c]" : "bg-[#b1b4b6]"
            }`}
            aria-hidden
          >
            {h.done ? "✓" : i + 1}
          </span>
          <p className={`text-xl font-bold ${h.done ? "" : "text-[#505a5f]"}`}>{h.label}</p>
          <p className="text-lg text-[#505a5f]">{h.date}</p>
          {h.note && <p className="text-base text-[#505a5f]">{h.note}</p>}
          {!h.done && i === claim.history.findIndex((x) => !x.done) && (
            <p className="mt-1 text-base font-bold text-[#12436d]">
              {t("This is where your claim is right now.", "आपका क्लेम अभी यहाँ है।")}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function TrackDetail({ id }: { id: string }) {
  const { t, claims, navigate } = useApp();
  const claim = claims.find((c) => c.id === id);
  if (!claim) {
    return (
      <div>
        <PageTitle title={t("We could not find that claim", "वह क्लेम नहीं मिला")} />
        <Button onClick={() => navigate("/track")}>{t("Search again", "फिर से खोजें")}</Button>
      </div>
    );
  }
  const paid = claim.status === "paid";
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: t("Home", "होम"), to: "/" },
          { label: t("Track a claim", "क्लेम ट्रैक करें"), to: "/track" },
          { label: claim.id },
        ]}
      />
      <PageTitle caption={`${t("Reference", "संदर्भ")} ${claim.id}`} title={claim.reason} />
      <div className={`rounded-lg border-2 p-6 ${paid ? "border-[#00703c] bg-[#eaf5ef]" : "border-[#f47738] bg-[#fdf1e9]"}`}>
        <Tag tone={paid ? "green" : "orange"}>{paid ? t("Money paid", "पैसा भेजा गया") : t("In progress", "प्रक्रिया में")}</Tag>
        <p className="mt-3 text-4xl font-extrabold">{rupees(claim.amount)}</p>
        <p className="mt-2 text-xl">
          {paid
            ? t("Sent to", "भेजा गया")
            : t("Will be sent to", "भेजा जाएगा")}{" "}
          {claim.bank}
        </p>
        <p className="mt-1 text-xl font-bold">
          {paid ? t("Completed on", "पूरा हुआ") : t("Expected by", "अपेक्षित तारीख")} {claim.expected}
        </p>
      </div>
      <Timeline claim={claim} />
      <Callout tone="info" title={t("Money not received after the expected date?", "अपेक्षित तारीख के बाद पैसा नहीं मिला?")}>
        <p>
          {t(
            "Wait one working day for your bank to update, then raise a complaint. We reply within 15 days.",
            "बैंक अपडेट होने के लिए एक कार्यदिवस रुकें, फिर शिकायत दर्ज करें। हम 15 दिन में जवाब देते हैं।",
          )}
        </p>
        <div className="mt-3">
          <A to="/grievance">{t("Raise a complaint about this claim", "इस क्लेम की शिकायत करें")}</A>
        </div>
      </Callout>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={() => window.print()}>
          {t("Print this page", "यह पेज प्रिंट करें")}
        </Button>
        <Button variant="plain" onClick={() => navigate("/track")}>
          {t("See all my claims", "मेरे सभी क्लेम देखें")}
        </Button>
      </div>
    </div>
  );
}

export function TrackList() {
  const { t, claims, navigate, loggedIn } = useApp();
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Track a claim", "क्लेम ट्रैक करें") }]} />
      <PageTitle
        title={t("Where is my money?", "मेरा पैसा कहाँ है?")}
        intro={t(
          "Enter your claim reference number. You do not need to sign in.",
          "अपना क्लेम संदर्भ नंबर डालें। साइन इन करने की ज़रूरत नहीं।",
        )}
      />
      <div className="max-w-md">
        <Field
          label={t("Claim reference number", "क्लेम संदर्भ नंबर")}
          hint={t("Example: GJSRT250914001 (from your SMS)", "उदाहरण: GJSRT250914001 (आपके एसएमएस से)")}
          error={error}
        >
          <input className={inputClass} value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} />
        </Field>
        <div className="mt-4">
          <Button
            onClick={() => {
              const found = claims.find((c) => c.id === ref.trim());
              if (found) navigate(`/track/${found.id}`);
              else setError(t("No claim found with that number.", "इस नंबर से कोई क्लेम नहीं मिला।"));
            }}
          >
            {t("Check status", "स्थिति देखें")}
          </Button>
        </div>
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-extrabold">
        {loggedIn ? t("Your claims", "आपके क्लेम") : t("Demo claims you can open", "डेमो क्लेम जिन्हें आप खोल सकते हैं")}
      </h2>
      <ul className="space-y-3">
        {claims.map((c) => (
          <li key={c.id}>
            <Card onClick={() => navigate(`/track/${c.id}`)}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-[#1d70b8] underline">{c.id}</p>
                  <p className="text-lg">
                    {c.reason} · {rupees(c.amount)}
                  </p>
                  <p className="text-base text-[#505a5f]">
                    {t("Filed on", "दाखिल")} {c.filedOn}
                  </p>
                </div>
                <Tag tone={c.status === "paid" ? "green" : "orange"}>
                  {c.status === "paid" ? t("Paid", "भुगतान हुआ") : t("In progress", "प्रक्रिया में")}
                </Tag>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
