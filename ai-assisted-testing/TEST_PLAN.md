# Test Plan — Photo Gallery (Baasic Starterkit)

> Application URL: http://demo.baasic.com/angular/starterkit-photo-gallery/main
> Structured by feature area. Each scenario was identified with AI assistance after live exploration of the application.

---

## Feature: Homepage / Main Gallery

### Scenario 1: Hero section loads with tagline

**Steps:**
1. Open http://demo.baasic.com/angular/starterkit-photo-gallery/main

**Expected result:** The page loads a full-viewport hero image with the text "We are celebrating the vastness of life." and a scroll indicator arrow visible.

**Priority:** Medium

---

### Scenario 2: Photo grid loads below the hero

**Steps:**
1. Open the main URL
2. Scroll down past the hero section

**Expected result:** A grid of photo thumbnails is displayed below the hero. Multiple photos are visible and loaded correctly.

**Priority:** High

---

### Scenario 3: Search input is visible in the header

**Steps:**
1. Open the main URL

**Expected result:** A search input field with placeholder "Search..." is visible in the header area. A search icon (magnifying glass) is present next to it.

**Priority:** Medium

---

### Scenario 4: Logo/Menu link navigates back to main page

**Steps:**
1. Navigate to any non-main page (e.g. Login)
2. Click the logo icon in the top-left corner

**Expected result:** The user is taken back to the main gallery page at `/main`.

**Priority:** Medium

---

## Feature: Photo Search

### Scenario 1: Searching by keyword returns matching photos

**Steps:**
1. Open the main URL
2. Click the search input in the header
3. Type "flower"
4. Press Enter

**Expected result:** The page navigates to `/photo/search/flower`. A heading "Search result for: 'flower'" is shown. A grid of photos matching the keyword is displayed.

**Priority:** High

---

### Scenario 2: Search results page shows heading with the searched term

**Steps:**
1. Search for any term (e.g. "sun")
2. Observe the heading on the results page

**Expected result:** The heading reads exactly: `Search result for: 'sun'`.

**Priority:** Medium

---

### Scenario 3: Searching with no matches shows an empty or no-results state

**Steps:**
1. Click the search input
2. Type a term that is unlikely to match any photo (e.g. "xyzqwertynotexist")
3. Press Enter

**Expected result:** The search results page loads without an error. Either an empty grid is shown or a user-friendly "no results found" message is displayed.

**Priority:** Medium

---

### Scenario 4: Search input clears and a new search returns fresh results

**Steps:**
1. Search for "flower"
2. Navigate back to the main page
3. Search for "sun"

**Expected result:** Results show only photos matching "sun", not "flower". The previous search does not persist.

**Priority:** Low

---

## Feature: Photo Gallery Hover Card

### Scenario 1: Hovering over a gallery photo shows username and date

**Steps:**
1. Open the main URL and scroll down to the photo grid
2. Hover the cursor over any photo thumbnail

**Expected result:** A hover overlay appears on the photo showing the uploader's username and an upload date (in MM/DD/YYYY format). An eye/view icon is also visible.

**Priority:** High

---

### Scenario 2: Date on hover card matches the date on the photo detail page

**Steps:**
1. Hover over any photo and note the date shown on the hover card
2. Click that same photo to open the detail page
3. Note the date shown under "More details" / "Last changed"

**Expected result:** The date is identical in both the hover card and the detail page.

**Priority:** High

---

## Feature: Photo Detail View

### Scenario 1: Clicking a gallery photo opens the detail page

**Steps:**
1. Open the main URL and scroll to the photo grid
2. Click any photo thumbnail

**Expected result:** The page navigates to `/photo/detail/{id}`. The photo is displayed in full size. No 404 error occurs.

**Priority:** High

---

### Scenario 2: Detail page shows photo title and description

**Steps:**
1. Click any photo to open the detail page

