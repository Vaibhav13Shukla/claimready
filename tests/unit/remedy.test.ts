import { describe, it, expect } from "vitest";
import { diagnose } from "../../src/core/classifier";
import { generateRemedy, generateLetterContent } from "../../src/core/remedy";

describe("Remedy Generator", () => {
  it("generates member_correction remedy for a name mismatch (RC01)", () => {
    const d = diagnose({ rawErrorText: "Name mismatch as per Aadhaar", scheme: "FINAL_SETTLEMENT" });
    const remedy = generateRemedy(d);
    expect(remedy.type).toBe("member_correction");
    expect(remedy.steps.length).toBeGreaterThan(0);
    expect(remedy.steps[0].estimated_hours).toBeGreaterThan(0);
    expect(remedy.required_documents.length).toBeGreaterThan(0);
  });

  it("generates bank_fix remedy for a bank issue (RC03)", () => {
    const d = diagnose({ rawErrorText: "IFSC mismatch, payment returned by bank", scheme: "PENSION_EPS" });
    const remedy = generateRemedy(d);
    expect(remedy.type).toBe("bank_fix");
    expect(remedy.steps.length).toBeGreaterThan(0);
  });

  it("generates employer_request remedy for exit-date (RC04)", () => {
    const d = diagnose({ rawErrorText: "Date of Exit not updated by employer", scheme: "FINAL_SETTLEMENT" });
    const remedy = generateRemedy(d);
    expect(remedy.type).toBe("employer_request");
    expect(remedy.steps.length).toBeGreaterThan(0);
  });

  it("generates English letter content", () => {
    const d = diagnose({ rawErrorText: "Name mismatch as per Aadhaar", scheme: "FINAL_SETTLEMENT" });
    const content = generateLetterContent(generateRemedy(d), "en");
    expect(content).toContain("Correct Your Details");
    expect(content).toContain("Steps to Resolve");
    expect(content).toContain("Required Documents");
    expect(content).toContain("Timeline");
  });

  it("generates Hindi letter content", () => {
    const d = diagnose({ rawErrorText: "Name mismatch as per Aadhaar", scheme: "FINAL_SETTLEMENT" });
    const content = generateLetterContent(generateRemedy(d), "hi");
    expect(content).toContain("ईपीएफओ");
    expect(content.length).toBeGreaterThan(100);
  });

  it("letter content contains all steps", () => {
    const d = diagnose({ rawErrorText: "IFSC mismatch", scheme: "FINAL_SETTLEMENT" });
    const remedy = generateRemedy(d);
    const content = generateLetterContent(remedy, "en");
    remedy.steps.forEach((step) => expect(content).toContain(step.action));
  });

  it("handles UNKNOWN diagnosis gracefully", () => {
    const d = diagnose({ rawErrorText: "completely unrelated text here", scheme: "FINAL_SETTLEMENT" });
    const remedy = generateRemedy(d);
    expect(remedy.type).toBe("epfigms_grievance");
    expect(remedy.steps.length).toBeGreaterThan(0);
  });
});
