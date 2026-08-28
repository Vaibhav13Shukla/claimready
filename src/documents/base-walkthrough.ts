export interface BaseWalkthroughStep {
  stepNumber: number;
  title_en: string;
  title_hi: string;
  screenName: string;
  description_en: string;
  description_hi: string;
  simulatedAction_en: string;
  simulatedAction_hi: string;
  tip_en: string;
  tip_hi: string;
}

export interface BaseWalkthroughFlow {
  code: "RC01" | "RC02";
  title_en: string;
  title_hi: string;
  steps: BaseWalkthroughStep[];
}

export const BASE_WALKTHROUGH_FLOWS: Record<"RC01" | "RC02", BaseWalkthroughFlow> = {
  RC01: {
    code: "RC01",
    title_en: "Simulated EPFO Portal Walkthrough: Correct Your Name to Match Aadhaar",
    title_hi: "सिम्युलेटेड ईपीएफओ पोर्टल वॉकथ्रू: आधार से मेल कराने हेतु अपना नाम ठीक करें",
    steps: [
      {
        stepNumber: 1,
        title_en: "1. Log in to the Unified Member Portal",
        title_hi: "1. यूनिफाइड मेंबर पोर्टल में लॉगिन करें",
        screenName: "Member Login: UAN + Password",
        description_en:
          "Open the EPFO Unified Member Portal and log in with your UAN and password, then verify the OTP on your Aadhaar-linked mobile.",
        description_hi:
          "ईपीएफओ यूनिफाइड मेंबर पोर्टल खोलें और अपने यूएएन व पासवर्ड से लॉगिन करें, फिर आधार-लिंक्ड मोबाइल पर ओटीपी सत्यापित करें।",
        simulatedAction_en: "Enter UAN, password and captcha, then submit the Aadhaar OTP.",
        simulatedAction_hi: "यूएएन, पासवर्ड और कैप्चा दर्ज करें, फिर आधार ओटीपी सबमिट करें।",
        tip_en: "Keep your Aadhaar-linked mobile handy. The OTP goes there.",
        tip_hi: "अपना आधार-लिंक्ड मोबाइल पास रखें। ओटीपी वहीं आता है।",
      },
      {
        stepNumber: 2,
        title_en: "2. Open Manage → Modify Basic Details",
        title_hi: "2. Manage → Modify Basic Details खोलें",
        screenName: "Modify Basic Details",
        description_en:
          "The screen shows your current EPFO name beside your Aadhaar name. Note the exact difference (e.g. 'Rahul K' vs 'Rahul Kumar').",
        description_hi:
          "स्क्रीन आपके आधार नाम के साथ आपका वर्तमान ईपीएफओ नाम दिखाती है। सटीक अंतर नोट करें (जैसे 'Rahul K' बनाम 'Rahul Kumar')।",
        simulatedAction_en:
          "Type your name EXACTLY as printed on Aadhaar. Every letter and initial must match.",
        simulatedAction_hi:
          "अपना नाम ठीक वैसे ही टाइप करें जैसे आधार पर छपा है। हर अक्षर और initial मेल खाना चाहिए।",
        tip_en: "The system verifies your entry against UIDAI in real time.",
        tip_hi: "सिस्टम आपकी प्रविष्टि को UIDAI से रियल-टाइम में सत्यापित करता है।",
      },
      {
        stepNumber: 3,
        title_en: "3. Submit the correction & save the reference number",
        title_hi: "3. सुधार सबमिट करें और संदर्भ संख्या सुरक्षित रखें",
        screenName: "Joint Declaration: Submit",
        description_en:
          "Submit the change request. This creates a Joint Declaration that now needs employer and EPFO approval.",
        description_hi:
          "परिवर्तन अनुरोध सबमिट करें। यह एक जॉइंट डिक्लेरेशन बनाता है जिसे अब नियोक्ता और ईपीएफओ की स्वीकृति चाहिए।",
        simulatedAction_en: "Click Submit and note the request reference number.",
        simulatedAction_hi: "Submit पर क्लिक करें और अनुरोध संदर्भ संख्या नोट करें।",
        tip_en: "Screenshot the reference number. You'll quote it while following up.",
        tip_hi: "संदर्भ संख्या का स्क्रीनशॉट लें। अनुसरण करते समय इसे बताएंगे।",
      },
      {
        stepNumber: 4,
        title_en: "4. Get employer approval, then re-file",
        title_hi: "4. नियोक्ता स्वीकृति लें, फिर पुनः फाइल करें",
        screenName: "Approval Pending → Corrected",
        description_en:
          "Your employer approves it on their EPFO login, then EPFO approves. Once your name shows corrected (7-20 days), re-file the claim.",
        description_hi:
          "आपका नियोक्ता इसे अपने ईपीएफओ लॉगिन पर स्वीकृत करता है, फिर ईपीएफओ स्वीकृत करता है। नाम सही दिखने पर (7-20 दिन), दावा पुनः फाइल करें।",
        simulatedAction_en: "Ask HR to approve, then re-submit the claim after it reflects.",
        simulatedAction_hi: "HR से स्वीकृति कराएं, फिर परिलक्षित होने के बाद दावा पुनः सबमिट करें।",
        tip_en: "Do not re-file before the correction reflects. It will just reject again.",
        tip_hi: "सुधार परिलक्षित होने से पहले पुनः फाइल न करें। यह फिर से अस्वीकृत होगा।",
      },
    ],
  },
  RC02: {
    code: "RC02",
    title_en: "Simulated EPFO Portal Walkthrough: Correct Your Date of Birth",
    title_hi: "सिम्युलेटेड ईपीएफओ पोर्टल वॉकथ्रू: अपनी जन्म तिथि ठीक करें",
    steps: [
      {
        stepNumber: 1,
        title_en: "1. Log in and open Modify Basic Details",
        title_hi: "1. लॉगिन करें और Modify Basic Details खोलें",
        screenName: "Modify Basic Details: Date of Birth",
        description_en:
          "Log in to the member portal and open Manage → Modify Basic Details. Compare your EPFO Date of Birth with your Aadhaar DOB.",
        description_hi:
          "मेंबर पोर्टल में लॉगिन करें और Manage → Modify Basic Details खोलें। अपनी ईपीएफओ जन्म तिथि की तुलना आधार जन्म तिथि से करें।",
        simulatedAction_en: "Enter the Date of Birth exactly as on your Aadhaar.",
        simulatedAction_hi: "जन्म तिथि ठीक वैसे ही दर्ज करें जैसे आपके आधार पर है।",
        tip_en: "Large DOB changes may need documentary proof. Keep it ready.",
        tip_hi: "बड़े जन्म तिथि परिवर्तन के लिए दस्तावेजी प्रमाण चाहिए हो सकता है। तैयार रखें।",
      },
      {
        stepNumber: 2,
        title_en: "2. Attach proof of date of birth",
        title_hi: "2. जन्म तिथि का प्रमाण संलग्न करें",
        screenName: "Upload Supporting Document",
        description_en:
          "Upload an accepted DOB proof: birth certificate, passport, SSC/10th certificate, or the Aadhaar itself as reference.",
        description_hi:
          "स्वीकृत जन्म तिथि प्रमाण अपलोड करें: जन्म प्रमाण पत्र, पासपोर्ट, एसएससी/10वीं प्रमाण पत्र, या संदर्भ के रूप में आधार।",
        simulatedAction_en: "Upload a clear scan of your DOB proof and submit.",
        simulatedAction_hi: "अपने जन्म तिथि प्रमाण का स्पष्ट स्कैन अपलोड करें और सबमिट करें।",
        tip_en: "A blurry upload is the most common reason a correction gets returned.",
        tip_hi: "धुंधला अपलोड सुधार वापस आने का सबसे आम कारण है।",
      },
      {
        stepNumber: 3,
        title_en: "3. Submit and route for approval",
        title_hi: "3. सबमिट करें और स्वीकृति हेतु भेजें",
        screenName: "Joint Declaration: Submit",
        description_en:
          "Submit the Joint Declaration. It goes to your employer, then EPFO, for approval. Save the reference number.",
        description_hi:
          "जॉइंट डिक्लेरेशन सबमिट करें। यह आपके नियोक्ता, फिर ईपीएफओ की स्वीकृति हेतु जाता है। संदर्भ संख्या सुरक्षित रखें।",
        simulatedAction_en: "Click Submit and record the reference number.",
        simulatedAction_hi: "Submit पर क्लिक करें और संदर्भ संख्या दर्ज करें।",
        tip_en: "Follow up with HR so it doesn't sit unapproved.",
        tip_hi: "HR से अनुसरण करें ताकि यह बिना स्वीकृति के न रुके।",
      },
      {
        stepNumber: 4,
        title_en: "4. Once corrected, re-file your claim",
        title_hi: "4. सुधार होने के बाद, दावा पुनः फाइल करें",
        screenName: "Corrected → Re-file",
        description_en:
          "When the DOB shows the corrected value on the portal, submit your claim again. It should now clear the DOB check.",
        description_hi:
          "जब पोर्टल पर जन्म तिथि सही मान दिखाए, तो अपना दावा फिर से सबमिट करें। अब यह जन्म तिथि जांच पास कर लेना चाहिए।",
        simulatedAction_en: "Re-submit the claim after the DOB reflects as corrected.",
        simulatedAction_hi: "जन्म तिथि सही परिलक्षित होने के बाद दावा पुनः सबमिट करें।",
        tip_en: "Verify the corrected DOB shows on your passbook page before re-filing.",
        tip_hi:
          "पुनः फाइल करने से पहले सत्यापित करें कि सही जन्म तिथि आपके पासबुक पृष्ठ पर दिखती है।",
      },
    ],
  },
};
