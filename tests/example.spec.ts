// import { expect, test } from '@playwright/test';

// import { TodoPage } from './PageObjects/TodoPage';

// let todoPage: TodoPage;

// test.describe('check todo page', async () => {
//     test.beforeEach(async ({ page }) => {
//         todoPage = new TodoPage(page);
//         await todoPage.navigateTo();
//     });

//     test('Check todo list', async ({ page }) => {
//         page.on('dialog', async (dialog) => {
//             await dialog.accept();
//         });

//         await todoPage.addNTodo(100);
//         await todoPage.deleteOddNumberedTodos(100);

//         // c. Kiểm tra todo có số thứ tự 90 nằm trong viewport.
//         await expect(page.locator('#task-list li:has-text("Todo 90")')).toBeVisible();
//         // d. Kiểm tra todo có số thứ tự 21 bị ẩn (không nằm trong DOM)
//         await expect(page.locator('#task-list li:has-text("Todo 21")')).not.toBeVisible();
//     });
// });
