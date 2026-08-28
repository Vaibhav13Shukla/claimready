import { describe, it, expect } from "vitest";
import { generateBankLetter } from "../../src/documents/bank-letter";

describe("Bank Letter Generator", () => {
  it("generates English letter with sensible synthetic defaults when no params given", () => {
    const letter = generateBankLetter({ language: "en" });
    expect(letter.subject).toContain("Bank Account Activation");
    expect(letter.body).toContain("Demo Member");
    expect(letter.body).toContain("XXXX-DEMO-5678");
    expect(letter.body).toContain("100-DEMO-0000");
    expect(letter.printableText).toBe(`${letter.subject}\n\n${letter.body}`);
    expect(letter.whatsappText).toContain("PF X-Ray");
  });

  it("generates Hindi letter with sensible synthetic defaults", () => {
    const letter = generateBankLetter({ language: "hi" });
    expect(letter.subject).toContain("बैंक खाता");
    expect(letter.body).toContain("डेमो सदस्य");
    expect(letter.whatsappText).toContain("बैंक केवाईसी");
  });

  it("substitutes custom params into both English body and WhatsApp text", () => {
    const letter = generateBankLetter({
      language: "en",
      beneficiaryName: "Test Person",
      accountNumber: "1234567890",
      bankName: "Test Bank",
      branchName: "Test Branch",
      uan: "999-TEST-1234",
      dateStr: "01 Jan 2026",
    });
    expect(letter.body).toContain("Test Person");
    expect(letter.body).toContain("1234567890");
    expect(letter.body).toContain("Test Bank, Test Branch");
    expect(letter.body).toContain("999-TEST-1234");
    expect(letter.body).toContain("01 Jan 2026");
    expect(letter.whatsappText).toContain("1234567890");
    expect(letter.whatsappText).toContain("Test Bank");
  });

  it("never leaks a real-looking phone number — stays the synthetic placeholder", () => {
    const letter = generateBankLetter({ language: "en" });
    expect(letter.body).toContain("98XXXXXXXX");
  });
});
