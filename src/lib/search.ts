export type Service = {
  to: string;
  en: string;
  hi: string;
  descEn: string;
  descHi: string;
  group: "money" | "job" | "details" | "help" | "employer";
  keywords: string;
  needsLogin?: boolean;
  minutes?: string;
};

export const services: Service[] = [
  {
    to: "/balance",
    en: "Check my PF balance",
    hi: "मेरा पीएफ बैलेंस देखें",
    descEn: "See how much money is saved in your PF and pension account today.",
    descHi: "देखें कि आपके पीएफ और पेंशन खाते में आज कितना पैसा जमा है।",
    group: "money",
    keywords: "balance passbook money amount kitna paisa statement",
    needsLogin: true,
    minutes: "30 seconds",
  },
  {
    to: "/passbook",
    en: "See my passbook",
    hi: "मेरी पासबुक देखें",
    descEn: "Month-by-month record of what you and your employer paid in.",
    descHi: "महीने-दर-महीने आपके और नियोक्ता के जमा का ब्यौरा।",
    group: "money",
    keywords: "passbook statement download history contribution",
    needsLogin: true,
    minutes: "1 minute",
  },
  {
    to: "/withdraw",
    en: "Withdraw money from my PF",
    hi: "मेरे पीएफ से पैसा निकालें",
    descEn: "For a house, wedding, illness, education or after leaving a job.",
    descHi: "घर, शादी, बीमारी, पढ़ाई या नौकरी छोड़ने के बाद।",
    group: "money",
    keywords: "withdraw claim advance form 31 19 10c paisa nikalna money emergency",
    needsLogin: true,
    minutes: "5 minutes",
  },
  {
    to: "/track",
    en: "Track my claim",
    hi: "मेरा क्लेम ट्रैक करें",
    descEn: "See where your money has reached and when it will arrive.",
    descHi: "देखें आपका पैसा कहाँ पहुँचा और कब आएगा।",
    group: "money",
    keywords: "track status claim pending rejected money kab aayega",
    minutes: "30 seconds",
  },
  {
    to: "/pension",
    en: "Estimate my monthly pension",
    hi: "मेरी मासिक पेंशन का अनुमान",
    descEn: "Find out how much pension you will get every month after 58.",
    descHi: "जानें 58 साल के बाद हर महीने कितनी पेंशन मिलेगी।",
    group: "money",
    keywords: "pension eps 95 58 retirement monthly calculate",
    minutes: "1 minute",
  },
  {
    to: "/transfer",
    en: "Move my PF to my new job",
    hi: "नई नौकरी में पीएफ ट्रांसफर करें",
    descEn: "Bring old PF accounts together into one place.",
    descHi: "पुराने पीएफ खातों को एक जगह लाएँ।",
    group: "job",
    keywords: "transfer form 13 job change merge old account new employer",
    needsLogin: true,
    minutes: "3 minutes",
  },
  {
    to: "/kyc",
    en: "Update my details (KYC)",
    hi: "मेरी जानकारी अपडेट करें (केवाईसी)",
    descEn: "Aadhaar, PAN, bank account, mobile number, name spelling.",
    descHi: "आधार, पैन, बैंक खाता, मोबाइल नंबर, नाम की स्पेलिंग।",
    group: "details",
    keywords: "kyc aadhaar pan bank ifsc mobile correction name dob update",
    needsLogin: true,
    minutes: "4 minutes",
  },
  {
    to: "/nominee",
    en: "Add or change my nominee",
    hi: "नॉमिनी जोड़ें या बदलें",
    descEn: "Decide who gets your money if something happens to you.",
    descHi: "तय करें कि आपके बाद आपका पैसा किसे मिले।",
    group: "details",
    keywords: "nominee nomination family wife husband children death",
    needsLogin: true,
    minutes: "3 minutes",
  },
  {
    to: "/grievance",
    en: "Raise a complaint",
    hi: "शिकायत दर्ज करें",
    descEn: "Money not received, employer not paying, wrong details.",
    descHi: "पैसा नहीं मिला, नियोक्ता जमा नहीं कर रहा, गलत जानकारी।",
    group: "help",
    keywords: "grievance complaint problem epfigms not received delay employer",
    minutes: "4 minutes",
  },
  {
    to: "/uan-help",
    en: "I don't know my UAN / password",
    hi: "मुझे यूएएन / पासवर्ड नहीं पता",
    descEn: "Get your UAN using Aadhaar or your mobile number.",
    descHi: "आधार या मोबाइल नंबर से अपना यूएएन पाएँ।",
    group: "help",
    keywords: "uan forgot password activate login problem number",
    minutes: "2 minutes",
  },
  {
    to: "/offices",
    en: "Find my EPFO office",
    hi: "मेरा ईपीएफओ ऑफिस खोजें",
    descEn: "Address, phone number and opening hours near you.",
    descHi: "आपके पास का पता, फोन नंबर और समय।",
    group: "help",
    keywords: "office address near me pincode visit phone contact",
    minutes: "30 seconds",
  },
  {
    to: "/calculators",
    en: "Calculators",
    hi: "कैलकुलेटर",
    descEn: "See how big your PF will grow, and plan your retirement.",
    descHi: "देखें आपका पीएफ कितना बढ़ेगा और रिटायरमेंट की योजना बनाएँ।",
    group: "money",
    keywords: "calculator interest growth retirement corpus projection",
    minutes: "2 minutes",
  },
  {
    to: "/employers",
    en: "For employers",
    hi: "नियोक्ताओं के लिए",
    descEn: "Register your company, pay monthly dues, file ECR.",
    descHi: "कंपनी रजिस्टर करें, मासिक भुगतान करें, ECR भरें।",
    group: "employer",
    keywords: "employer company ecr challan registration establishment",
    minutes: "10 minutes",
  },
  {
    to: "/help",
    en: "Ask a question",
    hi: "सवाल पूछें",
    descEn: "Plain-language answers to the questions people ask most.",
    descHi: "आम भाषा में सबसे ज़्यादा पूछे गए सवालों के जवाब।",
    group: "help",
    keywords: "help faq question chat assistant doubt",
    minutes: "1 minute",
  },
  {
    to: "/about",
    en: "About EPFO",
    hi: "ईपीएफओ के बारे में",
    descEn: "Our vision, mission, objectives and the schemes we run.",
    descHi: "हमारा विज़न, मिशन, उद्देश्य और योजनाएँ।",
    group: "help",
    keywords: "about vision mission objective scheme act 1952 eps edli history rti",
    minutes: "3 minutes",
  },
  {
    to: "/death-claim",
    en: "Claim after a family member dies",
    hi: "परिवार के सदस्य की मृत्यु के बाद दावा",
    descEn: "Step-by-step help for families claiming PF, pension and insurance.",
    descHi: "पीएफ, पेंशन और बीमा का दावा करने में परिवार की मदद।",
    group: "help",
    keywords: "death claim edli widow pension family insurance 7 lakh",
    minutes: "6 minutes",
  },
];

export function searchServices(q: string, lang: "en" | "hi") {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return services
    .map((s) => {
      // Weight matches by where they land: a service's own name and keywords
      // are far stronger signals than an incidental mention in a description.
      const name = `${s.en} ${s.hi}`.toLowerCase();
      const keys = s.keywords.toLowerCase();
      const desc = `${s.descEn} ${s.descHi}`.toLowerCase();
      let score = 0;
      if (name.includes(term)) score += 8;
      if (keys.includes(term)) score += 6;
      if (desc.includes(term)) score += 3;
      term.split(/\s+/).forEach((w) => {
        if (w.length <= 2) return;
        if (name.includes(w)) score += 3;
        if (keys.includes(w)) score += 2;
        if (desc.includes(w)) score += 1;
      });
      return { s, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => ({
      title: lang === "hi" ? r.s.hi : r.s.en,
      desc: lang === "hi" ? r.s.descHi : r.s.descEn,
      to: r.s.to,
    }));
}
