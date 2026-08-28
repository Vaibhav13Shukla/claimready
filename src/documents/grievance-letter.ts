export interface GrievanceLetterParams {
  beneficiaryName?: string;
  uan?: string;
  memberId?: string;
  employerName?: string;
  lastWorkingDay?: string;
  claimId?: string;
  dateStr?: string;
  language: "en" | "hi";
}

// Employer request: ask a previous employer to update Date of Exit / approve details,
// with EPFiGMS escalation if unresponsive.
export function generateGrievanceLetter(params: GrievanceLetterParams): {
  subject: string;
  body: string;
  printableText: string;
  whatsappText: string;
} {
  const name = params.beneficiaryName || "Demo Member (डेमो सदस्य)";
  const uan = params.uan || "100-DEMO-0000";
  const memberId = params.memberId || "XX/DEMO/0000000/000";
  const employer = params.employerName || "Previous Employer Pvt Ltd (Demo)";
  const lastDay = params.lastWorkingDay || "31 Mar 2025";
  const claimId = params.claimId || "DEMOCLAIM-000000";
  const date =
    params.dateStr ||
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (params.language === "hi") {
    const subject = `विषय: ईपीएफओ पोर्टल पर नौकरी छोड़ने की तिथि (Date of Exit) अपडेट करने का अनुरोध`;
    const body = `सेवा में,
मानव संसाधन / भविष्य निधि विभाग,
${employer}

महोदय/महोदया,

मैं ${name}, आपके संस्थान का पूर्व कर्मचारी, आपसे अनुरोध करता/करती हूँ कि ईपीएफओ एम्प्लॉयर पोर्टल पर मेरी नौकरी छोड़ने की तिथि (Date of Exit) दर्ज/अपडेट करें। इसके अभाव में मेरा भविष्य निधि दावा (Claim ID: ${claimId}) अस्वीकृत हो रहा है।

मेरा विवरण:
- UAN: ${uan}
- पिछला मेंबर आईडी: ${memberId}
- अंतिम कार्य दिवस: ${lastDay}

कृपया शीघ्र निकास तिथि अपडेट करें। यदि 15 दिनों में यह संभव न हो, तो मैं ईपीएफओ के प्रावधानों अनुसार स्वयं निकास चिह्नित करूँगा/करूँगी तथा आवश्यकता पर EPFiGMS में शिकायत दर्ज करूँगा/करूँगी।

संलग्न: त्यागपत्र/रिलीविंग लेटर की प्रति।

दिनांक: ${date}
भवदीय,
${name}
मो.: 98XXXXXXXX`;

    const whatsappText = `*ClaimReady — निकास तिथि अनुरोध*
UAN: ${uan} | Claim: ${claimId}
पूर्व नियोक्ता: ${employer}
कार्य: नियोक्ता से Date of Exit अपडेट कराएं; 15 दिनों में न हो तो स्वयं निकास चिह्नित करें + EPFiGMS।
(स्वतंत्र प्रोटोटाइप — सभी डेटा सिंथेटिक हैं)`;

    return { subject, body, printableText: `${subject}\n\n${body}`, whatsappText };
  }

  const subject = `Subject: Request to Update Date of Exit on the EPFO Portal`;
  const body = `To,
The HR / Provident Fund Department,
${employer}

Respected Sir/Madam,

I, ${name}, a former employee of your organisation, request you to update my Date of Exit on the EPFO employer portal. Without it, my provident fund claim (Claim ID: ${claimId}) is being rejected.

My details:
- UAN: ${uan}
- Previous Member ID: ${memberId}
- Last working day: ${lastDay}

Please update the Date of Exit at the earliest. If this is not done within 15 days, I will mark my exit myself as permitted by EPFO and, if needed, file an EPFiGMS grievance.

Enclosure: copy of resignation / relieving letter.

Date: ${date}

Yours faithfully,
${name}
Contact: 98XXXXXXXX`;

  const whatsappText = `*ClaimReady — Date of Exit Request*
UAN: ${uan} | Claim: ${claimId}
Previous employer: ${employer}
Action: Get employer to update Date of Exit; if not in 15 days, self-mark exit + EPFiGMS.
(Independent Hackathon Prototype — Synthetic Data Only)`;

  return { subject, body, printableText: `${subject}\n\n${body}`, whatsappText };
}
