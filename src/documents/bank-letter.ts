export interface BankLetterParams {
  beneficiaryName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  schemeName?: string;
  uan?: string;
  dateStr?: string;
  language: "en" | "hi";
}

export function generateBankLetter(params: BankLetterParams): {
  subject: string;
  body: string;
  printableText: string;
  whatsappText: string;
} {
  const name = params.beneficiaryName || "Demo Member (डेमो सदस्य)";
  const account = params.accountNumber || "XXXX-DEMO-5678";
  const bank = params.bankName || "State Bank of India (Demo Branch)";
  const branch = params.branchName || "Main Branch";
  const uan = params.uan || "100-DEMO-0000";
  const date =
    params.dateStr ||
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (params.language === "hi") {
    const subject = `विषय: ईपीएफओ दावे हेतु बैंक खाता सक्रियण / केवाईसी सत्यापन एवं UAN सीडिंग अनुरोध`;
    const body = `सेवा में,
शाखा प्रबंधक महोदय,
${bank}, ${branch}

महोदय/महोदया,

सविनय निवेदन है कि मैं ${name}, खाता संख्या ${account} का खाताधारक हूँ। मेरा ईपीएफओ भविष्य निधि दावा इस खाते में केवाईसी सत्यापन न होने / खाता निष्क्रिय होने / IFSC बेमेल के कारण अवरुद्ध है।

अतः आपसे विनम्र निवेदन है कि:
1. कृपया मेरे उक्त बैंक खाते को पूर्णतः सक्रिय (Active) करें।
2. खाते की केवाईसी अद्यतन करें और सुनिश्चित करें कि खाताधारक का नाम मेरे आधार/UAN नाम से मेल खाता है।
3. सही एवं वर्तमान IFSC कोड की पुष्टि करें।

मेरा UAN: ${uan}

संलग्न: आधार, पैन, बैंक पासबुक, पहचान/पता प्रमाण।

दिनांक: ${date}
भवदीय,
${name}
मो.: 98XXXXXXXX`;

    const whatsappText = `*ClaimReady — बैंक केवाईसी सुधार अनुरोध*
खाता: ${account}
बैंक: ${bank}
UAN: ${uan}
कार्य: शाखा में जाकर खाता सक्रिय कराएं, केवाईसी अपडेट कराएं, फिर UAN पोर्टल पर बैंक केवाईसी पुनः जोड़ें।
(स्वतंत्र प्रोटोटाइप — सभी डेटा सिंथेटिक हैं)`;

    return { subject, body, printableText: `${subject}\n\n${body}`, whatsappText };
  }

  const subject = `Subject: Request for Bank Account Activation / KYC Verification & UAN Seeding for EPFO Claim`;
  const body = `To,
The Branch Manager,
${bank}, ${branch}

Respected Sir/Madam,

I am ${name}, holder of account number ${account}. My EPFO provident fund claim is blocked because this account is not KYC-verified against my UAN / is inactive / has an IFSC mismatch.

I kindly request you to:
1. Re-activate my account and complete any pending KYC.
2. Ensure the account-holder name matches my Aadhaar / UAN name exactly.
3. Confirm the correct, current IFSC code for this branch.

My UAN: ${uan}

Enclosures: Aadhaar, PAN, Bank Passbook, ID/Address proof.

Date: ${date}

Yours faithfully,
${name}
Contact: 98XXXXXXXX`;

  const whatsappText = `*ClaimReady — Bank KYC Correction Request*
Account: ${account}
Bank: ${bank}
UAN: ${uan}
Action: Visit branch to activate the account + update KYC, then re-add bank KYC on the UAN portal.
(Independent Hackathon Prototype — Synthetic Data Only)`;

  return { subject, body, printableText: `${subject}\n\n${body}`, whatsappText };
}