**Expected result:** Below the photo, a title (filename or user-given name) is shown. If no description was added, the text "No description available" is shown.

**Priority:** Medium

---

### Scenario 3: Detail page "More details" section shows username and last-changed date

**Steps:**
1. Click any photo to open the detail page
2. Scroll to the "More details" section

**Expected result:** The section shows a user avatar icon with a linked username, and a calendar icon with "Last changed: MM/DD/YYYY".

**Priority:** Medium

---

### Scenario 4: Close button returns to the gallery

**Steps:**
1. Open any photo detail page (either via click or direct URL)
2. Click the X (close) button in the top-right corner

**Expected result:** The photo detail view closes and the user returns to the previous gallery view or the main page.

**Priority:** Medium

---

### Scenario 5: Photo image loads without a 404 error

**Steps:**
1. Click any photo thumbnail in the gallery
2. Observe whether the full-size image loads in the detail view

**Expected result:** The photo image is displayed in the detail view. The image area is not black or blank. No 404 error is recorded in the browser console.

**Priority:** High

---

## Feature: Login

### Scenario 1: Login page renders all expected elements

**Steps:**
1. Navigate to `/login`

**Expected result:** The page shows a "Login" heading, a text input labelled "Username" (placeholder: "Enter your email or username"), a "Password" input, a "LOGIN" button, a "Forgot Your Password? Recover Your Password Here!" link, and a "Social Login" section with four buttons: Facebook, Twitter, Google, GitHub.

**Priority:** High

---

### Scenario 2: Successful login with valid credentials

**Steps:**
1. Navigate to `/login`
2. Enter a valid registered username or email in the Username field
3. Enter the correct password
4. Click LOGIN

**Expected result:** The user is authenticated and redirected. The navigation reflects a logged-in state.

**Priority:** High

---

### Scenario 3: Login fails with incorrect password

**Steps:**
1. Navigate to `/login`
2. Enter a valid registered username
3. Enter a wrong password
4. Click LOGIN

**Expected result:** An error message is shown. The user remains on the login page.

**Priority:** High

---

### Scenario 4: Login fails with an unregistered username

**Steps:**
1. Navigate to `/login`
2. Enter a username that does not exist
3. Enter any password
4. Click LOGIN

**Expected result:** An error message is shown. The user remains on the login page. No user details are leaked.

**Priority:** High

---

### Scenario 5: Login form — empty fields

**Steps:**
1. Navigate to `/login`
2. Leave both Username and Password fields empty
3. Click LOGIN

**Expected result:** The form is not submitted. Validation messages indicate that the fields are required, or the LOGIN button is disabled until both fields are filled.

**Priority:** Medium

---

## Feature: Social Login

### Scenario 1: Social login section is visible on the Login page

**Steps:**
1. Navigate to `/login`
2. Observe the right column

**Expected result:** A "Social Login" heading is present. Four buttons are visible: "Sign in with Facebook", "Sign in with Twitter", "Sign in with Google", "Sign in with Github". No permanent error message is displayed below them.

**Priority:** Medium

---

### Scenario 2: Clicking a social login button does not expose a raw error message to the user

**Steps:**
1. Navigate to `/login`
2. Click any of the four social login buttons (e.g. Facebook)

**Expected result:** Either the browser redirects to the relevant OAuth provider, or a user-friendly message is shown if social login is not configured. A raw JSON error like `"undefined: Social login configuration not found."` must not be visible to the user.

**Priority:** High

---

## Feature: Password Recovery

### Scenario 1: Password recovery page renders all expected elements

**Steps:**
1. Navigate to `/passwordRecovery` (or click "Forgot Your Password?" on the Login page)

**Expected result:** The page shows a "Password Recovery" heading, an "Email" input with placeholder "Enter your email", and a "RECOVER PASSWORD" button. The button is disabled when the email field is empty.

**Priority:** High

---

### Scenario 2: Recover Password button becomes active when email is entered

