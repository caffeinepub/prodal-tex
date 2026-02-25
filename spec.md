# Specification

## Summary
**Goal:** Fix the admin dashboard inquiries table that shows a "refresh the page" message instead of displaying submitted inquiries.

**Planned changes:**
- Diagnose and fix the `useGetAllInquiries` React Query hook in `useQueries.ts` so it correctly calls the backend actor's `getInquiries` function and returns the inquiry array
- Fix the backend `getInquiries` function in `backend/main.mo` to return all stored inquiries without errors or access-control rejections
- Ensure Motoko Result/variant responses are properly unwrapped in the frontend
- Show a loading skeleton while the query is in flight
- Show an empty-state message only when zero inquiries exist, not on fetch errors
- Replace the generic "refresh the page" fallback with a descriptive error message on actual errors

**User-visible outcome:** After logging in with the admin password, submitted inquiries are displayed correctly in the table. Loading, empty, and error states each show appropriate feedback.
