import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { Breadcrumbs, Button, Callout, Card, PageTitle } from "../components/ui";
import { member, rupees, totalBalance } from "../lib/data";

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-lg font-bold">{label}</span>
        <span className="text-2xl font-extrabold text-[#12436d]">{display}</span>
      </div>
      {hint && <p className="text-base text-[#505a5f]">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-3 w-full accent-[#12436d]"
        aria-label={label}
      />
      <div className="flex justify-between text-base text-[#505a5f]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function Pension() {
  const { t, navigate } = useApp();
  const [age, setAge] = useState(member.age);
  const [salary, setSalary] = useState(member.monthlySalary);
  const [service, setService] = useState(member.serviceYears);

  const yearsLeft = Math.max(0, 58 - age);
  const totalService = Math.min(35, service + yearsLeft);
  const pensionableSalary = Math.min(15000, salary);
  const monthly = Math.round((pensionableSalary * totalService) / 70);
  const widow = Math.round(monthly * 0.5);

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("My pension", "मेरी पेंशन") }]} />
      <PageTitle
        title={t("How much pension will I get every month?", "मुझे हर महीने कितनी पेंशन मिलेगी?")}
        intro={t(
          "Move the three bars below. No forms, no login. This is the EPS-95 pension you get for life after you turn 58.",
          "नीचे तीन बार खिसकाएँ। न फॉर्म, न लॉगिन। यह ईपीएस-95 पेंशन है जो 58 साल के बाद जीवन भर मिलती है।",
        )}
      />

      <Card>
        <Slider
          label={t("Your age today", "आपकी आज की उम्र")}
          value={age}
          min={18}
          max={58}
          step={1}
          onChange={setAge}
          display={`${age} ${t("years", "साल")}`}
        />
        <Slider
          label={t("Your monthly basic salary", "आपकी मासिक बेसिक सैलरी")}
          hint={t("Pension is counted only up to ₹15,000 by law.", "कानून के अनुसार पेंशन ₹15,000 तक ही गिनी जाती है।")}
          value={salary}
          min={5000}
          max={100000}
          step={1000}
          onChange={setSalary}
          display={rupees(salary)}
        />
        <Slider
          label={t("Years you have already worked with PF", "पीएफ के साथ काम किए हुए साल")}
          value={service}
          min={0}
          max={35}
          step={1}
          onChange={setService}
          display={`${service} ${t("years", "साल")}`}
        />
      </Card>

      <div className="mt-6 rounded-lg border-2 border-[#00703c] bg-[#eaf5ef] p-6">
        <p className="text-lg font-bold">{t("Your pension from age 58, every month", "58 की उम्र से हर महीने आपकी पेंशन")}</p>
        <p className="text-5xl font-extrabold text-[#005a30]">{rupees(monthly)}</p>
        <p className="mt-2 text-lg">
          {t("Counted as", "गणना")}: {rupees(pensionableSalary)} × {totalService} {t("years", "साल")} ÷ 70
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { h: t("If you stop work at 50", "अगर 50 पर काम छोड़ें"), v: rupees(Math.round((pensionableSalary * Math.min(35, service + Math.max(0, 50 - age))) / 70)) },
          { h: t("Your family gets after you", "आपके बाद परिवार को"), v: rupees(widow) + t("/month", "/माह") },
          { h: t("Minimum pension guaranteed", "न्यूनतम गारंटी पेंशन"), v: "₹1,000" },
        ].map((c) => (
          <Card key={c.h}>
            <p className="text-lg text-[#505a5f]">{c.h}</p>
            <p className="text-2xl font-extrabold">{c.v}</p>
          </Card>
        ))}
      </div>

      <Callout tone="info" title={t("Simple rules worth knowing", "जानने लायक आसान नियम")}>
        <ul className="list-disc space-y-1 pl-6">
          <li>{t("You need 10 years of PF service to get a lifetime pension.", "जीवन भर पेंशन के लिए 10 साल की पीएफ सेवा चाहिए।")}</li>
          <li>{t("You can start early at 50 with a smaller amount, or wait till 60 for more.", "50 पर कम राशि से शुरू कर सकते हैं, या 60 तक रुककर ज़्यादा पा सकते हैं।")}</li>
          <li>{t("Pensioners must give a life certificate once a year, it can be done from home.", "पेंशनभोगियों को साल में एक बार जीवन प्रमाण देना होता है, घर से भी हो सकता है।")}</li>
        </ul>
      </Callout>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/calculators")}>{t("See how my savings will grow", "देखें मेरी बचत कैसे बढ़ेगी")}</Button>
        <Button variant="plain" onClick={() => navigate("/help")}>
          {t("Ask a pension question", "पेंशन का सवाल पूछें")}
        </Button>
      </div>
    </div>
  );
}

