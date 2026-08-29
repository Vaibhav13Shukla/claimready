import { useState } from "react";
import { useApp } from "../lib/store";

export default function AskWidget() {
  const { t, navigate, path } = useApp();
  const [open, setOpen] = useState(false);
  if (path === "/help") return null;

  const quick = [
    { l: t("Where is my money?", "मेरा पैसा कहाँ है?"), to: "/track" },
    { l: t("Can I withdraw?", "क्या मैं निकाल सकता हूँ?"), to: "/withdraw" },
    { l: t("My pension amount", "मेरी पेंशन राशि"), to: "/pension" },
    { l: t("Something is wrong", "कुछ गलत है"), to: "/grievance" },
  ];

  return (
    <div className="no-print fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[19rem] rounded-lg border-2 border-[#12436d] bg-white p-4 shadow-2xl">
          <p className="text-lg font-extrabold">{t("Need help right now?", "अभी मदद चाहिए?")}</p>
          <p className="mt-1 text-base text-[#505a5f]">
            {t("Pick a question or type your own.", "एक सवाल चुनें या अपना लिखें।")}
          </p>
          <ul className="mt-3 space-y-2">
            {quick.map((q) => (
              <li key={q.to}>
                <button
                  onClick={() => {
                    navigate(q.to);
                    setOpen(false);
                  }}
                  className="w-full rounded-[3px] bg-[#eef2f6] px-3 py-2 text-left text-base font-bold text-[#12436d] hover:bg-[#dde5eb]"
                >
                  {q.l}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              navigate("/help");
              setOpen(false);
            }}
            className="mt-3 w-full rounded-[3px] bg-[#00703c] px-3 py-2 text-base font-bold text-white"
          >
            {t("Ask EPFO a question", "ईपीएफओ से सवाल पूछें")}
          </button>
          <p className="mt-3 text-base">
            {t("Or call free", "या मुफ़्त कॉल करें")}: <b>14470</b>
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-[#12436d] px-5 py-4 text-lg font-bold text-white shadow-xl hover:bg-[#0b2f4d]"
      >
        {open ? "✕" : "💬"} {open ? t("Close", "बंद करें") : t("Help", "मदद")}
      </button>
    </div>
  );
}
