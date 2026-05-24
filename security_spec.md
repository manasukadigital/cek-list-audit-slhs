# Security Spec: Audit Collection

## 1. Data Invariants
- An audit cannot exist without a valid userId that corresponds to the creator.
- Users can only create and read their own audits.
- The `totalPenalty` must be a number.
- `createdAt` must match the server timestamp during creation.
- Once created, audits cannot be modified (immutable) or deleted, to preserve audit integrity.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Create:** Attempt to create an audit without being signed in.
2. **Spoofed User ID:** Attempt to create an audit where `userId` does not match `request.auth.uid`.
3. **Invalid Golongan:** Attempt to create an audit with a `golongan` other than "A", "B", or "C".
4. **Missing Required Field:** Attempt to create an audit missing `namaSPPG`.
5. **Ghost Field:** Attempt to create an audit with an unexpected field (e.g., `isVerified: true`).
6. **Incorrect Type:** Attempt to create an audit where `totalPenalty` is a string instead of a number.
7. **Client Timestamp:** Attempt to create an audit with a client-provided `createdAt` instead of `request.time`.
8. **Unauthorized Read:** Attempt to read an audit where `userId` is not `request.auth.uid`.
9. **Blanket List Read:** Attempt to list audits without specifying a `where('userId', '==', uid)` clause.
10. **Unauthorized Update:** Attempt to update an existing audit.
11. **Unauthorized Delete:** Attempt to delete an existing audit.
12. **Oversized String:** Attempt to provide a `namaSPPG` or `alamatSPPG` over 1000 characters.

## 3. Test Runner
Will be implemented in `firestore.rules.test.ts`.
