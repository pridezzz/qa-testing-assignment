# Automation Analysis — Photo Gallery (Baasic Starterkit)

> Per-feature analysis of what is worth automating, with reasoning across five dimensions
> and an overall automation priority. Based on TEST_PLAN.md and live app exploration.
>
> Criteria used:
> - **Frequency of use** — how often the feature is exercised by real users
> - **Criticality** — impact of a failure on the user or the business
> - **UI stability** — how likely the selectors and page structure are to change
> - **Implementation complexity** — effort required to write and maintain the test
> - **ROI** — net value of having the test automated vs. running it manually

---

## Feature: Homepage / Main Gallery

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Every session — it is the entry point to the application
- Criticality: High — a broken homepage blocks all further use
- UI stability: High for structure (grid container, search input, logo); Medium for content (hero image and tagline may change with deployments)
- Implementation complexity: Low — page load check and element presence assertions require no authentication and no dynamic data
- ROI: High for a lightweight smoke test (page loads, photo grid container present, search input present); Low for asserting specific text like the tagline, which can legitimately change

Automate: page loads with HTTP 200, photo grid container is visible after scroll, search input is present.
Do not automate: exact hero tagline text, hero image content.

**Automation priority:** Medium

---

## Feature: Photo Search

**Recommendation:** Automate

**Reasoning:**
- Frequency of use: High — search is a primary discovery mechanism for the gallery
- Criticality: High — a broken search makes the majority of photos inaccessible to users who do not browse
- UI stability: High — the URL pattern `/photo/search/{query}` and heading pattern `Search result for: '{term}'` are stable Angular routes unlikely to change without a deliberate refactor
- Implementation complexity: Low — type into the search input, press Enter, assert URL and heading; no authentication needed
- ROI: High — catches any regression in search routing, query propagation, and results rendering with minimal test complexity

**Automation priority:** High

---

## Feature: Photo Gallery Hover Card

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: High — hovering is the main way users see photo metadata before clicking
- Criticality: High — specifically because the date shown here must match the detail page; the discrepancy (BUG-004) is a confirmed, active bug
- UI stability: Medium — hover overlays are CSS-transition-driven and can shift position between releases; Playwright's `hover()` is reliable, but the overlay element structure may change
- Implementation complexity: Medium — hover to reveal overlay, extract date text, navigate to detail page, extract date again, compare; requires handling the lazy-loaded photo grid
- ROI: High for the date-consistency check specifically (prevents BUG-004 from regressing once fixed); Low for asserting that the overlay "looks right" visually

Automate: hover date vs. detail page date equality check.
Do not automate: visual appearance of the overlay, exact icon layout.

**Automation priority:** High

---

## Feature: Photo Detail View

**Recommendation:** Automate

**Reasoning:**
- Frequency of use: Very high — viewing a photo in full is the core user action
- Criticality: Critical — BUG-006 (photo returns 404 on direct click) makes the detail view non-functional for roughly half of uploaded photos
- UI stability: High — the route `/photo/detail/{id}`, the "More details" section, and the close button are stable structural elements confirmed in live exploration
- Implementation complexity: Low-Medium — click a photo, assert navigation to `/photo/detail/`, assert image `src` responds with HTTP 200 (via Playwright network interception), assert "More details" fields are non-empty; no authentication needed for public photos
- ROI: Very high — the image-loading check directly tests the most user-visible failure mode in the app; the metadata check prevents silent regressions in the "More details" section

**Automation priority:** High

---

## Feature: Login

**Recommendation:** Automate

**Reasoning:**
- Frequency of use: Every authenticated session — login is the gateway to all post-login features
- Criticality: Critical — a broken login blocks all album, upload, and deletion workflows; it is also required as a setup step for every other authenticated test
- UI stability: Very high — the login form has a fixed two-field structure and stable button labels confirmed in live exploration; Angular forms of this type rarely change
- Implementation complexity: Low — fill username + password, click LOGIN, assert redirect; standard Playwright pattern; can be extracted into a reusable `loginAs()` fixture for other tests
- ROI: Very high — foundational test that underpins all post-login test coverage; also directly catches any regression in the authentication flow

**Automation priority:** High

---

## Feature: Social Login

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Low — most users use username/password; social login is secondary
- Criticality: Medium — the feature is currently entirely broken (BUG-003), but the primary user path (username/password) still works
- UI stability: Low for the full OAuth flow — each provider has its own login page outside of the app's control, which changes unpredictably and cannot be reliably automated
- Implementation complexity: Very high for full OAuth flow testing; Low for asserting the absence of the raw error message
- ROI: Low for full OAuth flow (high complexity, low stability, external dependencies); Medium for a targeted assertion that no raw JSON error text appears in the social login section on page load — this is a one-line check

Automate: assert that the text "Social login configuration not found" and "undefined:" are not present anywhere on the login page.
Do not automate: the full OAuth redirect and authentication flow for any provider.

**Automation priority:** Low

---

## Feature: Password Recovery

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Low — occasional, infrequent user action
- Criticality: High — BUG-001 (reset link returns 404) completely prevents users from recovering their accounts; the ability to reset a password is a security-critical baseline
- UI stability: High — the password recovery page has a single field and a button; structure is stable
- Implementation complexity:
  - Page rendering and button state: Low
  - Submitting and checking for confirmation message: Low
  - Verifying email delivery and that the reset link opens a working page: Very high (requires controlled email inbox access, out of scope for UI automation)
