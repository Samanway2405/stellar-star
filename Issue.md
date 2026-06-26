# Open Source Contribution Issues

These issues are written for GitHub issue creation and start from issue count 2 as requested. They are based on the current Stellar-star platform codebase. Validation checked locally: TypeScript passes, Jest passes, lint passes, and production build passes.

## Issue #2: Repair corrupted Unicode text in documentation and UI copy

**Directory:** `README.md`, `docs/`, `app/`, `components/`, `scripts/`
**Repo Avatar** [Soumen1080/stellar-star](https://github.com/Soumen1080/stellar-star)
**Type:** Bug, documentation

**Description:** Several files contain mojibake/corrupted UTF-8 text where dashes, check marks, arrows, and ellipses render as broken character sequences. Some of this appears in README content, comments, button labels, placeholders, toast messages, and script output. This makes the project look broken on GitHub and can also leak into visible UI text.

**Expected outcome:** All documentation and user-facing text should render as clean English text with correct punctuation and symbols.

**Acceptance criteria:**
- README and docs render correctly on GitHub.
- App labels, placeholders, toasts, and payment status text no longer show corrupted characters.
- A contributor can run `npm.cmd test -- --runInBand` and `npm.cmd run build` successfully after the cleanup.

## Issue #3: Add the missing `.env.local.example` file

**Directory:** Project root, `README.md`, `docs/`

**Type:** Developer experience

**Description:** The README tells users to copy `.env.local.example` into `.env.local`, but the repository does not currently include `.env.local.example`. New contributors must manually infer required environment variables from README and docs, which slows setup and increases configuration mistakes.

**Expected outcome:** The repository should include a safe example environment file with placeholders for all required public variables.

**Acceptance criteria:**
- Add `.env.local.example` with Stellar, Soroban, Supabase, and app metadata keys.
- Ensure the file contains no real private credentials.
- Update README setup instructions if any variable names change.

## Issue #4: Add the missing Open Graph image referenced in metadata

**Directory:** `app/`, `public/`

**Type:** Bug, SEO

**Description:** `app/layout.tsx` references `/og-image.png` for Open Graph and Twitter previews, but the file is not present in `public/`. Shared links may show a broken preview image or fall back to generic metadata.

**Expected outcome:** Social previews should show a valid Stellar-star branded image.

**Acceptance criteria:**
- Add `public/og-image.png` at 1200x630.
- Confirm `app/layout.tsx` metadata points to the correct asset.
- Verify the production build still passes.

## Issue #5: Align project branding and live URLs across the repository

**Directory:** `README.md`, `docs/`, `app/`, `package.json`

**Type:** Documentation, product polish

**Description:** The repository uses multiple names and URLs: `Stellar-star`, `SettleX`, package name `settlex`, a README demo URL, a different deployment proof URL, and an old fallback URL in `app/layout.tsx`. This can confuse contributors, users, and reviewers about the canonical project identity and deployment.

**Expected outcome:** The project should use one canonical name and one canonical production/demo URL everywhere.

**Acceptance criteria:**
- Pick the canonical product name and demo URL.
- Update README, docs, metadata, package name if desired, and release checklist references.
- Ensure no old deployment URL remains unless it is intentionally documented as historical proof.

## Issue #6: Migrate away from deprecated `next lint`

**Directory:** `package.json`, `.github/workflows/`

**Type:** Maintenance

**Description:** `npm.cmd run lint` passes, but Next.js reports that `next lint` is deprecated and will be removed in Next.js 16. The current lint script and CI workflows depend on this deprecated command.

**Expected outcome:** Linting should use the ESLint CLI directly and remain compatible with future Next.js releases.

**Acceptance criteria:**
- Update the lint script to use ESLint CLI.
- Add or update ESLint config if needed.
- Update CI workflow commands.
- Confirm lint, test, typecheck, and build all pass.

## Issue #7: Make multi-wallet support real in the wallet connection flow

**Directory:** `context/`, `lib/stellar/`, `components/wallet/`

**Type:** Feature, wallet UX

**Description:** The platform advertises Freighter, xBull, and Lobstr support, and `lib/stellar/walletsKit.ts` contains multiple wallet adapters. However, `WalletContext` first checks `isFreighterInstalled()`, uses Freighter network helpers, and stores `FREIGHTER_ID` after connection. This can block or mislabel non-Freighter wallets.

**Expected outcome:** Users should be able to connect each supported wallet without being forced through Freighter-specific checks.

**Acceptance criteria:**
- Remove the Freighter-only install gate from the generic connect path.
- Store the actual selected wallet ID.
- Use wallet-specific address/signing/network behavior where supported.
- Add tests or manual QA notes for Freighter, xBull, and Lobstr paths.

## Issue #8: Block duplicate member wallet addresses during form submission

**Directory:** `components/expenses/`, `components/trips/`, `lib/split/`

**Type:** Bug, validation

**Description:** `ExpenseForm` shows an inline warning when two members use the same wallet address, but the `validate()` function does not block submission for duplicates. `TripForm` does not appear to enforce uniqueness either. Duplicate wallets can create confusing payer/member roles, hidden pay buttons, or invalid settlement logic.

**Expected outcome:** Each member in an expense or trip should have a unique Stellar wallet address.

**Acceptance criteria:**
- Add duplicate wallet validation in `ExpenseForm`.
- Add duplicate wallet validation in `TripForm`.
- Treat addresses case-insensitively after trimming.
- Add tests for duplicate wallet rejection.

## Issue #9: Replace regex-only Stellar address validation with SDK validation

**Directory:** `lib/split/`, `components/trips/`, `components/expenses/`

**Type:** Bug, validation

**Description:** Stellar address validation currently uses a regex that checks shape only. A string can match `G[A-Z2-7]{55}` and still fail StrKey checksum validation. Invalid but regex-shaped addresses may be accepted and then fail later during payment creation.

**Expected outcome:** Address validation should use canonical Stellar SDK validation.

**Acceptance criteria:**
- Use `StrKey.isValidEd25519PublicKey` or the current SDK equivalent.
- Reuse one shared validation helper across expense and trip forms.
- Update unit tests to include invalid checksum cases.

## Issue #10: Persist pending on-chain record retries across page refreshes

**Directory:** `hooks/`, `context/`, `lib/stellar/`

**Type:** Reliability

**Description:** `usePayment` stores `pendingOnChain` only in component state. If the XLM transfer succeeds but contract recording fails, refreshing the page removes the retry information. The user may see the share as paid in Supabase but lose the easiest way to complete the Soroban record.

**Expected outcome:** Partial-success payments should remain recoverable after refresh, navigation, or browser restart.

**Acceptance criteria:**
- Persist pending on-chain record data in a durable place such as Supabase or localStorage scoped by wallet.
- Show a retry action when pending records are detected.
- Clear the pending record after successful contract recording.
- Add tests for retry-state restoration.

## Issue #11: Verify payment transaction details before accepting `txHash` as settlement proof

**Directory:** `hooks/`, `lib/stellar/`, `contract/`, `docs/`

**Type:** Security, blockchain integrity

**Description:** The architecture docs note that `record_payment` stores the provided `tx_hash` and relies on app flow integrity. The contract does not verify that the hash corresponds to a real payment with the expected payer, member, amount, asset, and destination. This creates a gap between "recorded" and "cryptographically verified payment".

**Expected outcome:** Settlement proof should be tied to an actual Stellar payment matching the expense share.

**Acceptance criteria:**
- Add an off-chain verifier or an improved protocol design.
- Verify source, destination, asset, amount, memo, and ledger status before recording settlement.
- Document the trust boundary clearly.
- Add tests for mismatched transaction hash rejection.

## Issue #12: Expose or redesign the internal pool-credit prerequisite

**Directory:** `hooks/`, `lib/stellar/`, `contract/`, `components/payment/`

**Type:** UX, smart contract integration

**Description:** The payment flow prechecks internal pool credits before recording on-chain settlement, but the app does not provide a user-facing way to deposit or understand pool balance. A normal successful XLM transfer can become `partial_success` because the internal pool balance is too low.

**Expected outcome:** Users should understand and satisfy contract prerequisites before payment, or the pool-credit model should be redesigned.

**Acceptance criteria:**
- Show pool balance and shortfall before attempting on-chain recording.
- Provide a supported deposit/admin-credit flow, or remove the pool dependency from user settlement.
- Update docs to explain the current model.
- Add integration tests for enough balance, insufficient balance, and retry paths.

## Issue #13: Improve net-settlement payment mapping back to individual shares

**Directory:** `components/trips/`, `lib/settlement/`, `context/`

**Type:** Bug, settlement logic

**Description:** The Settle Up tab computes optimized net payments, then marks matching unpaid shares as paid by comparing member names and payer names. A single net payment can represent multiple expenses, and name-based matching can mark the wrong shares if names repeat or if the net amount only partially covers multiple debts.

**Expected outcome:** Net-settlement payments should map deterministically to the exact expense shares they settle.

**Acceptance criteria:**
- Track source expense/share IDs in the net-settlement calculation.
- Avoid name-only matching.
- Ensure the total marked-paid amount equals the payment amount.
- Add unit tests for duplicate names and multi-expense net payments.

## Issue #14: Match on-chain events by expense and amount, not only member wallet

**Directory:** `hooks/`, `lib/stellar/`, `components/trips/`

**Type:** Bug, blockchain sync

**Description:** `SettlementSummary` builds a set of on-chain confirmed members and marks a net payment as on-chain if the debtor wallet appears in any event. This is too broad. A member could have one on-chain event for a different expense while another settlement row is still unpaid.

**Expected outcome:** On-chain status should match the exact trip, expense, member, and amount being displayed.

**Acceptance criteria:**
- Include exact payment identifiers when comparing events to UI rows.
- Avoid marking unrelated rows as on-chain.
- Add parser and UI tests for multiple events from the same member.

## Issue #15: Add owner-aware delete controls for trips

**Directory:** `components/trips/`, `app/trips/`, `context/`

**Type:** Bug, authorization UX

**Description:** Expense cards hide delete controls unless the connected wallet is the payer. Trip cards show a delete button for every viewer, while the Supabase RLS policy only allows the creator to delete. Non-creators can click delete and may see confusing failure/fallback behavior.

**Expected outcome:** Trip delete controls should follow the same owner-aware UX as expenses.

**Acceptance criteria:**
- Pass the connected wallet into `TripCard`.
- Hide or disable delete for non-creators.
- Show clear feedback if deletion is denied.
- Add tests or manual QA notes for creator and non-creator users.

## Issue #16: Scope localStorage fallback data by wallet address

**Directory:** `context/`, `lib/utils/`

**Type:** Privacy, data consistency

**Description:** Trips, expenses, and user data are cached under global keys such as `StellarStar:expenses` and `StellarStar:trips`. If Supabase fails after switching wallets, one wallet may see stale cached data created by another wallet in the same browser.

**Expected outcome:** Offline/cache fallback data should be isolated per connected wallet.

**Acceptance criteria:**
- Include wallet address in cache keys or cache payload metadata.
- Clear or ignore cache when the connected wallet changes.
- Add tests for wallet switch behavior.
- Keep a safe empty state when cache does not belong to the active wallet.

## Issue #17: Use provider loading and error states on dashboard, expenses, and trips pages

**Directory:** `app/`, `context/`, `components/ui/`

**Type:** UX

**Description:** `TripContext` and `ExpenseContext` expose `isLoading`, but main pages mostly render empty states based only on array length. During initial load or Supabase fallback, users may briefly see "No expenses yet" or "No trips yet" even when data is still loading.

**Expected outcome:** Pages should clearly distinguish loading, empty, offline fallback, and error states.

**Acceptance criteria:**
- Render a loading state while providers are fetching.
- Show a clear offline/fallback notice when local cache is used.
- Avoid misleading empty states before loading completes.
- Add component tests for loading and empty-state transitions.

## Issue #18: Replace spoofable wallet-header authentication with signed wallet proof

**Directory:** `lib/supabase/`, `context/`, `supabase-setup.sql`

**Type:** Security

**Description:** Supabase RLS policies rely on `current_setting('request.headers')` and an `x-wallet-address` header created by the client. A malicious client can spoof this header unless there is a signed challenge or trusted server component verifying wallet ownership.

**Expected outcome:** Database access should be based on verifiable wallet ownership, not a client-provided address string alone.

**Acceptance criteria:**
- Add wallet signature challenge flow for sign-in/sign-up.
- Store and verify a session or token tied to the wallet address.
- Update RLS policies to rely on verified identity.
- Document the security model and migration path.

## Issue #19: Add Playwright end-to-end and mobile viewport tests

**Directory:** `__tests__/`, `app/`, `components/`, `.github/workflows/`

**Type:** Testing

**Description:** Current Jest coverage is useful, but there are no browser end-to-end tests for the main flows. The docs already recommend Playwright mobile viewport assertions. Important flows like connect wallet prompts, creating expenses, trip detail navigation, QR display, and responsive layout need browser-level coverage.

**Expected outcome:** Core user journeys should be covered by automated browser tests.

**Acceptance criteria:**
- Add Playwright setup.
- Cover landing, auth prompt, dashboard, expenses, trips, and trip detail pages.
- Include at least one mobile viewport test.
- Add the Playwright job to CI or document how to run it locally.

## Issue #20: Expand contract deployment script to deploy and initialize both contracts

**Directory:** `scripts/`, `contract/`, `docs/`

**Type:** DevOps, smart contract operations

**Description:** `scripts/deploy-contract.sh` deploys one contract and prints `NEXT_PUBLIC_CONTRACT_ID`. The current architecture requires both the settlement contract and pool contract, plus initialization and proof links. Manual steps increase deployment mistakes and stale docs.

**Expected outcome:** Contract deployment should automate the full settlement and pool setup.

**Acceptance criteria:**
- Build and deploy settlement and pool contracts.
- Initialize pool and settlement references.
- Print all contract IDs and transaction links.
- Update README/runbook instructions to match the script.

## Issue #21: Add mobile proof assets and documentation link validation

**Directory:** `public/`, `README.md`, `docs/`, `.github/workflows/`

**Type:** Documentation, CI

**Description:** The requirement matrix still lists the mobile screenshot as pending manual capture. The docs also include several external proof links and demo URLs that can drift over time. Contributors need a clear task to keep proof assets current.

**Expected outcome:** README proof assets and links should stay complete and verifiable.

**Acceptance criteria:**
- Add a current mobile viewport screenshot under `public/`.
- Reference the screenshot from README.
- Add a lightweight link/proof checker script or CI job.
- Update the requirement matrix from pending to complete after the asset is added.

## Issue #22: Unfunded accounts cannot read contract state (is_paid, get_payments) due to Horizon account loading failure

**Directory:** `lib/stellar/contract.ts`

**Type:** Bug, Developer Experience

**Description:** Read-only contract queries (such as checking if an expense is paid or retrieving a list of payments) fail for unfunded Stellar accounts because the helper functions invoke `loadAccount(callerPublicKey)` to fetch account details. Horizon returns a 404 error if the address has not been funded yet, completely blocking status checks.

**Expected outcome:** Read-only queries should not fail for unfunded accounts.

**Acceptance criteria:**
- Query functions like `checkIsPaid` and `getContractPayments` should bypass account loading or use a fallback funded transaction fee account to simulate transactions.
- New/unfunded accounts can query their settlement status.
- Integration tests check queries with mock unfunded addresses.

## Issue #23: Realtime database subscription uses unauthenticated supabase client instead of wallet-authenticated client

**Directory:** `context/ExpenseContext.tsx`, `context/TripContext.tsx`

**Type:** Bug, Security

**Description:** Realtime database subscriptions use the root `supabase` client instead of the authenticated client created by `createAuthenticatedClient(publicKey)`. Under active RLS policies, unauthenticated subscriptions are rejected or receive no updates, leaving the UI stale until a reload.

**Expected outcome:** Realtime subscriptions should use the authenticated client when a wallet is connected.

**Acceptance criteria:**
- Re-initialize realtime database channel listeners using the authenticated client when `publicKey` changes.
- Unsubscribe from old channels to prevent leaks.
- Verify updates propagate dynamically when RLS policies are enabled.

## Issue #24: Performance issues and memory leaks from instantiating a new SupabaseClient on every authenticated request

**Directory:** `lib/supabase/client.ts`, `context/ExpenseContext.tsx`, `context/TripContext.tsx`

**Type:** Performance, Maintenance

**Description:** `createAuthenticatedClient` calls `createClient` on every single invocation, returning a new instance. Every time a context creates, updates, or settles a trip/expense, a new client instance is created. This wastes system resources and leaks WebSocket connections.

**Expected outcome:** Authenticated Supabase clients should be cached and reused.

**Acceptance criteria:**
- Store/cache the authenticated client instance scoped by the active wallet address.
- Clear the client cache on disconnect.
- Verify that only one client instance exists per active session.

## Issue #25: Memo text is not truncated in `buildQRPaymentURI`, causing transaction errors in external wallets

**Directory:** `lib/qr/generator.ts`

**Type:** Bug, UX

**Description:** The `buildQRPaymentURI` helper includes the raw `memo` string in the SEP-0007 query parameters without byte-length verification or truncation. If an expense title is long, the URL query parameter contains a memo text exceeding 28 bytes, which causes external wallets (like Lobstr or xBull) to crash or reject the transaction during scanning.

**Expected outcome:** Memo text should be safely truncated to a maximum of 28 bytes before constructing the QR URI.

**Acceptance criteria:**
- Implement UTF-8 byte-aware truncation in `buildQRPaymentURI` to limit the memo to 28 bytes.
- Add unit tests validating that long emojis and strings are truncated without producing invalid UTF-8 sequences.

## Issue #26: String `slice(0, 28)` in `PaymentRow` and `SettlementSummary` can split multi-byte characters, resulting in invalid memo encoding

**Directory:** `components/expenses/PaymentRow.tsx`, `components/trips/SettlementSummary.tsx`

**Type:** Bug, Internationalization

**Description:** Slicing the memo to 28 characters using JavaScript's `.slice(0, 28)` is unsafe if the string contains multi-byte UTF-8 characters (like emojis or special glyphs) near the index boundary. This can cut a character in half, creating invalid UTF-8 strings that cause Horizon to reject transaction submissions.

**Expected outcome:** Use a byte-length aware truncation helper to prepare safe on-chain memo strings.

**Acceptance criteria:**
- Replace string `.slice` with a byte-aware truncation helper (similar to `trimToMemoBytes` in transaction builder).
- Test with multi-byte characters at the boundary (e.g. 🍔 emojis).

## Issue #27: Net settlement transactions are not recorded on-chain, creating a mismatch between blockchain status and Supabase state

**Directory:** `components/trips/SettlementSummary.tsx`

**Type:** Bug, Architecture Mismatch

**Description:** When users click "Pay" in the "Settle Up" tab, the transaction is submitted directly to the Stellar network as a value transfer, but the Soroban smart contract is never invoked to record the settlement proof. This results in the database and UI displaying a settled status that is completely missing from the blockchain audit trail.

**Expected outcome:** Net settlements should record their status on-chain.

**Acceptance criteria:**
- Integrate smart contract recording in the "Settle Up" transaction flow.
- Update the database and UI to only mark net-shares as paid on-chain after successful contract simulation and submission.
- Handle partial contract recording errors gracefully.

## Issue #28: No database-level validation to ensure the sum of expense shares matches `total_amount`

**Directory:** `supabase-setup.sql`

**Type:** Database Integrity, Security

**Description:** The `expenses` table does not enforce that the sum of amounts within the JSONB `shares` array equals the `total_amount`. A client bug or direct API mutation can insert an expense where the split shares are inconsistent with the total cost.

**Expected outcome:** Database constraints or triggers should ensure transactional consistency between the total bill and individual shares.

**Acceptance criteria:**
- Add a PostgreSQL database trigger or CHECK constraint to validate that the sum of all `amount` values in the `shares` JSONB array equals the parsed numeric value of `total_amount`.
- Test that invalid entries are rejected by Supabase.

## Issue #29: Inconsistency between `member_wallets` array and the actual `members` JSONB array on table insertion/update

**Directory:** `supabase-setup.sql`

**Type:** Database Integrity

**Description:** RLS policies rely on the `member_wallets` text array to restrict read/write access. However, there is no database-level assertion ensuring that the addresses listed in the `member_wallets` array match the actual wallet addresses stored inside the `members` or `shares` JSONB arrays, leading to potential data drift or security bypasses.

**Expected outcome:** Database schema should guarantee consistency between member lists and RLS access arrays.

**Acceptance criteria:**
- Implement a PostgreSQL trigger function that automatically syncs the `member_wallets` array from the `members` JSONB field on insert/update, or validates they are identical.
- Confirm RLS remains functional and secure.

## Issue #30: Suboptimal performance of RLS select policies utilizing JSONB array expansion (`jsonb_array_elements`)

**Directory:** `supabase-setup.sql`

**Type:** Performance, Database Tuning

**Description:** The select policy `"Members can view their expenses"` expands the `shares` JSONB array using `jsonb_array_elements` for every single row scanned. On large tables, this causes massive CPU usage and prevents index usage.

**Expected outcome:** RLS queries should run in logarithmic time by utilizing indexes.

**Acceptance criteria:**
- Rephrase the select policy to query the `member_wallets` column exclusively (which is indexed using GIN) instead of checking individual shares via `jsonb_array_elements`.
- Verify performance improvements using `EXPLAIN ANALYZE`.

## Issue #31: Immediate deletion of trips on clicking delete button without any confirmation prompt

**Directory:** `components/trips/TripCard.tsx`

**Type:** UX

**Description:** Clicking the "Delete" button on a trip card deletes the trip immediately. Because there is no verification modal, users risk losing all trip details and linked expenses due to a single misclick.

**Expected outcome:** Users must confirm their intention before any destructive delete action.

**Acceptance criteria:**
- Display a confirmation modal when the delete button is pressed.
- Only call `onDelete` after explicit user confirmation.
- Add tests/manual QA checklist verification.

## Issue #32: No option to disconnect or switch wallets in the Authentication page once connected

**Directory:** `app/auth/page.tsx`

**Type:** UX, Wallet Connection Flow

**Description:** In the authentication screen (`/auth`), once a wallet is connected, the signup/signin forms are rendered. However, there is no option to disconnect or switch the active wallet from this interface, trapping the user unless they manually clear their extension session.

**Expected outcome:** Provide a clear "Disconnect" button to reset the wallet connection state.

**Acceptance criteria:**
- Add a "Disconnect Wallet" or "Switch Wallet" button in the connected state view of the auth page.
- Clear local storage cache and state on click.

## Issue #33: Relative hash links in Header are broken on subpages (Dashboard, Expenses, Trips)

**Directory:** `components/layout/Header.tsx`

**Type:** Bug, Routing

**Description:** The navigation links in the header are set as relative hashes (e.g., `#features`). If a user is on `/dashboard` and clicks these, Next.js tries to find the elements on the dashboard page instead of returning to the home page, resulting in broken navigation.

**Expected outcome:** Navigation links should work from any route.

**Acceptance criteria:**
- Convert relative hash links to absolute home page links (e.g. `/#features`, `/#pricing`).
- Verify clicking the links from dashboard correctly redirects to the homepage and scrolls to the selected anchor.

## Issue #34: The `useBalance` hook abort trigger is a no-op because it is not passed to the underlying `getXLMBalance` function

**Directory:** `hooks/useBalance.ts`, `lib/stellar/getBalance.ts`

**Type:** Bug, Resource Efficiency

**Description:** In `useBalance.ts`, the hook registers an `AbortController` in `useEffect` and calls `.abort()`. However, `getXLMBalance` does not receive or forward the `AbortSignal` to the fetch API, meaning requests are never canceled, leading to memory overhead and potential state race conditions.

**Expected outcome:** Fetch requests should be abortable to prevent race conditions.

**Acceptance criteria:**
- Update `getXLMBalance` to accept an optional `AbortSignal`.
- Pass the signal from `useBalance.ts` to `getXLMBalance`.
- Verify network requests are aborted in the network tab when the hook unmounts.

## Issue #35: Lack of pagination handling in `fetchContractEvents`, risking missing records for active trips

**Directory:** `lib/stellar/events.ts`

**Type:** Bug, Scalability

**Description:** The event polling helper limits results using `limit: 200`. If a trip has a high transaction volume and accumulates more than 200 events within the lookback ledgers, subsequent events are cut off and never synchronized, leaving the client state incomplete.

**Expected outcome:** Polling should retrieve all events by handling pagination cursor tokens.

**Acceptance criteria:**
- Add a loop or recursive paging logic in `fetchContractEvents` if the returned event count equals the limit.
- Ensure all events are fetched and parsed correctly.

## Issue #36: Deleting an expense does not clean up its ID from `expense_ids` in the `trips` table, causing database references to drift

**Directory:** `context/ExpenseContext.tsx`

**Type:** Database Integrity

**Description:** Deleting an expense from `ExpenseContext` removes it from the `expenses` table, but the containing trip still references the deleted ID in its `expense_ids` array, causing dead references and rendering bugs.

**Expected outcome:** Deleting an expense should clean up all associations in other tables.

**Acceptance criteria:**
- In `deleteExpense`, trigger a database update to remove the deleted `expenseId` from the `expense_ids` array in the `trips` table.
- Verify database referential integrity is preserved.

## Issue #37: Pool contract lacks actual token transfer (deposit/withdraw) logic, making it only a mock credit counter

**Directory:** `contract/src/pool.rs`

**Type:** Security, Smart Contract Architecture

**Description:** The `SettlementPoolContract` increments and decrements internal balances but does not custody or transfer actual Stellar assets (like XLM or custom SAC tokens). Users don't get any value back upon withdrawing from the pool, making it only a mock credit counter.

**Expected outcome:** The pool contract should handle actual token custody and transfers.

**Acceptance criteria:**
- Integrate Stellar Asset Contract (SAC) token transfer logic in the deposit and withdraw functions.
- Safely hold deposited tokens in the pool contract and transfer them back on withdrawal.

## Issue #38: Users cannot deposit funds directly into the pool contract because `deposit` requires admin authentication

**Directory:** `contract/src/pool.rs`

**Type:** Smart Contract UX, Security

**Description:** The `deposit` function in `pool.rs` requires admin authorization (`cfg.admin.require_auth()`). This prevents users from depositing their own funds directly, creating a centralized bottleneck.

**Expected outcome:** Users should be able to deposit their own funds by authenticating themselves.

**Acceptance criteria:**
- Allow any user to call `deposit` by using their own address auth rather than admin authorization.
- Integrate token transfer from the depositor to the pool.

## Issue #39: The pool contract lacks a method for users to withdraw their credits to their external wallets

**Directory:** `contract/src/pool.rs`

**Type:** Smart Contract Architecture

**Description:** The `withdraw` function only decrements the internal balance in storage. There is no mechanism to transfer actual assets from the contract's custody back to the user's wallet address, meaning withdrawn credits are simply burned without releasing tokens.

**Expected outcome:** Withdrawals should trigger token transfers back to the caller's address.

**Acceptance criteria:**
- Update the `withdraw` function to execute a token transfer of the corresponding amount from the contract to the `from` address.

## Issue #40: Lack of component unit tests for key forms and UI elements (ExpenseForm, TripForm, PayButton, QRCodeDisplay)

**Directory:** `__tests__/`

**Type:** Testing Coverage

**Description:** While there are unit tests for utilities and transaction building under `__tests__`, there are no component-level tests verifying user input handling, validation triggers, and event emission for primary forms like `ExpenseForm` and `TripForm`.

**Expected outcome:** Critical UI forms should be covered by unit tests.

**Acceptance criteria:**
- Add Jest + React Testing Library tests for `ExpenseForm` and `TripForm`.
- Cover mock input inputs, error validation messages, and submit clicks.

## Issue #41: Accumulated rounding errors in custom split calculations can cause the sum of shares to deviate from the total bill amount

**Directory:** `lib/split/calculator.ts`

**Type:** Bug, Split Accuracy

**Description:** In `lib/split/calculator.ts`, the `calculateCustomSplit` function divides weights and multiplies by `totalXLM`, formatting each share independently using `.toFixed(7)`. Unlike `calculateEqualSplit`, there is no remainder distribution for the last member, leaving a discrepancy between the total bill and the sum of shares.

**Expected outcome:** The sum of calculated custom shares plus the payer's share must exactly match the total bill amount.

**Acceptance criteria:**
- Update the custom split calculator to distribute rounding remainders to the final share.
- Add unit tests verifying zero-loss precision splits.