export function Calculators() {
  const { t } = useApp();
  const [balance, setBalance] = useState(totalBalance);
  const [monthlyBasic, setMonthlyBasic] = useState(member.monthlySalary);
  const [age, setAge] = useState(member.age);
  const [growth, setGrowth] = useState(5);

  const projection = useMemo(() => {
    const rate = 0.0825;
    let bal = balance;
    let basic = monthlyBasic;
    const rows: { age: number; bal: number }[] = [{ age, bal }];
    for (let a = age + 1; a <= 58; a++) {
      const yearly = basic * 0.24 * 12; // employee + employer, roughly
      bal = bal * (1 + rate) + yearly * (1 + rate / 2);
      basic = basic * (1 + growth / 100);
      rows.push({ age: a, bal });
    }
    return rows;
  }, [balance, monthlyBasic, age, growth]);

  const final = projection[projection.length - 1].bal;
  const chartRows = projection.filter((r, i) => i === 0 || r.age % 5 === 0 || r.age === 58);
  const maxBal = Math.max(...chartRows.map((r) => r.bal));

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Calculators", "कैलकुलेटर") }]} />
      <PageTitle
        title={t("How big will my PF get?", "मेरा पीएफ कितना बड़ा होगा?")}
        intro={t(
          "One honest number, so you can plan. Interest is taken as 8.25% a year.",
          "एक ईमानदार आँकड़ा, ताकि आप योजना बना सकें। ब्याज 8.25% सालाना माना गया है।",
        )}
      />

      <Card>
        <Slider
          label={t("Money in your PF today", "आज आपके पीएफ में पैसा")}
          value={balance}
          min={0}
          max={3000000}
          step={10000}
          onChange={setBalance}
          display={rupees(balance)}
        />
        <Slider
          label={t("Your monthly basic salary", "आपकी मासिक बेसिक सैलरी")}
          value={monthlyBasic}
          min={5000}
          max={200000}
          step={1000}
          onChange={setMonthlyBasic}
          display={rupees(monthlyBasic)}
        />
        <Slider
          label={t("Your age today", "आपकी आज की उम्र")}
          value={age}
          min={18}
          max={57}
          step={1}
          onChange={setAge}
          display={`${age}`}
        />
        <Slider
          label={t("Salary increase every year", "हर साल सैलरी बढ़ोतरी")}
          value={growth}
          min={0}
          max={15}
          step={1}
          onChange={setGrowth}
          display={`${growth}%`}
        />
      </Card>

      <div className="mt-6 rounded-lg border-2 border-[#12436d] bg-[#eef5fb] p-6">
        <p className="text-lg font-bold">{t("At age 58 you will have about", "58 साल की उम्र पर आपके पास लगभग होगा")}</p>
        <p className="text-5xl font-extrabold text-[#12436d]">{rupees(final)}</p>
        <p className="mt-2 text-lg">
          {t("That is tax-free money you can take out in one go.", "यह कर-मुक्त पैसा है जिसे आप एक साथ निकाल सकते हैं।")}
        </p>
      </div>

      <h2 className="mt-8 mb-3 text-2xl font-extrabold">{t("Growing year by year", "साल दर साल बढ़ता हुआ")}</h2>
      <div className="space-y-2">
        {chartRows.map((r) => (
          <div key={r.age} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-lg font-bold">
              {t("Age", "उम्र")} {r.age}
            </span>
            <div className="h-8 flex-1 rounded-sm bg-[#eeefef]">
              <div
                className="flex h-8 items-center justify-end rounded-sm bg-[#12436d] pr-2 text-base font-bold text-white"
                style={{ width: `${Math.max(12, (r.bal / maxBal) * 100)}%` }}
              >
                {rupees(r.bal)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout tone="warning" title={t("A small habit that changes everything", "एक छोटी आदत जो सब बदल देती है")}>
        {t(
          "Every ₹1,000 you do not withdraw today becomes about ₹" +
            Math.round(1000 * Math.pow(1.0825, Math.max(1, 58 - age))).toLocaleString("en-IN") +
            " at 58. Withdraw only what you truly need.",
          "आज न निकाला गया हर ₹1,000, 58 की उम्र पर लगभग ₹" +
            Math.round(1000 * Math.pow(1.0825, Math.max(1, 58 - age))).toLocaleString("en-IN") +
            " बन जाता है। उतना ही निकालें जितना ज़रूरी है।",
        )}
      </Callout>
    </div>
  );
}
