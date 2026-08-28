import type { DiagnosisResult } from "./taxonomy/taxonomy.schema";
import type { RemedyType } from "./taxonomy/taxonomy.schema";

interface RemedyStep {
  order: number;
  action: string;
  action_hi: string;
  details: string;
  details_hi: string;
  estimated_hours: number;
}

interface RemedyOutput {
  type: RemedyType;
  title_en: string;
  title_hi: string;
  summary_en: string;
  summary_hi: string;
  steps: RemedyStep[];
  estimated_timeline_days: string;
  required_documents: string[];
  required_documents_hi: string[];
  escalation_contact: string;
  escalation_contact_hi: string;
}

const remedyTemplates: Record<RemedyType, RemedyOutput> = {
  member_correction: {
    type: "member_correction",
    title_en: "Correct Your Details on the EPFO Unified Member Portal",
    title_hi: "ईपीएफओ यूनिफाइड मेंबर पोर्टल पर अपना विवरण ठीक करें",
    summary_en:
      "Your claim will be (or was) rejected because your name or date of birth does not match your Aadhaar. You can raise an online correction (Joint Declaration) yourself; your employer and EPFO then approve it, after which you re-file the claim.",
    summary_hi:
      "आपका दावा इसलिए अस्वीकृत होगा (या हुआ) क्योंकि आपका नाम या जन्म तिथि आधार से मेल नहीं खाती। आप स्वयं ऑनलाइन सुधार (जॉइंट डिक्लेरेशन) कर सकते हैं; फिर नियोक्ता और ईपीएफओ इसे स्वीकृत करते हैं, जिसके बाद आप पुनः दावा करें।",
    steps: [
      {
        order: 1,
        action: "Log in to the EPFO member portal with UAN + password",
        action_hi: "यूएएन + पासवर्ड से ईपीएफओ मेंबर पोर्टल में लॉगिन करें",
        details:
          "Go to the Unified Member Portal (member.epfindia.gov.in), log in with your UAN and password, and verify the OTP sent to your Aadhaar-linked mobile.",
        details_hi:
          "यूनिफाइड मेंबर पोर्टल (member.epfindia.gov.in) पर जाएं, अपने यूएएन और पासवर्ड से लॉगिन करें, और आधार-लिंक्ड मोबाइल पर भेजे गए ओटीपी की पुष्टि करें।",
        estimated_hours: 0.25,
      },
      {
        order: 2,
        action: "Open Manage → Modify Basic Details / Joint Declaration",
        action_hi: "Manage → Modify Basic Details / जॉइंट डिक्लेरेशन खोलें",
        details:
          "Enter your name / date of birth EXACTLY as printed on your Aadhaar. Even a single letter or an initial must match. The system checks it against UIDAI.",
        details_hi:
          "अपना नाम / जन्म तिथि ठीक वैसे ही दर्ज करें जैसे आधार पर छपा है। एक अक्षर या initial भी मेल खाना चाहिए। सिस्टम इसे UIDAI से जांचता है।",
        estimated_hours: 0.25,
      },
      {
        order: 3,
        action: "Submit and note the request/reference number",
        action_hi: "सबमिट करें और अनुरोध/संदर्भ संख्या नोट करें",
        details:
          "Submit the correction. Save the reference number. The request now goes to your current employer for approval.",
        details_hi:
          "सुधार सबमिट करें। संदर्भ संख्या सुरक्षित रखें। अनुरोध अब आपके वर्तमान नियोक्ता की स्वीकृति के लिए जाता है।",
        estimated_hours: 0.25,
      },
      {
        order: 4,
        action: "Follow up with employer HR, then EPFO approval",
        action_hi: "नियोक्ता HR से अनुसरण करें, फिर ईपीएफओ स्वीकृति",
        details:
          "Ask your employer HR to approve the request on their EPFO login. After employer approval it goes to EPFO. Most corrections reflect in 7-20 days.",
        details_hi:
          "अपने नियोक्ता HR से अनुरोध को उनके ईपीएफओ लॉगिन पर स्वीकृत करने को कहें। नियोक्ता स्वीकृति के बाद यह ईपीएफओ जाता है। अधिकांश सुधार 7-20 दिनों में दिखते हैं।",
        estimated_hours: 0.5,
      },
      {
        order: 5,
        action: "Once corrected, re-file your claim",
        action_hi: "सुधार होने के बाद, अपना दावा पुनः फाइल करें",
        details:
          "When your basic details show the corrected value on the portal, submit the claim again. It should now pass the demographic check.",
        details_hi:
          "जब पोर्टल पर आपके बेसिक विवरण सही मान दिखाएं, तो दावा फिर से सबमिट करें। अब यह डेमोग्राफिक जांच पास कर लेना चाहिए।",
        estimated_hours: 0.25,
      },
    ],
    estimated_timeline_days: "7-20",
    required_documents: [
      "Aadhaar (name/DOB as the correct reference)",
      "PAN card",
      "UAN and registered mobile (Aadhaar-linked)",
      "Any proof of DOB if changing DOB (birth certificate / passport / SSC)",
    ],
    required_documents_hi: [
      "आधार (सही नाम/जन्म तिथि के संदर्भ हेतु)",
      "पैन कार्ड",
      "यूएएन और पंजीकृत मोबाइल (आधार-लिंक्ड)",
      "जन्म तिथि बदलने पर जन्म तिथि का प्रमाण (जन्म प्रमाण पत्र / पासपोर्ट / एसएससी)",
    ],
    escalation_contact:
      "Employer HR (approval) → EPFO Field Office → EPFiGMS grievance (epfigms.gov.in) → EPFO helpline 1800-118-005",
    escalation_contact_hi:
      "नियोक्ता HR (स्वीकृति) → ईपीएफओ फील्ड ऑफिस → EPFiGMS शिकायत (epfigms.gov.in) → ईपीएफओ हेल्पलाइन 1800-118-005",
  },
  bank_fix: {
    type: "bank_fix",
    title_en: "Fix and Re-verify Your Bank KYC",
    title_hi: "अपनी बैंक केवाईसी ठीक करें और पुनः सत्यापित करें",
    summary_en:
      "Your claim bounced because your bank account is not correctly KYC-verified against your UAN, is inactive/dormant, or has a wrong IFSC. Get the bank to fix it, then re-seed and re-verify the account on your UAN.",
    summary_hi:
      "आपका दावा इसलिए वापस आया क्योंकि आपका बैंक खाता यूएएन के साथ सही ढंग से केवाईसी-सत्यापित नहीं है, निष्क्रिय है, या IFSC गलत है। बैंक से इसे ठीक कराएं, फिर खाते को यूएएन पर पुनः सीड और सत्यापित करें।",
    steps: [
      {
        order: 1,
        action: "Confirm the exact bank problem",
        action_hi: "बैंक की सटीक समस्या की पुष्टि करें",
        details:
          "Check: is the account active? Is the IFSC current (branches change IFSC after mergers)? Does the account-holder name match your UAN name exactly?",
        details_hi:
          "जांचें: क्या खाता सक्रिय है? क्या IFSC वर्तमान है (विलय के बाद शाखाओं का IFSC बदलता है)? क्या खाताधारक का नाम आपके यूएएन नाम से ठीक मेल खाता है?",
        estimated_hours: 0.5,
      },
      {
        order: 2,
        action: "Visit the bank branch and re-activate / update KYC",
        action_hi: "बैंक शाखा जाएं और खाता पुनः सक्रिय करें / केवाईसी अपडेट करें",
        details:
          "If dormant, reactivate the account with ID + address proof and a small deposit. Correct the IFSC if changed. Ensure the name matches your UAN/Aadhaar.",
        details_hi:
          "यदि निष्क्रिय है, तो पहचान + पता प्रमाण और एक छोटी जमा के साथ खाता पुनः सक्रिय करें। बदला हुआ IFSC ठीक करें। सुनिश्चित करें कि नाम यूएएन/आधार से मेल खाता है।",
        estimated_hours: 1.5,
      },
      {
        order: 3,
        action: "Re-add the bank account KYC on the UAN portal",
        action_hi: "यूएएन पोर्टल पर बैंक खाता केवाईसी पुनः जोड़ें",
        details:
          "On the member portal, Manage → KYC, add the correct bank account number + IFSC. It must be digitally approved by your employer.",
        details_hi:
          "मेंबर पोर्टल पर, Manage → KYC में सही बैंक खाता संख्या + IFSC जोड़ें। इसे आपके नियोक्ता द्वारा डिजिटल रूप से स्वीकृत किया जाना चाहिए।",
        estimated_hours: 0.5,
      },
      {
        order: 4,
        action: "Wait for KYC 'Verified', then re-file the claim",
        action_hi: "केवाईसी 'Verified' होने तक प्रतीक्षा करें, फिर दावा पुनः फाइल करें",
        details:
          "When the bank KYC shows 'Verified' (digitally approved) on the portal, submit the claim again with the corrected account.",
        details_hi:
          "जब पोर्टल पर बैंक केवाईसी 'Verified' (डिजिटल रूप से स्वीकृत) दिखे, तो सही खाते के साथ दावा फिर से सबमिट करें।",
        estimated_hours: 0.25,
      },
    ],
    estimated_timeline_days: "3-10",
    required_documents: [
      "Bank passbook / cancelled cheque (correct IFSC)",
      "Aadhaar and PAN",
      "ID + address proof (for dormant account reactivation)",
      "UAN and registered mobile",
    ],
    required_documents_hi: [
      "बैंक पासबुक / रद्द चेक (सही IFSC)",
      "आधार और पैन",
      "पहचान + पता प्रमाण (निष्क्रिय खाता पुनः सक्रियण हेतु)",
      "यूएएन और पंजीकृत मोबाइल",
    ],
    escalation_contact:
      "Bank Branch Manager → District Lead Bank Officer → EPFO Field Office → EPFiGMS grievance",
    escalation_contact_hi:
      "बैंक शाखा प्रबंधक → जिला लीड बैंक अधिकारी → ईपीएफओ फील्ड ऑफिस → EPFiGMS शिकायत",
  },
  employer_request: {
    type: "employer_request",
    title_en: "Get Your Previous Employer to Update Date of Exit",
    title_hi: "अपने पिछले नियोक्ता से नौकरी छोड़ने की तिथि अपडेट कराएं",
    summary_en:
      "EPFO rejected your final settlement because your previous employer has not marked your Date of Exit (last working day). Request them to update it on their EPFO employer login; if unresponsive, mark exit yourself after 2 months and escalate via EPFiGMS.",
    summary_hi:
      "ईपीएफओ ने आपका अंतिम भुगतान इसलिए अस्वीकृत किया क्योंकि आपके पिछले नियोक्ता ने आपकी नौकरी छोड़ने की तिथि दर्ज नहीं की है। उनसे इसे उनके ईपीएफओ एम्प्लॉयर लॉगिन पर अपडेट करने का अनुरोध करें; प्रतिक्रिया न मिलने पर 2 महीने बाद स्वयं निकास चिह्नित करें और EPFiGMS से escalate करें।",
    steps: [
      {
        order: 1,
        action: "Send the employer a written Date-of-Exit request",
        action_hi: "नियोक्ता को लिखित निकास-तिथि अनुरोध भेजें",
        details:
          "Email your previous employer's HR/PF team with your name, UAN, previous Member ID, and exact last working day, asking them to update Date of Exit in the EPFO portal.",
        details_hi:
          "अपने पिछले नियोक्ता की HR/PF टीम को अपना नाम, यूएएन, पिछला मेंबर आईडी, और सटीक अंतिम कार्य दिवस के साथ ईमेल करें, उनसे ईपीएफओ पोर्टल में निकास तिथि अपडेट करने को कहें।",
        estimated_hours: 0.5,
      },
      {
        order: 2,
        action: "If no response in ~15 days, use member self-exit",
        action_hi: "यदि ~15 दिनों में कोई प्रतिक्रिया नहीं, तो सदस्य स्व-निकास का उपयोग करें",
        details:
          "EPFO allows members to mark their own Date of Exit on the portal (Manage → Mark Exit) after 2 months from the last contribution, if the employer has not.",
        details_hi:
          "ईपीएफओ सदस्यों को अंतिम अंशदान से 2 महीने बाद पोर्टल पर स्वयं निकास तिथि चिह्नित करने की अनुमति देता है (Manage → Mark Exit), यदि नियोक्ता ने नहीं किया है।",
        estimated_hours: 0.5,
      },
      {
        order: 3,
        action: "Escalate via EPFiGMS with proof",
        action_hi: "प्रमाण के साथ EPFiGMS से escalate करें",
        details:
          "If still blocked, file an EPFiGMS grievance (epfigms.gov.in) attaching your resignation/relieving letter and the employer email. Reference your claim ID.",
        details_hi:
          "यदि अब भी अवरुद्ध है, तो अपना त्यागपत्र/रिलीविंग लेटर और नियोक्ता ईमेल संलग्न कर EPFiGMS शिकायत (epfigms.gov.in) दर्ज करें। अपना claim ID संदर्भित करें।",
        estimated_hours: 0.5,
      },
      {
        order: 4,
        action: "Once Date of Exit shows, re-file the claim",
        action_hi: "निकास तिथि दिखने के बाद, दावा पुनः फाइल करें",
        details:
          "When the Date of Exit is visible in your service history, submit the final settlement claim again.",
        details_hi:
          "जब आपकी सेवा इतिहास में निकास तिथि दिखे, तो अंतिम भुगतान दावा फिर से सबमिट करें।",
        estimated_hours: 0.25,
      },
    ],
    estimated_timeline_days: "7-30",
    required_documents: [
      "Resignation / relieving letter (proof of last working day)",
      "UAN and previous Member ID",
      "Employer HR contact / email",
      "Claim reference ID (if already rejected)",
    ],
    required_documents_hi: [
      "त्यागपत्र / रिलीविंग लेटर (अंतिम कार्य दिवस का प्रमाण)",
      "यूएएन और पिछला मेंबर आईडी",
      "नियोक्ता HR संपर्क / ईमेल",
      "दावा संदर्भ आईडी (यदि पहले अस्वीकृत हुआ हो)",
    ],
    escalation_contact:
      "Previous Employer HR → EPFiGMS grievance (epfigms.gov.in) → Regional PF Commissioner (RPFC)",
    escalation_contact_hi:
      "पिछला नियोक्ता HR → EPFiGMS शिकायत (epfigms.gov.in) → क्षेत्रीय भविष्य निधि आयुक्त (RPFC)",
  },
  uan_transfer_merge: {
    type: "uan_transfer_merge",
    title_en: "Merge Your Duplicate UAN via Online Transfer Claim",
    title_hi: "ऑनलाइन ट्रांसफर क्लेम से अपना डुप्लीकेट यूएएन मर्ज करें",
    summary_en:
      "Your claim is blocked because you have more than one UAN — usually from a previous employer issuing a fresh one instead of reusing your existing UAN. You raise the transfer/merge request yourself; EPFO verifies both service histories and marks the older UAN inoperative, after which you re-file the claim on your active UAN.",
    summary_hi:
      "आपका दावा इसलिए रुका है क्योंकि आपके पास एक से अधिक यूएएन हैं — आमतौर पर किसी पिछले नियोक्ता द्वारा मौजूदा यूएएन के बजाय नया यूएएन जारी करने से। आप स्वयं ट्रांसफर/मर्ज अनुरोध दर्ज करते हैं; ईपीएफओ दोनों सेवा इतिहास सत्यापित कर पुराने यूएएन को निष्क्रिय करता है, फिर आप सक्रिय यूएएन पर दावा पुनः फाइल करें।",
    steps: [
      {
        order: 1,
        action: "Confirm you have more than one UAN",
        action_hi: "पुष्टि करें कि आपके पास एक से अधिक यूएएन हैं",
        details:
          "On the member portal, Manage → View → check 'Member ID' history against your Aadhaar-linked mobile/PAN. If a second UAN exists, note both UAN numbers and which one is currently KYC-verified and active.",
        details_hi:
          "मेंबर पोर्टल पर, Manage → View → अपने आधार-लिंक्ड मोबाइल/पैन के विरुद्ध 'Member ID' इतिहास जांचें। यदि दूसरा यूएएन मौजूद है, तो दोनों यूएएन संख्याएं नोट करें और यह देखें कि कौन सा वर्तमान में केवाईसी-सत्यापित व सक्रिय है।",
        estimated_hours: 0.5,
      },
      {
        order: 2,
        action: "Raise an online Transfer Claim (Form 13) on your active UAN",
        action_hi: "अपने सक्रिय यूएएन पर ऑनलाइन ट्रांसफर क्लेम (फॉर्म 13) दर्ज करें",
        details:
          "Log in with your CURRENT (active, KYC-verified) UAN → Online Services → One Member - One EPF Account (Transfer Request). Enter the previous UAN/Member ID; the system pulls its details for you to confirm.",
        details_hi:
          "अपने वर्तमान (सक्रिय, केवाईसी-सत्यापित) यूएएन से लॉगिन करें → Online Services → One Member - One EPF Account (Transfer Request)। पिछला यूएएन/मेंबर आईडी दर्ज करें; सिस्टम पुष्टि के लिए उसका विवरण दिखाएगा।",
        estimated_hours: 0.5,
      },
      {
        order: 3,
        action: "Get the request attested (self, or via employer) and submit",
        action_hi: "अनुरोध सत्यापित कराएं (स्वयं, या नियोक्ता के माध्यम से) और सबमिट करें",
        details:
          "Choose self-attestation via Aadhaar OTP if eligible, or route through your current/previous employer for digital approval. Submit and save the Transfer Claim ID (TRRN) to track it.",
        details_hi:
          "यदि पात्र हैं तो आधार ओटीपी से स्व-सत्यापन चुनें, या अपने वर्तमान/पिछले नियोक्ता के माध्यम से डिजिटल स्वीकृति भेजें। सबमिट करें और ट्रैक करने के लिए Transfer Claim ID (TRRN) सुरक्षित रखें।",
        estimated_hours: 0.5,
      },
      {
        order: 4,
        action: "Wait for the old UAN to show 'Inoperative' with balance merged",
        action_hi: "पुराने यूएएन के 'Inoperative' दिखने और शेष राशि मर्ज होने की प्रतीक्षा करें",
        details:
          "EPFO verifies both service records and transfers the balance into your active UAN, marking the older one inoperative. Track status under Online Services → Track Claim Status using the TRRN.",
        details_hi:
          "ईपीएफओ दोनों सेवा रिकॉर्ड सत्यापित कर शेष राशि आपके सक्रिय यूएएन में स्थानांतरित करता है और पुराने को निष्क्रिय चिह्नित करता है। TRRN का उपयोग कर Online Services → Track Claim Status में स्थिति ट्रैक करें।",
        estimated_hours: 0.5,
      },
      {
        order: 5,
        action: "Once merged, re-file your original claim",
        action_hi: "मर्ज होने के बाद, अपना मूल दावा पुनः फाइल करें",
        details:
          "When the transferred balance reflects in your active UAN's passbook, submit the final settlement / advance / pension claim again on that UAN.",
        details_hi:
          "जब स्थानांतरित राशि आपके सक्रिय यूएएन की पासबुक में दिखे, तो उसी यूएएन पर अंतिम भुगतान / एडवांस / पेंशन दावा फिर से सबमिट करें।",
        estimated_hours: 0.25,
      },
    ],
    estimated_timeline_days: "10-30",
    required_documents: [
      "Both UAN numbers (active and previous)",
      "Aadhaar and PAN",
      "Previous employer Member ID / PF account number",
      "Aadhaar-linked mobile for OTP self-attestation",
    ],
    required_documents_hi: [
      "दोनों यूएएन संख्याएं (सक्रिय और पिछला)",
      "आधार और पैन",
      "पिछला नियोक्ता मेंबर आईडी / पीएफ खाता संख्या",
      "ओटीपी स्व-सत्यापन हेतु आधार-लिंक्ड मोबाइल",
    ],
    escalation_contact:
      "EPFO Field Office (transfer processing) → EPFiGMS grievance (epfigms.gov.in) with TRRN → EPFO helpline 1800-118-005",
    escalation_contact_hi:
      "ईपीएफओ फील्ड ऑफिस (ट्रांसफर प्रोसेसिंग) → TRRN के साथ EPFiGMS शिकायत (epfigms.gov.in) → ईपीएफओ हेल्पलाइन 1800-118-005",
  },
  epfigms_grievance: {
    type: "epfigms_grievance",
    title_en: "File an EPFiGMS Grievance",
    title_hi: "EPFiGMS शिकायत दर्ज करें",
    summary_en:
      "We could not safely pin the exact cause from the text. The reliable next step is to read the exact remark on the member portal and file an EPFiGMS grievance with your claim ID so an officer reviews it.",
    summary_hi:
      "हम पाठ से सटीक कारण की सुरक्षित पहचान नहीं कर सके। भरोसेमंद अगला कदम है मेंबर पोर्टल पर सटीक टिप्पणी पढ़ना और अपने claim ID के साथ EPFiGMS शिकायत दर्ज करना ताकि कोई अधिकारी इसकी समीक्षा करे।",
    steps: [
      {
        order: 1,
        action: "Read the exact rejection remark on the portal",
        action_hi: "पोर्टल पर सटीक अस्वीकृति टिप्पणी पढ़ें",
        details:
          "On the member portal, Online Services → Track Claim Status. Read the exact remark in the 'Remarks' field — it names the specific field that failed.",
        details_hi:
          "मेंबर पोर्टल पर, Online Services → Track Claim Status। 'Remarks' फ़ील्ड में सटीक टिप्पणी पढ़ें — यह विफल हुए विशिष्ट फ़ील्ड का नाम बताती है।",
        estimated_hours: 0.25,
      },
      {
        order: 2,
        action: "File a grievance on EPFiGMS with your claim ID",
        action_hi: "अपने claim ID के साथ EPFiGMS पर शिकायत दर्ज करें",
        details:
          "Go to epfigms.gov.in, choose PF Member, enter your UAN, and register the grievance with your claim reference ID and a clear description.",
        details_hi:
          "epfigms.gov.in पर जाएं, PF Member चुनें, अपना यूएएन दर्ज करें, और अपने दावा संदर्भ आईडी व स्पष्ट विवरण के साथ शिकायत पंजीकृत करें।",
        estimated_hours: 0.5,
      },
      {
        order: 3,
        action: "Track and follow up",
        action_hi: "ट्रैक करें और अनुसरण करें",
        details:
          "Note the grievance registration number. Follow up if there is no response within the stated timeline; escalate to the RPFC if unresolved.",
        details_hi:
          "शिकायत पंजीकरण संख्या नोट करें। बताई गई समयसीमा में प्रतिक्रिया न मिलने पर अनुसरण करें; अनसुलझा रहने पर RPFC को escalate करें।",
        estimated_hours: 0.25,
      },
    ],
    estimated_timeline_days: "7-15",
    required_documents: [
      "UAN and claim reference ID",
      "Aadhaar, PAN, bank passbook",
      "The exact rejection remark (screenshot)",
    ],
    required_documents_hi: [
      "यूएएन और दावा संदर्भ आईडी",
      "आधार, पैन, बैंक पासबुक",
      "सटीक अस्वीकृति टिप्पणी (स्क्रीनशॉट)",
    ],
    escalation_contact:
      "EPFiGMS grievance (epfigms.gov.in) → EPFO Field Office → Regional PF Commissioner (RPFC) → EPFO helpline 1800-118-005",
    escalation_contact_hi:
      "EPFiGMS शिकायत (epfigms.gov.in) → ईपीएफओ फील्ड ऑफिस → क्षेत्रीय भविष्य निधि आयुक्त (RPFC) → ईपीएफओ हेल्पलाइन 1800-118-005",
  },
};

