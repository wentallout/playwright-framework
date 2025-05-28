# POM Design

We need to create many POMs and one POM Manager.

## POM Manager

`page-manager.ts`

```ts
import { Locator, Page } from '@playwright/test';
import { LoginPage } from './login-page';

export class PageManager {
    page: Page;
    totalPrice: Locator;

    constructor(page: Page) {
        this.page = page;
    }

    getLoginPage(): LoginPage {
        return new LoginPage(this.page);
    }
}
```

## BasePage (to help with `extends`)

`base-page.ts`

```ts
import { Page, Locator } from '@playwright/test';

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
```

## POM

`login-page.ts`

```ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
    readonly url: string = 'https://pw-practice-dev.playwrightvn.com/wp-admin';
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('//input[@id="user_login"]');
        this.passwordInput = page.locator('//input[@id="user_pass"]');
        this.loginButton = page.locator('//input[@id="wp-submit"]');
        this.errorMessage = page.locator('//div[@id="login_error"]');
    }

    async fillUserName(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async inputCredAndPressLoginButton(username: string, password: string) {
        await this.fillUserName(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }
}
```
