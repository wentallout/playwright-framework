import { Page } from '@playwright/test';
import { HomePage } from './home-page';

export class PageManager {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getHomePage() {
        return new HomePage(this.page);
    }
}