export function generateRemedy(diagnosis: DiagnosisResult): RemedyOutput {
  const template = remedyTemplates[diagnosis.remedy_type] ?? remedyTemplates.epfigms_grievance;

  return {
    ...template,
    estimated_timeline_days: diagnosis.estimated_timeline_days,
  };
}

export function generateLetterContent(remedy: RemedyOutput, language: "en" | "hi"): string {
  const isHindi = language === "hi";
  const title = isHindi ? remedy.title_hi : remedy.title_en;
  const summary = isHindi ? remedy.summary_hi : remedy.summary_en;
  const steps = remedy.steps.map((s) => ({
    action: isHindi ? s.action_hi : s.action,
    details: isHindi ? s.details_hi : s.details,
  }));
  const documents = isHindi ? remedy.required_documents_hi : remedy.required_documents;
  const escalation = isHindi ? remedy.escalation_contact_hi : remedy.escalation_contact;

  let content = "";
  content += `${title}\n`;
  content += `${"=".repeat(title.length)}\n\n`;
  content += `${summary}\n\n`;
  content += `---\n\n`;
  content += `Steps to Resolve:\n\n`;

  steps.forEach((step, index) => {
    content += `${index + 1}. ${step.action}\n`;
    content += `   ${step.details}\n\n`;
  });

  content += `---\n\n`;
  content += `Required Documents:\n`;
  documents.forEach((doc) => {
    content += `  • ${doc}\n`;
  });

  content += `\n---\n\n`;
  content += `Timeline: ${remedy.estimated_timeline_days} working days\n`;
  content += `Escalation: ${escalation}\n`;

  return content;
}
