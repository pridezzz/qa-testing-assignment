# Photo Gallery QA Assignment

[![Playwright Tests](https://github.com/pridezzz/qa-testing-assignment/actions/workflows/playwright.yml/badge.svg)](https://github.com/pridezzz/qa-testing-assignment/actions/workflows/playwright.yml)

## Structure

```
repo/
├── manual-testing/           # Manual bug reports and screenshots
│   ├── BUG_REPORT.md         # BUG-001 – BUG-010
│   └── screenshots/
├── ai-assisted-testing/      # AI-assisted artefacts
│   ├── TEST_PLAN.md           # 37 test scenarios across 12 features
│   ├── AUTOMATION_ANALYSIS.md # Per-feature automation recommendation
│   ├── ADDITIONAL_BUGS.md     # BUG-011 – BUG-016 (AI-assisted)
│   └── AI_PROCESS_LOG.md      # Log of every AI interaction (planning phase)
├── automation/               # Playwright test suite
│   ├── playwright.config.js
│   ├── package.json
│   ├── AI_AUTOMATION_LOG.md   # Log of every AI interaction (automation phase)
│   └── playwright/
│       ├── homepage.spec.js
│       ├── search.spec.js
│       ├── photo-detail.spec.js
│       ├── login.spec.js
│       ├── register.spec.js
│       ├── password-recovery.spec.js
│       └── authenticated/
│           ├── album-management.spec.js
│           └── photo-upload-deletion.spec.js
└── ai-tooling/
    └── .claude/
        └── CLAUDE.md          # Project instructions for Claude
```

## Running Automated Tests

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
cd automation
npm install
npx playwright install
```

### Run all tests (unauthenticated)

**bash / macOS / Linux:**
```bash
npm test
```

**PowerShell (Windows):**
```powershell
npm test
```

### Run tests including authenticated flows

Authenticated tests (album management, photo upload/deletion) require a valid account on the demo app.

**bash / macOS / Linux:**
```bash
TEST_USERNAME="your@email.com" TEST_PASSWORD="yourpassword" npm test
```

**PowerShell (Windows):**
```powershell
$env:TEST_USERNAME="your@email.com"
$env:TEST_PASSWORD="yourpassword"
npm test
```

> Authenticated tests auto-skip cleanly when the variables are not set — the rest of the suite still runs.

### View HTML report

```bash
npx playwright show-report
```

### Run with interactive UI

```bash
npx playwright test --ui
```

## Expected Test Results

| Status | Count | Reason |
|--------|-------|--------|
| Passed | 29 | Feature works correctly |
| Failed | 8 | Regression tests documenting **known app bugs** (BUG-002 ×4, BUG-004, BUG-013, BUG-014, and Login disabled-state bug) |
| Skipped | 2 | Delete test skips when no user-owned photos exist; social-login test skips if no buttons present |

Failures are **intentional** — they will pass once the corresponding bugs are fixed in the application.