- ROI: Medium — automating the UI portion (page renders, button disabled until email entered, submit shows a response) is easy and catches UI regressions; the critical bug (404 link) can only be caught with an end-to-end mail-delivery test, which is impractical without email test infrastructure

Automate: page renders correctly, button is disabled when field is empty, button enables after input, form submits and shows a response.
Do not automate: email delivery and reset link validity (requires external email access).

**Automation priority:** Medium

---

## Feature: Registration

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Low per user (one-time action), but it is the new-user onboarding path
- Criticality: High — BUG-005 (fake email accepted without verification) is a security and data quality issue; password mismatch and duplicate email validation are also correctness requirements
- UI stability: High — four-field form with stable structure confirmed in live exploration; the REGISTER button's disabled state is a native Angular form validity check
- Implementation complexity:
  - Form validation scenarios (password mismatch, button state): Low
  - Duplicate email and fake email: Medium (requires a known pre-existing account)
  - Email verification flow: Very high (requires inbox access)
- ROI: High for all client-side validation scenarios — they are fast to write, stable, and directly test critical validation logic including the fake-email security issue

Automate: button disabled with empty fields, button enables when all filled, password mismatch shows error, duplicate email rejected, fake email accepted (asserting current buggy behaviour until fixed).
Do not automate: email verification link click (requires external email infrastructure).

**Automation priority:** High

---

## Feature: Album Management (post-login)

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: High for authenticated users — creating and browsing albums is a core workflow
- Criticality: High — BUG-007 (missing username on confirmation page) and BUG-008 (plural grammar) are direct regressions in album creation output
- UI stability: Medium — post-login pages were not directly explored due to lack of credentials; album creation page structure is inferred from BUG_REPORT.md and may have additional dynamic elements
- Implementation complexity: High — all album tests require prior authentication (login fixture), navigation to album creation, form fill, and then state verification; the confirmation page username check (BUG-007) and photo counter grammar check (BUG-008) are straightforward assertions once the setup overhead is handled
- ROI: High for the two specific bug-regression checks (BUG-007, BUG-008); Medium for the broader "albums page lists albums" scenario which is largely a smoke test

Automate: album creation happy path + confirmation page shows non-empty username (BUG-007 regression) + album list renders + photo counter uses correct grammar (BUG-008 regression).
Do not automate: edge cases around album title validation until post-login pages are directly explored.

**Automation priority:** Medium

---

## Feature: Photo Upload (post-login)

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Very high — uploading photos is the primary content creation action
- Criticality: Critical — BUG-006 (uploaded photos return 404 on direct click) affects roughly 50% of uploads and is the most impactful bug in the app
- UI stability: Medium — file upload UI elements can behave differently across browsers; Playwright's `setInputFiles()` is reliable for the upload action, but the album grid rendering involves dynamic Angular components
- Implementation complexity: High — requires auth fixture, album setup, file upload via `setInputFiles()`, return to album view, click each uploaded photo, and intercept network responses to detect 404s via Playwright's `page.on('response', ...)` or `route()` API
- ROI: Very high — directly tests the critical path for the app's core feature; a single test that uploads multiple photos and verifies all are accessible by direct click would provide immediate regression coverage for BUG-006

Automate: upload a photo, verify thumbnail appears, verify direct click does not produce a network 404.
Do not automate: cross-browser file picker UI interactions, upload progress UI, unsupported file type rejection (low priority, unstable file input behaviour).

**Automation priority:** High

---

## Feature: Photo Deletion (post-login)

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Medium — deletion is a regular but not frequent action
- Criticality: High — BUG-010 (500 error when reusing a deleted photo's name) actively crashes the server and directly impacts users who replace photos
- UI stability: Medium — deletion action and subsequent album view are straightforward, but the exact delete UI (button, confirmation dialog) was not directly observed in live exploration
- Implementation complexity: High — requires auth, upload a photo with a known name, delete it, immediately upload again with the same name, verify success; the race-condition aspect (timing matters) makes this harder to automate reliably, but the test can mitigate this by not adding any artificial delay between delete and re-upload
- ROI: High for the name-reuse regression test (BUG-010) — a server 500 crash is exactly the kind of regression that automated tests should catch before it reaches production

Automate: photo deletion removes it from album view + immediate name reuse does not trigger 500 error (BUG-010 regression).
Do not automate: delete confirmation dialog edge cases until the exact UI is confirmed.

**Automation priority:** Medium

---

## Feature: Footer

**Recommendation:** Partial automation

**Reasoning:**
- Frequency of use: Present on every page — it is technically the most frequently rendered element in the app
- Criticality: Low — "Blog name" placeholder (BUG-002) is a cosmetic defect; it does not block any user action
- UI stability: Very high — footer structure and text are static; they never change between page navigations
- Implementation complexity: Very low — a single `expect(page.locator('footer')).not.toContainText('Blog name')` assertion
- ROI: Low as a standalone test; High as an incidental assertion appended to any existing test (e.g. the login page test already loads the footer, so one extra line covers this at zero extra cost)

Automate: add a `not.toContainText('Blog name')` footer assertion as a secondary check inside the Login and Registration page tests rather than as a dedicated test file.
Do not automate: dedicated footer test suite — the ROI of a separate test file is too low given the criticality.

**Automation priority:** Low

---
