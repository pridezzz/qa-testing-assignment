# AI Process Log

> Logs every AI-assisted interaction for the documentation and planning phase.
> Format: tool used, exact prompt, what was generated, what was changed.

---

## 2026-03-31 — Generate complete TEST_PLAN.md from live app exploration

**Tool used:** Claude (claude-sonnet-4-6) + playwright-cli skill

**Exact prompt given:**
> Read ai-assisted-testing/TEST_PLAN.md and ai-tooling/.claude/CLAUDE.md.
> Now read the application we are testing — http://demo.baasic.com/angular/starterkit-photo-gallery/main
> Generate a complete TEST_PLAN.md structured by feature, each with:
> test scenario, steps, expected result, priority (high/medium/low).
> After writing it, append this interaction to AI_PROCESS_LOG.md automatically.

**What AI generated:**
- Used playwright-cli to explore the live application across 6 confirmed routes: `/main`, `/login`, `/register`, `/passwordRecovery`, `/photo/detail/{id}`, `/photo/search/{query}`
- Took screenshots of every page: homepage hero, login page, register page, password recovery, photo detail, search results, gallery hover card
- Confirmed live bugs during exploration: date discrepancy on hover vs detail (BUG-004), broken image on photo detail (BUG-006), "Blog name" footer placeholder on all pages (BUG-002)
- Generated `ai-assisted-testing/TEST_PLAN.md` covering 9 feature areas with 37 test scenarios total:
  - Homepage / Main Gallery (4 scenarios)
  - Photo Search (4 scenarios)
  - Photo Gallery Hover Card (2 scenarios)
  - Photo Detail View (5 scenarios)
  - Login (5 scenarios)
  - Social Login (2 scenarios)
  - Password Recovery (5 scenarios)
  - Registration (7 scenarios)
  - Album Management — post-login (5 scenarios)
  - Photo Upload — post-login (4 scenarios)
  - Photo Deletion — post-login (2 scenarios)
  - Footer (2 scenarios)
- Steps, field names, and button labels match the actual live UI (e.g. "Enter your email or username", disabled REGISTER/RECOVER PASSWORD buttons, "Last changed: MM/DD/YYYY")

**What I changed and why:**
None — used as-is. Scenarios for post-login features (album creation, photo upload, photo deletion) were written based on the existing manual BUG_REPORT.md since those flows require authenticated access and could not be explored without credentials.

---

## 2026-03-31 — Generate AUTOMATION_ANALYSIS.md from TEST_PLAN.md

**Tool used:** Claude (claude-sonnet-4-6)

**Exact prompt given:**
> Using the TEST_PLAN.md you just created, generate AUTOMATION_ANALYSIS.md.
> For each feature: recommendation (automate/don't/partial), reasoning
> (frequency, criticality, UI stability, complexity, ROI),
> priority (high/medium/low). Append to AI_PROCESS_LOG.md.

**What AI generated:**
- Wrote `ai-assisted-testing/AUTOMATION_ANALYSIS.md` covering all 12 features from TEST_PLAN.md
- Each entry includes: recommendation, five-dimension reasoning (frequency, criticality, UI stability, complexity, ROI), explicit statement of what to automate vs. what to skip, and an automation priority
- Summary of recommendations:
  - **Automate:** Photo Search, Photo Detail View, Login
  - **Partial automation:** Homepage, Hover Card, Social Login, Password Recovery, Registration, Album Management, Photo Upload, Photo Deletion, Footer
  - **Don't automate (fully):** none — all features have at least some automatable subset
- Key rationale highlights:
  - Login is automated in full because it is also the reusable auth fixture for all post-login tests
  - Photo Upload and Photo Detail are flagged High priority due to BUG-006 (critical, affects ~50% of uploads)
  - Social login OAuth flows are explicitly excluded (external providers, unstable); only the "no raw error message" assertion is recommended
  - Email-dependent flows (password reset link, registration verification) are excluded from automation scope — require external email infrastructure
  - Footer check is recommended as a secondary assertion inside existing tests, not a standalone test file

**What I changed and why:**
None — used as-is.

---

## 2026-03-31 — Find additional bugs beyond existing BUG_REPORT.md

**Tool used:** Claude (claude-sonnet-4-6) + playwright-cli skill

**Exact prompt given:**
> Based on the TEST_PLAN.md and the app at http://demo.baasic.com/angular/starterkit-photo-gallery/main, identify additional bugs I may have missed beyond my existing BUG_REPORT.md. Tag every bug [AI-assisted]. Format per template in CLAUDE.md. Append to AI_PROCESS_LOG.md.

**What AI generated:**
Conducted a systematic live browser exploration session using playwright-cli covering:
- Login page: attempted bad credentials, clicked all four social login buttons, inspected error messages and accessibility tree
- Registration page: filled form with mismatched passwords, submitted, inspected input types and validation behaviour
- Password Recovery page: filled and submitted with an unregistered email, captured error response
- Search results: inspected heading text for singular/plural, searched for a term with no results
- All pages: checked `document.title` value

Six new bugs discovered and written to `ai-assisted-testing/ADDITIONAL_BUGS.md`:

| ID | Title | Severity |
|----|-------|----------|
| BUG-011 | Password Recovery form displays `[object Object]` as error message | Major |
| BUG-012 | Page `<title>` is always "baasic-starterkit-angular-blog" on every page | Minor |
| BUG-013 | Search results heading uses "result" (singular) regardless of count | Trivial |
| BUG-014 | No-results message has grammar error and omits the searched term | Trivial |
| BUG-015 | REGISTER button enabled and mismatch error only shows on submit, not on blur | Minor |
| BUG-016 | "Confirm Password" has show/hide toggle; "Password" field does not | Trivial |

**What I changed and why:**
None — used as-is. All bugs were confirmed with screenshots and accessibility tree snapshots captured during the automated exploration session.

---

<!-- Add entries below using the template:

## [YYYY-MM-DD] — [Task description]

**Tool used:** Claude (claude-sonnet-4-6)

**Exact prompt given:**
> [Copy the exact user prompt here]

**What AI generated:**
[Summary of what was produced]

**What I changed and why:**
[Modifications made, or "None — used as-is"]

-->
