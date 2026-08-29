import type { ReactNode } from "react";
import { useApp } from "../lib/store";
import { Button, Callout, PageTitle } from "./ui";
import { DEMO } from "../lib/data";

export default function RequireLogin({ children }: { children: ReactNode }) {
  const { loggedIn, navigate, t } = useApp();
  if (loggedIn) return <>{children}</>;
  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle
        title={t("Please sign in first", "कृपया पहले साइन इन करें")}
        intro={t(
          "This page shows your personal money, so we need to know it is you.",
          "यह पेज आपका निजी पैसा दिखाता है, इसलिए हमें पहचान की ज़रूरत है।",
        )}
      />
      <Callout tone="info" title={t("Demo account", "डेमो खाता")}>
        UAN <b>{DEMO.uan}</b> · {t("Password", "पासवर्ड")} <b>{DEMO.password}</b>
      </Callout>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => navigate("/login")}>{t("Sign in with UAN", "यूएएन से साइन इन करें")}</Button>
        <Button variant="plain" onClick={() => navigate("/uan-help")}>
          {t("I don't know my UAN", "मुझे यूएएन नहीं पता")}
        </Button>
      </div>
    </div>
  );
}
