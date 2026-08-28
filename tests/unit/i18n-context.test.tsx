import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../../src/i18n/context";

function Probe() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translated">{t("app_name")}</span>
      <button onClick={() => setLang("hi")}>go-hi</button>
      <button onClick={() => setLang("en")}>go-en</button>
    </div>
  );
}

describe("LanguageProvider / useLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English when nothing is stored", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("switching language updates state, localStorage, and <html lang>", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText("go-hi"));
    });

    expect(screen.getByTestId("lang").textContent).toBe("hi");
    expect(localStorage.getItem("pfxray_lang")).toBe("hi");
    expect(document.documentElement.lang).toBe("hi");

    act(() => {
      fireEvent.click(screen.getByText("go-en"));
    });
    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(localStorage.getItem("pfxray_lang")).toBe("en");
  });

  it("reads a previously stored language on mount", () => {
    localStorage.setItem("pfxray_lang", "hi");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang").textContent).toBe("hi");
  });

  it("ignores an invalid stored value and falls back to English", () => {
    localStorage.setItem("pfxray_lang", "fr");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("t() falls back to the key itself for an unknown key, never throws", () => {
    function BadKeyProbe() {
      const { t } = useLanguage();
      // Intentionally cast an unknown key to exercise the fallback path.
      return <span data-testid="fallback">{t("this_key_does_not_exist" as never)}</span>;
    }
    render(
      <LanguageProvider>
        <BadKeyProbe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("fallback").textContent).toBe("this_key_does_not_exist");
  });
});
