import { Page } from '@playwright/test';

export class BasePage {
    url: string;
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }
}
