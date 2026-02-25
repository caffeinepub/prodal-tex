# Specification

## Summary
**Goal:** Restrict the Admin Dashboard so only the authorized site owner (identified by their Internet Identity principal) can view inquiries.

**Planned changes:**
- Add a hardcoded authorized principal list in the backend (`backend/main.mo`) corresponding to the owner's Internet Identity account.
- Add an `isAuthorized(caller: Principal): Bool` query function in the backend.
- Update the `getInquiries` backend function to reject calls from unauthorized principals with a clear error/trap.
- Add a one-time `setAuthorizedPrincipal` function (callable only by the canister controller) to allow the owner to register their principal after first login.
- Update `AdminDashboardPage.tsx` to call the authorization check after login and display an "Access Denied" message if the authenticated user is not the authorized owner.
- Ensure unauthenticated users still see the existing login prompt, and no inquiry data is exposed to unauthorized authenticated users.

**User-visible outcome:** Only the site owner logged in via their specific Internet Identity account can access and view the inquiry table on the Admin Dashboard. Any other authenticated user sees an "Access Denied" message instead.
