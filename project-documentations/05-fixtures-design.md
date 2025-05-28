# Fixture Design

## What are fixtures?

In Playwright, fixtures are functions that run before (and sometimes after) your tests. They are used to:

-   Set up preconditions: This could be anything from logging in a user, preparing test data, initializing a Page Object Model (POM), or setting up a specific browser context.
-   Provide data or objects to tests: Fixtures can pass data, page objects, or utility instances directly into your test functions as parameters.
-   Manage teardown: They can clean up resources after a test, like logging out a user, deleting test data, or closing database connections.

## Example

```ts
import { test as base, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page'; // Assuming you have a LoginPage POM
import { DashboardPage } from '../pages/admin/dashboard-page'; // Assuming a DashboardPage POM
import { ADMIN_USER, ADMIN_PASSWORD, BASE_URL } from '../config'; // Assuming config file for credentials

type MyFixtures = {
    adminPage: Page; // A page object already logged in as admin
    dashboardPage: DashboardPage; // An instance of the DashboardPage POM
};

// Extend the base test with your custom fixtures
export const test = base.extend<MyFixtures>({
    // Fixture to provide a page that is already logged in as an admin
    adminPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(ADMIN_USER, ADMIN_PASSWORD);

        // Verify login was successful by checking for a dashboard element or URL
        await expect(page).toHaveURL(/wp-admin/);
        await expect(page.locator('#wpadminbar')).toBeVisible();

        // Provide the logged-in page to the test
        await use(page);

        // Teardown: Logout (optional, depending on test strategy)
        // For simplicity, we'll rely on context isolation or a separate logout fixture if needed.
        // Example: await page.goto(`${BASE_URL}/wp-login.php?action=logout`);
        // await page.locator('a[href*="wp-login.php?action=logout"]').click(); // This might need a nonce
        console.log('Admin user logged out (or context closed).');
    },

    // Fixture to provide an instance of the DashboardPage POM,
    // depending on the adminPage fixture to ensure the user is logged in.
    dashboardPage: async ({ adminPage }, use) => {
        const dashboardPage = new DashboardPage(adminPage);
        await dashboardPage.goto(); // Or ensure it's already on the dashboard from adminPage
        await use(dashboardPage);
    },
});

export { expect } from '@playwright/test';
```
