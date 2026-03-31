# Additional Bugs — AI-Assisted Discovery

> Bugs found with AI assistance during live exploration of the application.
> All entries are tagged [AI-assisted].
> IDs continue from the last manual bug: BUG-010.

---

## BUG-011 — Password Recovery form displays `[object Object]` as error message

**Severity:** Major
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to `/passwordRecovery`
2. Enter any email address (registered or not) in the Email field
3. Click RECOVER PASSWORD

### Expected
A user-friendly message is shown, e.g.:
- If the email is registered: "A recovery email has been sent. Please check your inbox."
- If the email is not registered: "No account found for that email address." or a generic security-safe message

### Actual
A red error message appears below the Email field reading literally:

> `[object Object]`

This is a raw JavaScript object serialisation. The Angular component received an error response object from the API but called `.toString()` on it instead of reading a `.message` or `.error_description` property. The rendered text is meaningless to the user, gives no guidance on what went wrong, and reveals that the frontend code has an unhandled error path.

### Screenshot evidence
Captured during automated exploration session on 2026-03-31.

---

## BUG-012 — Page `<title>` is always "baasic-starterkit-angular-blog" on every page

**Severity:** Minor
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to any page in the application:
   - Main gallery: `/main`
   - Login: `/login`
   - Register: `/register`
   - Password Recovery: `/passwordRecovery`
   - Photo Detail: `/photo/detail/{id}`
   - Search Results: `/photo/search/flower`
2. Check the browser tab title or `document.title`

### Expected
Each page has a descriptive, context-appropriate title that reflects the current view, e.g.:
- "Login — Photo Gallery"
- "Register — Photo Gallery"
- "Search results for 'flower' — Photo Gallery"

### Actual
Every page shows the same developer placeholder title:
> `baasic-starterkit-angular-blog`

This title never changes regardless of which page is loaded. Users with multiple tabs open cannot distinguish between them. The value is a starter kit package name, not a product name. This also harms SEO and breaks browser history readability.

---

## BUG-013 — Search results heading uses "result" (singular) regardless of how many photos are returned

**Severity:** Trivial
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to the main page
2. Type "flower" in the search input
3. Press Enter
4. Read the heading on the search results page

### Expected
When more than one result is returned, the heading should read:
> `Search results for: 'flower'`

### Actual
The heading always reads:
> `Search result for: 'flower'`

The word "result" is always singular even when the page is displaying nine or more photos. This is the same class of error as BUG-008 (plural/singular grammar), appearing in a different feature.

---

## BUG-014 — No-results search message has a grammar error and omits the searched term

**Severity:** Trivial
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to the main page
2. Search for a term that has no matching photos (e.g. `xyzqwertynotexist`)
3. Press Enter
4. Read the message shown on the results page

### Expected
A grammatically correct message that includes the searched term, e.g.:
> `There are no photos that match the search term 'xyzqwertynotexist'.`

### Actual
The message displayed is:
> `There are no photos that matches search term.`

Two problems:
1. **Subject-verb agreement error**: "photos that matches" is grammatically incorrect; "match" is the correct form for a plural subject.
2. **Missing search term**: The message does not include what was searched for, so the user cannot confirm whether they made a typo or the term genuinely returned no results.

---

## BUG-015 — Registration: REGISTER button remains enabled and password mismatch error only shows after submit, not on field blur

**Severity:** Minor
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to `/register`
2. Fill in Email, Username, and Password with valid values
3. Type a **different** value in the Confirm Password field
4. Click anywhere outside the Confirm Password field (blur it)
5. Observe whether an error appears
6. Observe the state of the REGISTER button
7. Click REGISTER

### Expected
- An inline "Passwords do not match" error should appear as soon as the user leaves the Confirm Password field (on blur), before they attempt to submit
- The REGISTER button should remain disabled while passwords do not match

### Actual
- No error is shown when the user blurs the Confirm Password field
- The REGISTER button is enabled (clickable) while passwords do not match
- The error "Passwords do not match." only appears **after** the user clicks REGISTER

This creates a confusing UX: the form looks valid and submittable, but clicking the button produces an error and does nothing. Users filling in forms quickly may click REGISTER multiple times before noticing the error.

---

## BUG-016 — "Confirm Password" field has a show/hide toggle but "Password" field does not

**Severity:** Trivial
**Tag:** [AI-assisted]

### Steps to Reproduce
1. Navigate to `/register`
2. Fill in the Password field with any text
3. Fill in the Confirm Password field with any text
4. Observe both fields

### Expected
Both "Password" and "Confirm Password" are password fields. If a show/hide visibility toggle is provided for one, it should be provided for both consistently.

### Actual
The "Confirm Password" field displays an eye icon (👁) on the right side that allows the user to reveal the entered text. The "Password" field has no such toggle. A user who wants to verify what they typed in the main Password field has no way to do so, while the same capability exists on the confirmation field directly below it.

---
