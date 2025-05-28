# Coding Convention

## 1. File Naming

-   **Page Object Files:** `[page-name]-page.ts`
-   **Test Spec Files:** `[feature-name].spec.ts`
-   **API Service Files:** `[service-name]-api.ts`
-   **Fixture Files:** `[fixture-name]-fixture.ts`
-   **Utility Files:** `[util-name]-util.ts`

## Type naming

```js
type NewsArticle = {
    articleId: string,
    articleTitle: string,
    articleBody: string,
};
```

## 2. Naming Conventions

-   **Variables and Functions:** Use `camelCase`.
    ```typescript
    const userName = 'testUser';
    async function getUserDetails() {
        /* ... */
    }
    ```
-   **Class Names:** Use `PascalCase`.
    ```typescript
    class LoginPage {
        /* ... */
    }
    ```
-   **Constants:** Use `UPPER_SNAKE_CASE` for true constants (values that never change).
    ```typescript
    const MAX_LOGIN_ATTEMPTS = 3;
    const BASE_URL = 'https://pw-practice-dev.playwrightvn.com/';
    ```
-   **Interface and Type Aliases:** Use `PascalCase`.

    ```typescript
    interface UserProfile {
        userId: string;
        email: string;
    }

    type ApiResponse<T> = {
        success: boolean;
        data: T;
        error?: string;
    };
    ```

-   **Enum Members:** Use `PascalCase`.
    ```typescript
    enum UserRole {
        Admin,
        Editor,
        Viewer,
    }
    ```

## 3. Coding Style

-   **Indentation:** Use 4 spaces for indentation.
-   **Line Length:** Aim for a maximum line length of 100-120 characters for better readability.
-   **Semicolons:** Use semicolons at the end of statements.
-   **Quotes:** Use single quotes (`'`) for strings, unless double quotes (`"`) are needed (e.g., in JSON).
-   **Braces:** Use opening braces on the same line for blocks (classes, functions, if statements, etc.).
    ```typescript
    if (condition) {
        // do something
    } else {
        // do something else
    }
    ```
-   **Async/Await:** Always use `async/await` for Playwright operations. Avoid mixing `Promise.then()` with `async/await` in the same logical block if possible.

    ```typescript
    // Good
    async function login(page: Page, user: string, pass: string) {
        await page.getByLabel('Username').fill(user);
        await page.getByLabel('Password').fill(pass);
        await page.getByRole('button', { name: 'Log In' }).click();
    }

    // Avoid if possible, prefer consistency
    async function fetchData(page: Page) {
        const responsePromise = page.waitForResponse('**/api/data');
        await page.click('#fetchDataButton');
        responsePromise.then((response) => {
            console.log(response.status());
        });
    }
    ```

## 4. Playwright Specific Conventions

-   **Selectors:**

    -   Prefer user-facing attributes like `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByTestId`.
    -   Use `page.locator()` with CSS or XPath as a last resort.
    -   Store frequently used selectors as constants or private readonly members within Page Object Models.

    ```typescript
    // In a POM class
    private readonly usernameInput = this.page.getByLabel('Username');
    private readonly loginButton = this.page.getByRole('button', { name: 'Log In' });

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }
    ```

-   **Page Object Models (POMs):**
    -   Each POM should represent a single page or a significant component on a page.
    -   POMs should encapsulate page elements and actions performed on those elements.
    -   Methods in POMs should return `Promise<void>` or `Promise<NextPageObjectModel>` if an action leads to a new page.
    -   Avoid assertions within POMs; keep assertions in test files.
-   **Tests (`.spec.ts` files):**
    -   Use descriptive `test()` and `describe()` block names.
    -   Structure tests using the "Arrange-Act-Assert" (AAA) pattern.
    -   Keep tests independent and avoid dependencies between them.
    -   Use `test.beforeEach`, `test.afterEach`, `test.beforeAll`, `test.afterAll` hooks appropriately for setup and teardown.
-   **Assertions:**
    -   Use Playwright's built-in `expect()` for assertions.
    -   Make assertions as specific as possible.
    -   `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`, `expect(page).toHaveURL()`.
-   **Fixtures:**
    -   Use fixtures to set up preconditions for tests (e.g., logged-in user, specific data state).
    -   Name fixture files clearly (e.g., `user.fixture.ts`).

## 5. Imports

