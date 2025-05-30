import { expect, test } from '@playwright/test';

import { PageManager } from '../../pages/page-manager';
import { HomePage } from '../../pages/home-page';

test.describe('SUITE: Home', async () => {
    let pageManager: PageManager;
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        pageManager = new PageManager(page);
        homePage = pageManager.getHomePage();
        await homePage.navigateTo();
    });

    test('CASE_HOME_01: Sidebar should appear', async ({ page }) => {
        // page.on('dialog', async (dialog) => {
        //     await dialog.accept();
        // });

        await expect(homePage.getSidebarHeading('Recent Posts')).toBeVisible();
        await expect(homePage.getSidebarHeading('Recent Comments')).toBeVisible();
        await expect(homePage.getSidebarHeading('Archives')).toBeVisible();
        await expect(homePage.getSidebarHeading('Categories')).toBeVisible();
    });

    test('CASE_HOME_02: Footer should appear', async ({ page }) => {
        await expect(homePage.footerCopyright).toContainText('© 2025 Playwright practice site - Dev environment', { ignoreCase: true });
    });
});
