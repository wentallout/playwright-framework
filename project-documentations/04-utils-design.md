# Utils Design Guideline

Utility functions are helper functions that perform common, reusable tasks not specific to a single Page Object Model (POM) or test case. They help keep your test code DRY (Don't Repeat Yourself) and more organized.

## 1. Purpose and Scope

-   **Generic Tasks:** Utilities should handle generic tasks like data generation/manipulation, date/time formatting, string operations, random value generation, file operations, or common calculations.
-   **Cross-Cutting Concerns:** They can also encapsulate logic that might be used across various parts of your testing framework (e.g., custom logging, specific API call helpers not tied to a resource).
-   **Avoid UI Logic:** As a general rule, utilities should _not_ contain Playwright `page` or `locator` interactions. Such logic belongs in Page Object Models.
-   **Exception:** Very generic UI helper functions that are not page-specific and are used across many pages _could_ be considered, but this should be rare. For example, a generic "scroll to bottom of page" if not part of a standard POM action.

## 2. File Naming and Organization

-   Avoid creating a single massive `common-utils.ts` file if it becomes too large and hard to navigate.
-   **Location:** Keep them in the `utils` directory as per your folder design.

## 3. Design Principles

-   Each utility function should do one specific thing and do it well (SRP - Single Responsibility)
-   Utilities should handle potential errors gracefully, throw a specific `Error`.

-   **Pure Functions:** Prefer pure functions where possible. A pure function is one where:

    -   The return value is solely determined by its input values.
    -   It does not have any observable side effects (e.g., modifying global state, writing to a file, making an API call unless that's its explicit purpose).

    ```typescript
    // Good: Pure function
    export function formatDate(date: Date, format: string): string {
        // ... formatting logic ...
        return 'formattedDate';
    }
    ```

-   **Clear Inputs and Outputs:**
    -   Functions should have clearly defined parameters with appropriate TypeScript types.
    -   Return types should also be clearly defined.
    -   Avoid functions that take a large number of boolean flags to alter behavior; consider separate functions instead.
-   **No Global State (within utils):** Utilities should generally not rely on or modify global state within the `utils` module itself. If they need configuration, it should be passed in as parameters.
-   **Testability:** Design utilities so they can be easily unit tested if necessary (though for simple utils, this might be overkill if they are well-covered by your E2E tests).
-   **Error Handling:**
    -   .
    -   For invalid inputs, they might or return a predefined value (e.g., `null`, `undefined`), clearly documented in JSDoc.
    -   Follow the general error handling guidelines defined in `06-coding-convention-design.md`.

## Examples of Utility Categories

-   **`data-generator-util.ts`:**
    -   `generateRandomEmail()`
    -   `generateRandomPhoneNumber()`
    -   `getRandomElementFromArray<T>(arr: T[]): T`
-   **`date-time-util.ts`:**
    -   `getCurrentTimestamp(): number`
    -   `formatDateToYyyyMmDd(date: Date): string`
    -   `addDaysToDate(date: Date, days: number): Date`
-   **`string-util.ts`:**
    -   `capitalizeFirstLetter(str: string): string`
    -   `truncateString(str: string, maxLength: number): string`
-   **`file-util.ts` (if needed for test data setup/teardown):**
    -   `readFileAsJson(filePath: string): Promise<any>`
    -   `downloadFile(url: string, destinationPath: string): Promise<void>` (might use `axios` or Node's `http` module)
