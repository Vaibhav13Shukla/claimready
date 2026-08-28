# Project Summary (for the submission form, exactly 250 words)

> Word count: 250. Paste as-is into the submission field.

PF X-Ray is a pre-flight check and rejection decoder for citizen EPFO Provident Fund claims.

The problem: EPFO annual reports show that despite rising claim volumes, many PF withdrawal and transfer requests face rejection for small, fixable data mismatches. A name spelling difference between UAN and Aadhaar, a date-of-birth discrepancy, unverified bank KYC, or a missing Date of Exit can bounce a claim. Citizens wait weeks, receive a cryptic remark, and restart blind. While EPFO has improved overall settlement rates (source: EPFO Annual Report 2023–24), the confusing failure journey remains unaddressed.

What we built: select your claim type or paste a rejection remark, and PF X-Ray checks it against a deterministic root-cause taxonomy covering the five most common rejection categories. It explains the blocker in plain language (English and Hindi), reconstructs a synthetic Claim X-Ray showing conflicting records, and delivers a resolution plan with required documents, the responsible party, a realistic resolution timeline, and a ready-to-send letter for your bank or employer.

Why it works: an OpenAI model interprets free-text rejection remarks, but a deterministic rules engine decides the final diagnosis—preventing hallucinated remedies. Every root cause is covered by automated golden-case tests.

What is real versus mocked: the classification engine, OpenAI explanation, and resolution content are fully functional. The EPFO portal walkthrough and lifecycle tracker use synthetic demo data. No live government system is touched, and no real Aadhaar, PAN, UAN, or citizen data is accepted.

Built with AI coding agents, spec-first and test-driven; runtime is genuinely OpenAI-powered for everyone.