**Steps:**
1. Navigate to `/passwordRecovery`
2. Type any text into the Email field

**Expected result:** The "RECOVER PASSWORD" button becomes enabled/active.

**Priority:** Medium

---

### Scenario 3: Submitting a valid registered email sends a recovery email

**Steps:**
1. Navigate to `/passwordRecovery`
2. Enter a valid registered email address
3. Click RECOVER PASSWORD

**Expected result:** A success confirmation message is shown (e.g. "Check your email"). A recovery email is sent to the address.

**Priority:** High

---

### Scenario 4: Password reset link in the email opens a working reset page

**Steps:**
1. Complete Scenario 3 above
2. Open the recovery email in a mail client
3. Click the "Set new password" link

**Expected result:** A page opens where the user can enter and confirm a new password. The page does not return a 404 error.

**Priority:** High

---

### Scenario 5: Submitting an unregistered email on the recovery page

**Steps:**
1. Navigate to `/passwordRecovery`
2. Enter an email address that is not registered
3. Click RECOVER PASSWORD

**Expected result:** Either a generic confirmation is shown (to prevent email enumeration), or a clear "no account found" message is displayed. No server error occurs.

**Priority:** Medium

---

## Feature: Registration

### Scenario 1: Registration page renders all expected elements

**Steps:**
1. Navigate to `/register`

**Expected result:** The page shows a "Register" heading, four input fields (Email, Username, Password, Confirm Password), and a "REGISTER" button that is disabled when fields are empty.

**Priority:** High

---

### Scenario 2: REGISTER button becomes active when all fields are filled

**Steps:**
1. Navigate to `/register`
2. Fill in Email, Username, Password, and Confirm Password

**Expected result:** The REGISTER button becomes enabled.

**Priority:** Medium

---

### Scenario 3: Successful registration with valid data

**Steps:**
1. Navigate to `/register`
2. Enter a valid, real email address
3. Enter a unique username
4. Enter a password of 8 or more characters
5. Enter the same password in Confirm Password
6. Click REGISTER

**Expected result:** A success message is shown (e.g. "You have successfully registered, please check your email…"). A verification email is sent to the provided address.

**Priority:** High

---

### Scenario 4: Registration requires email verification before full access

**Steps:**
1. Register with a valid email
2. Without clicking the email verification link, attempt to log in

**Expected result:** The account is inactive or restricted until the email is verified. The user is not granted full access.

**Priority:** Medium

---

### Scenario 5: Registration rejects mismatched passwords

**Steps:**
1. Navigate to `/register`
2. Enter valid values for Email and Username
3. Enter "Password123" in the Password field
4. Enter "Password456" in the Confirm Password field
5. Click REGISTER

**Expected result:** An error message indicates the passwords do not match. The account is not created.

**Priority:** High

---

### Scenario 6: Registration is rejected for an already-registered email

**Steps:**
1. Navigate to `/register`
2. Enter an email address that already has a registered account
3. Fill in valid values for all other fields
4. Click REGISTER

**Expected result:** An error message indicates the email is already in use. No duplicate account is created.

**Priority:** High

---

### Scenario 7: Registration accepts a fake/non-existent email address

**Steps:**
1. Navigate to `/register`
2. Enter a syntactically valid but non-existent email (e.g. `ia0jdpgfpigj@fdkipoasjhnfgda.com`)
3. Enter a unique username
4. Enter matching passwords of 8+ characters
5. Click REGISTER

**Expected result:** Either registration is rejected with a message like "Email address could not be verified", or the account remains inactive until a confirmation link is clicked. The app must not create an active account for an unverified email.

**Priority:** High

---

## Feature: Album Management (post-login)

### Scenario 1: Logged-in user can create a new album

**Steps:**
1. Log in with valid credentials
2. Navigate to the album creation page
3. Enter a title and any required fields
4. Submit the form

**Expected result:** The album is created. A confirmation page is shown with the text "Created by [username] on [date]", where the actual username is filled in — not left blank.

