# Project Summary (for the submission form, <250 words)

> Word count: 248. Paste as-is, or edit to taste — just recount if you change it.

ClaimReady is a pre-flight check and rejection decoder for EPFO Provident Fund claims.

The problem: roughly 1 in 5 EPFO claims gets rejected, almost always for a small, fixable mismatch: a name spelling difference, a DOB mismatch, unverified bank KYC, or an employer who never updated the exit date. Citizens wait 15-20 days only to be bounced, then guess and retry blind. Every existing resource is reactive; nothing checks before you file.

What we built: pick your claim type or paste a rejection remark, and ClaimReady runs it against a deterministic root-cause taxonomy (5 codes covering 80%+ of real rejections), explains the exact blocker in plain language (English and Hindi), and hands you a resolution plan: required documents, who must act, a realistic timeline, and a simulated EPFO portal walkthrough for self-service fixes.

Why it's better: EPFO's portal only tells you a claim failed, not why or what to do next. ClaimReady closes that loop. An OpenAI model interprets messy rejection text, but a deterministic rules engine, not the model, decides the diagnosis, so there are no hallucinated remedies. Every root cause is covered by automated golden-case tests.

What's real vs. mocked: the classification engine, OpenAI-powered explanation, and resolution content are fully functional. The EPFO portal walkthrough and lifecycle tracker are simulated with synthetic data. No live government system is touched, and no real Aadhaar, PAN, UAN, or OTP data is accepted.

Built with Claude Code, spec-first and test-driven; runtime is genuinely OpenAI-powered per the hackathon's AI-usage rule.
