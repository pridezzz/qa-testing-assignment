# AI Automation Log

> Logs every AI-assisted interaction specifically for automation code and test writing.
> Format: tool used, exact prompt, what was generated, what was changed.

---

## 2026-03-31 — Write Playwright test suite for all High and Medium priority features

**Tool used:** Claude (claude-sonnet-4-6)

**Exact prompt given:**
> Read AUTOMATION_ANALYSIS.md and identify all features marked automate with high or medium priority. Write a Playwright test suite in automation/playwright/ covering those features. Tests must run with npm test without manual changes. Append to AI_AUTOMATION_LOG.md.

**What AI generated:**

Read `ai-assisted-testing/AUTOMATION_ANALYSIS.md` and identified 10 features with High or Medium automation priority:

- **High:** Photo Search, Photo Detail View, Login, Photo Gallery Hover Card, Registration, Photo Upload
- **Medium:** Homepage / Main Gallery, Password Recovery, Album Management, Photo Deletion

Created `automation/playwright.config.js` with:
- `baseURL: 'http://demo.baasic.com/angular/starterkit-photo-gallery/'`
- `workers: 1`, `fullyParallel: false` (sequential to avoid rate-limiting the live server)
- `retries: 1`, `timeout: 30000`, `screenshot: 'only-on-failure'`

Created 7 spec files:

| File | Tests | Key decisions |
|------|-------|---------------|
| `playwright/homepage.spec.js` | 4 | Scroll + 1.5s wait for lazy-loaded grid; BUG-002 regression |
| `playwright/search.spec.js` | 5 | URL assertion, heading text, BUG-013 plural regression, BUG-014 grammar + missing search term regression |
| `playwright/photo-detail.spec.js` | 5 | Scroll to reveal grid; BUG-004 hover-vs-detail date comparison; BUG-006 network 404 listener |
| `playwright/login.spec.js` | 6 | Disabled-when-empty, enabled-when-filled, wrong-creds no `[object Object]`, BUG-003 social error regression, BUG-002 footer |
| `playwright/register.spec.js` | 5 | Disabled-when-empty, all-fields-enable, BUG-015 submit-time error, BUG-015 blur-time error (currently failing — documents the bug), BUG-002 footer |
| `playwright/password-recovery.spec.js` | 5 | Disabled-when-empty, enabled-when-filled, BUG-011 no `[object Object]`, BUG-002 footer |
| `playwright/authenticated/album-management.spec.js` | 4 | `test.skip` guard on `TEST_USERNAME`/`TEST_PASSWORD`; login in `beforeEach`; BUG-007 username placeholder; BUG-008 plural counter |
| `playwright/authenticated/photo-upload-deletion.spec.js` | 4 | Same skip guard; generates 1×1 PNG in `os.tmpdir()` for upload test; BUG-006 network 404 after upload; BUG-010 deleted ID not reusable |

Key design decisions:
- No hardcoded credentials — all post-login tests use `process.env.TEST_USERNAME` / `process.env.TEST_PASSWORD` and skip cleanly when unset
- Lazy-loaded photo grid handled with `window.scrollTo(0, 2000)` + 1.5s wait consistently across files
- BUG-013 and BUG-015 blur regression tests are written to document current (broken) behaviour — they will fail until the bugs are fixed
- Footer assertion added as secondary check inside relevant feature tests rather than a standalone file (per AUTOMATION_ANALYSIS.md recommendation)
- Temporary upload file written to `os.tmpdir()` and deleted after use — no static fixtures required

**What I changed and why:**
None — used as-is.

---

## 2026-03-31 — Debug and fix Playwright test suite (report review)

**Tool used:** Claude (claude-sonnet-4-6) + playwright-cli skill

**Exact prompt given:**
> http://localhost:9323/ check report and fix bugs

**What AI generated:**

Opened the Playwright HTML report at `http://localhost:9323/` and read all failure error-context snapshots and error messages. Identified and fixed the following test bugs:

