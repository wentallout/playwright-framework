import { test as setup } from '@playwright/test';

setup('Global setup', async () => {
    console.log('From global setup - initialize project');
});
