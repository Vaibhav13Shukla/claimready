"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../i18n/context";

type Msg = { role: "user" | "assistant"; text: string };

/* eslint-disable @typescript-eslint/no-explicit-any */

export function AssistantWidget() {
  const { lang, setLang } = useLanguage();
  const hi = lang === "hi";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speakOn, setSpeakOn] = useState(true);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speakOnRef = useRef(speakOn);
  speakOnRef.current = speakOn;

  const sttSupported =
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const speak = useCallback(
    (text: string) => {
      if (!speakOnRef.current || typeof window === "undefined" || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = hi ? "hi-IN" : "en-IN";
        window.speechSynthesis.speak(u);
      } catch {
        /* ignore */
      }
    },
    [hi],
  );

  const send = useCallback(
    async (message: string) => {
      const text = message.trim();
      if (!text || thinking) return;
      setInput("");
      setMsgs((m) => [...m, { role: "user", text }]);
      setThinking(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, lang }),
        });
        const data = await res.json();
        const reply: string = data?.reply || (hi ? "क्षमा करें, फिर से कहें।" : "Sorry, please try again.");
        setMsgs((m) => [...m, { role: "assistant", text: reply }]);
        speak(reply);
        const nav = data?.nav;
        if (nav?.setLang === "hi" || nav?.setLang === "en") setLang(nav.setLang);
        if (nav?.href) {
          setTimeout(() => {
            router.push(nav.href);
            setOpen(false);
          }, 650);
        }
      } catch {
        setMsgs((m) => [
          ...m,
          { role: "assistant", text: hi ? "कनेक्शन समस्या। पुनः प्रयास करें।" : "Connection issue. Please retry." },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [lang, hi, thinking, router, setLang, speak],
  );

  const toggleMic = useCallback(() => {
    if (!sttSupported) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = hi ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      if (transcript) send(transcript);
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }, [sttSupported, listening, hi, send]);

  const suggestions = hi
    ? ["मेरा दावा अस्वीकृत हो गया", "मेरा पीएफ कहाँ है?", "मेरा नाम गलत है"]
    : ["My claim was rejected", "Where is my PF?", "My name is wrong"];

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={hi ? "पीएफ एक्स-रे सहायक खोलें" : "Open PF X-Ray assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-[9999px] bg-[#5196fe] text-white font-semibold text-sm shadow-lg shadow-[#5196fe]/30 hover:bg-[#3f75c6] transition-colors cursor-pointer"
      >
        <span aria-hidden="true">🎙️</span>
        <span className="hidden sm:inline">{hi ? "पूछें" : "Ask"}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={hi ? "पीएफ एक्स-रे सहायक" : "PF X-Ray assistant"}
          className="fixed bottom-20 right-5 z-[60] w-[min(92vw,380px)] rounded-[20px] border border-[#e1dfd8] bg-white shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "min(70vh, 560px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#5196fe] text-white">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🔎</span>
              <span className="font-semibold text-sm">{hi ? "पीएफ एक्स-रे सहायक" : "Ask PF X-Ray"}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeakOn((s) => !s)}
                aria-label={speakOn ? (hi ? "आवाज़ बंद करें" : "Mute voice") : hi ? "आवाज़ चालू करें" : "Unmute voice"}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 cursor-pointer"
              >
                <span aria-hidden="true">{speakOn ? "🔊" : "🔈"}</span>
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label={hi ? "बंद करें" : "Close"}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 cursor-pointer"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#f2f1ec]">
            {msgs.length === 0 && (
              <div className="text-center text-[12px] text-[#6e6e6e] px-3 py-4">
                {hi
                  ? "अपनी पीएफ समस्या बोलें या लिखें — मैं समझाऊँ और सही जगह ले जाऊँ।"
                  : "Speak or type your PF problem — I'll explain and take you to the right place."}
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-[14px] text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-[#5196fe] text-white"
                    : "mr-auto bg-white border border-[#e1dfd8] text-[#1b1d20]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="mr-auto bg-white border border-[#e1dfd8] text-[#6e6e6e] px-3 py-2 rounded-[14px] text-[13px]">
                {hi ? "सोच रहा/रही हूँ…" : "Thinking…"}
              </div>
            )}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1 rounded-[9999px] bg-white border border-[#e1dfd8] text-[#3f75c6] hover:border-[#5196fe] cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-2.5 border-t border-[#e1dfd8] bg-white"
          >
            {sttSupported && (
              <button
                type="button"
                onClick={toggleMic}
                aria-label={listening ? (hi ? "सुनना रोकें" : "Stop listening") : hi ? "बोलें" : "Speak"}
                aria-pressed={listening}
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                  listening ? "bg-[#d21f3c] text-white pulse-dot" : "bg-[#f2f1ec] text-[#1b1d20] hover:bg-[#e8e6df]"
                }`}
              >
                <span aria-hidden="true">🎙️</span>
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                listening
                  ? hi ? "सुन रहा/रही हूँ…" : "Listening…"
                  : hi ? "अपनी समस्या लिखें…" : "Type your question…"
              }
              aria-label={hi ? "सहायक को संदेश" : "Message the assistant"}
              className="flex-1 min-w-0 px-3 py-2 text-[13px] rounded-[12px] border border-[#e1dfd8] focus:outline-none focus:border-[#5196fe]"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              aria-label={hi ? "भेजें" : "Send"}
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#5196fe] text-white disabled:opacity-40 cursor-pointer"
            >
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="text-[10px] text-[#797876] text-center pb-2 px-3 bg-white">
            {hi
              ? "प्रोटोटाइप · सिंथेटिक डेटा · अंतिम कार्रवाई आधिकारिक ईपीएफओ पर सत्यापित करें।"
              : "Prototype · synthetic data · verify final actions on the official EPFO portal."}
          </p>
        </div>
      )}
    </>
  );
}
