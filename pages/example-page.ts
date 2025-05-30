import { BasePage } from './base-page';
import { Page, Locator } from '@playwright/test';

export class ExamplePage extends BasePage {
    readonly url: string = 'https://pw-practice-dev.playwrightvn.com/wp-admin';
    readonly usernameInput: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('//input[@id="user_login"]');
    }

    async fillUserName(username: string) {
        await this.usernameInput.fill(username);
    }
}
