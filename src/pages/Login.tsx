import { useState } from "react";
import { useApp } from "../lib/store";
import { A, Breadcrumbs, Button, Callout, Field, PageTitle, inputClass } from "../components/ui";
import { DEMO } from "../lib/data";

export default function Login() {
  const { t, login, navigate, showToast } = useApp();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [uan, setUan] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const clean = uan.replace(/\s/g, "");

  const submit = () => {
    if (clean !== DEMO.uanPlain) {
      setError(t("That UAN is not in our demo records. Use 100200300400.", "यह यूएएन डेमो रिकॉर्ड में नहीं है। 100200300400 का उपयोग करें।"));
      return;
    }
    if (mode === "password" && pw !== DEMO.password) {
      setError(t("Wrong password. The demo password is epfo123.", "गलत पासवर्ड। डेमो पासवर्ड epfo123 है।"));
      return;
    }
    if (mode === "otp" && otp !== DEMO.otp) {
      setError(t("Wrong OTP. The demo OTP is 1234.", "गलत ओटीपी। डेमो ओटीपी 1234 है।"));
      return;
    }
    setError("");
    login();
    showToast(t("Signed in. Welcome back!", "साइन इन हो गया। स्वागत है!"));
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs items={[{ label: t("Home", "होम"), to: "/" }, { label: t("Sign in", "साइन इन") }]} />
      <PageTitle
        title={t("Sign in to see your own money", "अपना पैसा देखने के लिए साइन इन करें")}
        intro={t(
          "Your UAN is the 12-digit Universal Account Number printed on your salary slip. It stays the same even if you change jobs.",
          "यूएएन आपकी सैलरी स्लिप पर छपा 12 अंकों का नंबर है। नौकरी बदलने पर भी यह वही रहता है।",
        )}
      />

      <Callout tone="info" title={t("Demo account for testing", "टेस्ट के लिए डेमो खाता")}>
        <p>
          UAN <b>{DEMO.uan}</b> · {t("Password", "पासवर्ड")} <b>{DEMO.password}</b> · {t("OTP", "ओटीपी")}{" "}
          <b>{DEMO.otp}</b>
        </p>
        <button
          onClick={() => {
            setUan(DEMO.uanPlain);
            setPw(DEMO.password);
            setOtp(DEMO.otp);
            setOtpSent(true);
          }}
          className="mt-2 rounded-[3px] bg-[#12436d] px-3 py-2 text-base font-bold text-white"
        >
          {t("Fill demo details for me", "मेरे लिए डेमो जानकारी भरें")}
        </button>
      </Callout>

      <div className="mt-6 flex gap-2">
        {[
          { k: "password" as const, l: t("Use password", "पासवर्ड से") },
          { k: "otp" as const, l: t("Use mobile OTP", "मोबाइल ओटीपी से") },
        ].map((o) => (
          <button
            key={o.k}
            onClick={() => setMode(o.k)}
            className={`rounded-t-md border-2 border-b-0 px-4 py-2 text-lg font-bold ${
              mode === o.k ? "border-[#12436d] bg-[#12436d] text-white" : "border-[#b1b4b6] bg-white text-[#12436d]"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>

      <div className="space-y-5 rounded-b-md rounded-tr-md border-2 border-[#12436d] p-5">
        {error && (
          <Callout tone="danger" title={t("There is a problem", "एक समस्या है")}>
            {error}
          </Callout>
        )}
        <Field
          label={t("Your UAN (12 digits)", "आपका यूएएन (12 अंक)")}
          hint={t("Example: 100200300400", "उदाहरण: 100200300400")}
        >
          <input
            className={inputClass}
            inputMode="numeric"
            value={uan}
            onChange={(e) => setUan(e.target.value)}
            placeholder="100200300400"
          />
        </Field>

        {mode === "password" ? (
          <Field label={t("Password", "पासवर्ड")}>
            <input className={inputClass} type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </Field>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setOtpSent(true);
                  showToast(t("OTP sent to 98•••• ••21 (demo OTP is 1234)", "98•••• ••21 पर ओटीपी भेजा गया (डेमो ओटीपी 1234)"));
                }}
              >
                {t("Send OTP to my mobile", "मेरे मोबाइल पर ओटीपी भेजें")}
              </Button>
            ) : (
              <Field
                label={t("6-digit OTP sent to 98•••• ••21", "98•••• ••21 पर भेजा गया ओटीपी")}
                hint={t("For this demo, type 1234", "इस डेमो के लिए 1234 लिखें")}
              >
                <input className={inputClass} inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </Field>
            )}
          </div>
        )}

        <Button full onClick={submit}>
          {t("Sign in", "साइन इन करें")}
        </Button>

        <div className="flex flex-wrap gap-4 text-lg">
          <A to="/uan-help">{t("I forgot my password", "मैं पासवर्ड भूल गया")}</A>
          <A to="/uan-help">{t("I don't know my UAN", "मुझे यूएएन नहीं पता")}</A>
          <A to="/help">{t("Something is not working", "कुछ काम नहीं कर रहा")}</A>
        </div>
      </div>

      <Callout tone="warning" title={t("Stay safe", "सुरक्षित रहें")}>
        {t(
          "EPFO will never call, message or WhatsApp you asking for your password, OTP or bank PIN. If someone does, they are trying to cheat you.",
          "ईपीएफओ कभी भी कॉल, मैसेज या व्हाट्सएप पर आपका पासवर्ड, ओटीपी या बैंक पिन नहीं माँगेगा। अगर कोई माँगे तो वह धोखा दे रहा है।",
        )}
      </Callout>
    </div>
  );
}
