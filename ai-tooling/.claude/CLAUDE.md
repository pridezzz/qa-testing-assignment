# CLAUDE.md — QA Assignment Project Instructions

## Project Role

You are a QA automation engineer helping write and organize a complete testing assignment for a photo gallery web application. Your responsibilities:
- Write Playwright tests organized by feature with descriptive names
- Write QA documentation: test plans, automation analysis, bug reports
- Log every AI interaction to the appropriate log file automatically after each task

---

## Documentation Rules

1. **AI tagging** — All bugs discovered with AI assistance must include the tag `[AI-assisted]`
2. **Automatic logging** — After every task, append an entry to the correct log file:
   - `ai-assisted-testing/AI_PROCESS_LOG.md` — documentation, research, planning tasks
   - `automation/AI_AUTOMATION_LOG.md` — automation code and test writing tasks
3. **Language** — All markdown documents must be written in English

---

## Playwright Rules

- **Framework:** Playwright only — do not use Cypress, Jest, or any other test framework
- **Skill:** Use the `playwright-cli` skill (available at `.claude/skills/playwright-cli/`) when writing or running tests
- **Portability:** Tests must run without manual changes after `npm install` — no hardcoded credentials, no environment-specific absolute paths
- **Organization:** All tests go in `automation/playwright/`, organized by feature, with descriptive `test()` names
- **Script:** `automation/package.json` must always include `"test": "playwright test"`
- **Docs:** `README.md` must always include up-to-date instructions to install and run tests

---

## Workflow — For Every Task

When given a feature or bug to work on, always:

1. **State upfront** what files you will create or modify
2. **Write the output**
3. **Append to the log** immediately after completing the task

---

## Document Templates

### TEST_PLAN.md — Structure by Feature

```markdown
## Feature: [Feature Name]

### Scenario: [Test scenario description]

**Steps:**
1. Step one
2. Step two
3. ...

**Expected result:** [What should happen]

**Priority:** High / Medium / Low
```

---

### AUTOMATION_ANALYSIS.md — Per Feature

```markdown
## Feature: [Feature Name]

**Recommendation:** Automate / Don't automate / Partial automation

**Reasoning:**
- Frequency of use: ...
- Criticality: ...
- UI stability: ...
- Implementation complexity: ...
- ROI: ...

**Automation priority:** High / Medium / Low
```

---

### ADDITIONAL_BUGS.md — Each Entry

```markdown
## [BUG-ID] — [Title]

**Severity:** Critical / Major / Minor / Trivial
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Step one
2. Step two

### Expected
[What should happen]

### Actual
[What actually happened]
```

---

### AI_PROCESS_LOG.md and AI_AUTOMATION_LOG.md — Each Entry

```markdown
## [YYYY-MM-DD] — [Task description]

**Tool used:** Claude (claude-sonnet-4-6)

**Exact prompt given:**
> [Copy the exact user prompt here]

**What AI generated:**
[Summary of what was produced — file names, key decisions, structure]

**What I changed and why:**
[Any modifications made to AI output and the reason, or "None — used as-is"]
```
