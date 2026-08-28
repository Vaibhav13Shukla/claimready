import { describe, it, expect } from "vitest";
import { generateGrievanceLetter } from "../../src/documents/grievance-letter";

describe("Grievance (Date-of-Exit) Letter Generator", () => {
  it("generates English letter with sensible synthetic defaults when no params given", () => {
    const letter = generateGrievanceLetter({ language: "en" });
    expect(letter.subject).toContain("Date of Exit");
    expect(letter.body).toContain("Demo Member");
    expect(letter.body).toContain("DEMOCLAIM-000000");
    expect(letter.body).toContain("15 days");
    expect(letter.printableText).toBe(`${letter.subject}\n\n${letter.body}`);
  });

  it("generates Hindi letter with sensible synthetic defaults", () => {
    const letter = generateGrievanceLetter({ language: "hi" });
    expect(letter.subject).toContain("नौकरी छोड़ने की तिथि");
    expect(letter.body).toContain("डेमो सदस्य");
    expect(letter.whatsappText).toContain("निकास तिथि");
  });

  it("substitutes custom params into both English body and WhatsApp text", () => {
    const letter = generateGrievanceLetter({
      language: "en",
      beneficiaryName: "Test Person",
      uan: "999-TEST-1234",
      memberId: "AB/TEST/1234567/001",
      employerName: "Old Employer Ltd",
      lastWorkingDay: "15 Feb 2025",
      claimId: "CLAIM-42",
      dateStr: "01 Jan 2026",
    });
    expect(letter.body).toContain("Test Person");
    expect(letter.body).toContain("999-TEST-1234");
    expect(letter.body).toContain("AB/TEST/1234567/001");
    expect(letter.body).toContain("Old Employer Ltd");
    expect(letter.body).toContain("15 Feb 2025");
    expect(letter.body).toContain("CLAIM-42");
    expect(letter.whatsappText).toContain("CLAIM-42");
    expect(letter.whatsappText).toContain("Old Employer Ltd");
  });

  it("mentions the EPFiGMS escalation path in both languages", () => {
    expect(generateGrievanceLetter({ language: "en" }).body).toContain("EPFiGMS");
    expect(generateGrievanceLetter({ language: "hi" }).body).toContain("EPFiGMS");
  });
});
