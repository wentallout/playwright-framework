import { BasePage } from './base-page';
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    readonly url: string = 'https://pw-practice-dev.playwrightvn.com';

    readonly getSidebarHeading: Function;
    readonly footerCopyright: Locator;

    constructor(page: Page) {
        super(page);
        this.getSidebarHeading = (heading: string) => this.page.locator(`h2.wp-block-heading:has-text("${heading}")`);
        this.footerCopyright = this.page.locator(`footer .copyright`);
    }
}