-   Organize imports:
    1.  Node.js built-in modules
    2.  External npm packages (e.g., `@playwright/test`)
    3.  Internal modules (project files), using absolute paths or defined path aliases if configured.
-   Avoid using `../` excessively. Configure path aliases in `tsconfig.json` if needed for cleaner imports.

## 6. Comments

-   Write clear and concise comments to explain complex logic, workarounds, or important decisions.
-   Avoid obvious comments that just restate the code.
-   Use `// TODO:` for tasks that need to be done.
-   Use `// FIXME:` for issues that need to be fixed.

## 7. Linting and Formatting

-   Use **ESLint** for static code analysis to catch errors and enforce coding standards.
-   Use **Prettier** for automatic code formatting to ensure consistent style.
-   Configure these tools with rules that align with these conventions.

## 8. Configuration

-   Use environment variables for sensitive data (credentials, API keys) and environment-specific configurations (base URLs).
-   Store configuration in `playwright.config.ts`.

## 9. Error Handling

-   Use `try...catch` blocks for operations that might fail, especially around API calls or complex UI interactions where appropriate.
-   Provide meaningful and contextual error messages.
-   **Distinguish between expected and unexpected errors.**
    -   For expected failures (e.g., testing an error message display), use assertions to verify the error state.
    -   For unexpected failures during test execution, let Playwright's default error reporting handle it or catch and re-throw with more context if necessary.

*   **Specific Scenarios & Strategies:**

    -   **Element Interactivity:** Playwright's auto-waiting mechanism handles many cases where elements are not immediately available. However, for truly dynamic content or conditional elements, you might need explicit checks.
        ```typescript
        // Example: Optional element interaction
        const optionalButton = page.locator('#optionalFeatureButton');
        if (await optionalButton.isVisible({ timeout: 5000 })) {
            // Give it a reasonable timeout
            await optionalButton.click();
        } else {
            console.log('Optional feature button not visible, proceeding without interaction.');
            // Potentially log this as a warning or note for the test report
        }
        ```
    -   **API Calls within Tests:** When making direct API calls (e.g., for test setup or data validation), always handle potential network errors or non-success status codes.

        ```typescript
        import { APIRequestContext, expect } from '@playwright/test';

        async function fetchUserData(request: APIRequestContext, userId: string) {
            try {
                const response = await request.get(`/api/users/${userId}`);
                if (!response.ok()) {
                    throw new Error(`API Error: Failed to fetch user ${userId}. Status: ${response.status()}, Body: ${await response.text()}`);
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Decide whether to re-throw, return a default, or handle specifically
                throw error; // Re-throwing is often best to fail the test
            }
        }
        ```

    -   **Custom Error Classes:** For complex applications, defining custom error classes can help in categorizing and handling specific types of failures more effectively.

        ```typescript
        class AuthenticationError extends Error {
            constructor(message: string) {
                super(message);
                this.name = 'AuthenticationError';
            }
        }

        // Usage:
        // if (loginFailed) {
        //     throw new AuthenticationError('Login failed due to invalid credentials.');
        // }
        ```

    -   **Fixture Errors:** If an error occurs during a fixture setup or teardown, Playwright will typically mark the test as failed. Ensure fixture code is robust. Use `try...finally` in fixtures for cleanup actions that must run even if setup fails.
    -   **Timeouts:** While Playwright has default timeouts, be mindful of operations that might take longer. Adjust timeouts locally for specific actions (`locator.click({ timeout: 10000 })`) or globally in `playwright.config.ts` if necessary, but avoid overly long global timeouts.
    -   **Logging:** Supplement `try...catch` with good logging. Log relevant information (e.g., parameters, state) before a potentially failing operation and log the error details within the catch block. This is invaluable for debugging.
    -   **Avoid Swallowing Errors:** Don't catch errors just to ignore them, unless there's a very specific reason (e.g., an optional cleanup step). This can hide real problems. If you catch an error and don't re-throw it, ensure the test's intent is still met or clearly log why it's being handled.

*   **Rethrowing Errors:** When catching an error to add more context, it's often best to re-throw the original error or a new error that wraps the original to ensure the test fails correctly and Playwright's reporting mechanisms (like tracing) capture the failure.
    ```typescript
    try {
        await page.locator('#critical-element').click();
    } catch (e) {
        throw new Error(`Failed to click #critical-element on ${page.url()}: ${e.message}`);
    }
    ```