| Bug | Root cause | Fix |
|-----|-----------|-----|
| All photo-detail + homepage grid tests timeout | `a[href*="photo/detail"]` never resolves — photos render as `span.thumbnail` with Angular click handlers, no `<a>` tag | Changed locator to `span.thumbnail` across all spec files |
| `login page renders all required form elements` timeout | `getByLabel('Password')` matched zero elements (label is a `<div>`, not `<label for>`) | Switched to `getByPlaceholder('Password')` |
| `LOGIN button becomes enabled` + `wrong credentials` timeout | Page not fully rendered before fill; no `networkidle` wait | Added `await page.waitForLoadState('networkidle')` to all `beforeEach` hooks |
| `REGISTER button becomes enabled` + BUG-015 tests fail | `getByLabel('Password')` strict mode violation — matched both "Password" and "Confirm Password" labels | Added `{ exact: true }` + `.first()` |
| `registration page renders all required form fields` | Same strict mode issue | Same fix |
| BUG-004 hover/detail date comparison — `detailDate` always empty | `textContent()` + string replace returned empty due to mixed text/SVG nodes in container | Switched to CSS class-based locator `.thumbnail__info__text` |

Also confirmed that tests for BUG-002 (footer), BUG-004 (date), BUG-013, BUG-014, BUG-015 blur, and LOGIN disabled are correctly detecting real app bugs and are expected to fail.

**What I changed and why:**
- `playwright/homepage.spec.js` — photo locator, `networkidle` wait
- `playwright/photo-detail.spec.js` — photo locator (`span.thumbnail`), `networkidle` wait, BUG-004 date extraction logic
- `playwright/login.spec.js` — `getByPlaceholder('Password')`, `networkidle` wait
- `playwright/register.spec.js` — `getByLabel('Password', { exact: true }).first()`, `networkidle` wait
- `playwright/search.spec.js` — `networkidle` wait
- `playwright/password-recovery.spec.js` — `networkidle` wait

---

## 2026-03-31 — Fix authenticated test login flow and album management routes

**Tool used:** Claude (claude-sonnet-4-6) + playwright-cli skill

**Exact prompt given:**
> run the test username password thing as well $env:TEST_PASSWORD="lovro123" $env:TEST_USERNAME="haterandoms3456@gmail.com"

**What AI generated:**

Ran the full suite with credentials. All 8 authenticated tests failed at login. Used playwright-cli to investigate the live login flow and discovered:

1. **Login redirects to `/profile/{id}`**, not `/main` — `waitForURL(/main/)` always timed out
2. **Password field has no `placeholder` attribute** — `getByPlaceholder('Password')` failed silently; correct selector is `input[type="password"]`
3. **Album management lives on the profile page**, not `/albums` — route is `/profile/{id}` and shows "Create Album" button
4. **Create Album navigates to `/album/create`**, saves to `/album/{id}` (stays there, no redirect back to profile)

Fixed `authenticated/album-management.spec.js`:
- `beforeEach`: `input[type="password"]`, `waitForURL(/profile\//)`
- "navigate to album management" test: asserts profile URL and "Create Album" button visible
- "can create a new album" test: fills `textbox "Album Name"`, asserts `heading "Almost done!"` after save
- BUG-007 test: checks profile heading is not the literal string "username"

Fixed `authenticated/photo-upload-deletion.spec.js`:
- `beforeEach`: same login fixes
- Added `page.goto('main')` before upload button checks (upload not on profile page)

**Final result with credentials:** 26 passed, 8 failed (all intentional app-bug regressions), 5 skipped

**What I changed and why:**
- `playwright/authenticated/album-management.spec.js` — login fix, correct routes and selectors throughout
- `playwright/authenticated/photo-upload-deletion.spec.js` — login fix, navigate to main before upload

---

<!-- Add entries below using the template:

## [YYYY-MM-DD] — [Task description]

**Tool used:** Claude (claude-sonnet-4-6)

**Exact prompt given:**
> [Copy the exact user prompt here]

**What AI generated:**
[Summary of what was produced — file names, test names, key decisions]

**What I changed and why:**
[Modifications made, or "None — used as-is"]

-->