**Priority:** High

---

### Scenario 2: Album creation requires a title

**Steps:**
1. Log in and navigate to the album creation page
2. Leave the title field empty
3. Attempt to submit

**Expected result:** Form validation triggers. The album is not created. An error message indicates the title is required.

**Priority:** Medium

---

### Scenario 3: Albums page lists all albums belonging to the user

**Steps:**
1. Log in and navigate to the Albums page
2. Observe the list of albums

**Expected result:** All albums created by the logged-in user are listed with their thumbnail and title.

**Priority:** High

---

### Scenario 4: Album photo counter displays correct singular/plural grammar

**Steps:**
1. Log in and create an album with exactly 1 photo
2. Navigate to the Albums page
3. Read the counter text below the album thumbnail

**Expected result:** The counter reads "1 photo" (singular), not "1 photos".

**Priority:** Low

---

### Scenario 5: Album photo counter updates when more photos are added

**Steps:**
1. Open an album that contains 1 photo
2. Upload a second photo
3. Navigate back to the Albums page

**Expected result:** The counter now reads "2 photos".

**Priority:** Medium

---

## Feature: Photo Upload (post-login)

### Scenario 1: Uploading a photo makes it visible in the album

**Steps:**
1. Log in and open an album
2. Upload a single photo file
3. Return to the album view

**Expected result:** The uploaded photo appears as a thumbnail in the album.

**Priority:** High

---

### Scenario 2: All uploaded photos are accessible by direct click

**Steps:**
1. Log in and open an album
2. Upload 4 to 5 photos in sequence
3. Return to the album view
4. Click each photo one by one

**Expected result:** Every photo opens successfully when clicked directly. No photo returns a 404 error.

**Priority:** High

---

### Scenario 3: Photos that fail on direct click also fail via arrow navigation

**Steps:**
1. Find a photo that returns 404 when clicked directly from the album grid
2. Enter the album photo viewer via a working photo
3. Navigate left/right to reach the photo that failed on direct click

**Expected result:** Either all photos load correctly regardless of access method, OR all broken photos fail consistently in both access paths. A photo that loads via arrows but returns 404 on direct click indicates a routing bug.

**Priority:** High

---

### Scenario 4: Upload rejects unsupported file types

**Steps:**
1. Log in and open an album
2. Attempt to upload a non-image file (e.g. a `.txt` or `.pdf`)

**Expected result:** The upload is rejected with a user-friendly error message. No server error occurs.

**Priority:** Medium

---

## Feature: Photo Deletion (post-login)

### Scenario 1: Deleting a photo removes it from the album

**Steps:**
1. Log in and open an album
2. Delete a photo
3. Return to the album view

**Expected result:** The deleted photo no longer appears in the album.

**Priority:** High

---

### Scenario 2: Deleted photo name can be reused immediately

**Steps:**
1. Log in and upload a photo with the name "TESTPHOTO"
2. Delete that photo
3. Immediately upload a new photo with the same name "TESTPHOTO"

**Expected result:** The new upload succeeds. No "Name taken" error is shown. No 500 Internal Server Error occurs.

**Priority:** High

---

## Feature: Footer

### Scenario 1: Footer shows the application name, not a placeholder

**Steps:**
1. Navigate to any page (e.g. the main page, login, or register)
2. Scroll to the bottom of the page

**Expected result:** The footer shows the actual application name (e.g. "Copyright @ Baasic Photo Gallery"), not the placeholder text "Blog name". The "Blog name" link does not appear anywhere in the footer.

**Priority:** Low

---

### Scenario 2: Footer "Powered by Baasic" link is functional

**Steps:**
1. Scroll to the footer on any page
2. Click the "Baasic" link

**Expected result:** The link opens http://www.baasic.com/ or navigates to it in a new tab. No broken link or 404 error.

**Priority:** Low

---
